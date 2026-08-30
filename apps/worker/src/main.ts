import "reflect-metadata";

import type { INestApplicationContext } from "@nestjs/common";
import type { WorkerEnvironment } from "@threadsofgold/config/worker";

import { workerObservability } from "./instrumentation.js";

const IDLE_INTERVAL_MS = 60_000;

async function closeApplication(
  application: INestApplicationContext,
  event: string,
): Promise<boolean> {
  try {
    await application.close();
    return true;
  } catch (error) {
    workerObservability.logger.error(
      "Worker application shutdown failed",
      { event },
      error,
    );
    workerObservability.reportException(error);
    return false;
  }
}

async function bootstrap(): Promise<void> {
  let application: INestApplicationContext | undefined;

  try {
    const [{ ConfigService }, { createWorkerApplication }] = await Promise.all([
      import("@nestjs/config"),
      import("./create-app.js"),
    ]);

    application = await createWorkerApplication(workerObservability);
    const configuration = application.get(
      ConfigService<WorkerEnvironment, true>,
    );
    const idleHandle = setInterval(() => undefined, IDLE_INTERVAL_MS);
    const environment = configuration.get("APP_ENV", { infer: true });
    let shutdownPromise: Promise<void> | undefined;

    const shutdown = (signal: NodeJS.Signals): Promise<void> => {
      shutdownPromise ??= (async () => {
        workerObservability.logger.info("Worker shutdown requested", {
          event: "worker_shutdown_requested",
          signal,
        });
        clearInterval(idleHandle);
        const closed = await closeApplication(
          application as INestApplicationContext,
          "worker_shutdown_failed",
        );
        await workerObservability.shutdown();
        process.exitCode = closed ? 0 : 1;
      })();

      return shutdownPromise;
    };

    process.once("SIGINT", () => void shutdown("SIGINT"));
    process.once("SIGTERM", () => void shutdown("SIGTERM"));
    workerObservability.logger.info("Worker foundation ready", {
      app_environment: environment,
      event: "worker_ready",
      queue_connected: false,
    });
  } catch (error) {
    if (application !== undefined) {
      await closeApplication(application, "worker_startup_cleanup_failed");
    }

    workerObservability.logger.fatal(
      "Worker startup failed",
      { event: "worker_startup_failed" },
      error,
    );
    workerObservability.reportException(error);
    await workerObservability.shutdown();
    process.exitCode = 1;
  }
}

await bootstrap();
