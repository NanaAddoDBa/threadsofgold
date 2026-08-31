import "reflect-metadata";

import type { INestApplication } from "@nestjs/common";
import type { ApiEnvironment } from "@threadsofgold/config/api";

import { apiObservability } from "./instrumentation.js";

async function closeApplication(
  application: INestApplication,
  event: string,
): Promise<boolean> {
  try {
    await application.close();
    return true;
  } catch (error) {
    apiObservability.logger.error(
      "API application shutdown failed",
      { event },
      error,
    );
    apiObservability.reportException(error);
    return false;
  }
}

async function bootstrap(): Promise<void> {
  let application: INestApplication | undefined;

  try {
    const [{ ConfigService }, { createApiApplication }] = await Promise.all([
      import("@nestjs/config"),
      import("./create-app.js"),
    ]);

    application = await createApiApplication(apiObservability);
    const configuration = application.get(ConfigService<ApiEnvironment, true>);
    const host = configuration.get("HOST", { infer: true });
    const port = configuration.get("PORT", { infer: true });
    let shutdownPromise: Promise<void> | undefined;

    const shutdown = (signal: NodeJS.Signals): Promise<void> => {
      shutdownPromise ??= (async () => {
        apiObservability.logger.info("API shutdown requested", {
          event: "api_shutdown_requested",
          signal,
        });
        const closed = await closeApplication(
          application as INestApplication,
          "api_shutdown_failed",
        );
        await apiObservability.shutdown();
        process.exitCode = closed ? 0 : 1;
      })();

      return shutdownPromise;
    };

    process.once("SIGINT", () => void shutdown("SIGINT"));
    process.once("SIGTERM", () => void shutdown("SIGTERM"));

    await application.listen(port, host);
    apiObservability.logger.info("API listening", {
      event: "api_listening",
      host,
      port,
    });
  } catch (error) {
    if (application !== undefined) {
      await closeApplication(application, "api_startup_cleanup_failed");
    }

    apiObservability.logger.fatal(
      "API startup failed",
      { event: "api_startup_failed" },
      error,
    );
    apiObservability.reportException(error);
    await apiObservability.shutdown();
    process.exitCode = 1;
  }
}

await bootstrap();
