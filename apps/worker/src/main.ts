import "reflect-metadata";

import type { Server } from "node:http";

import type { INestApplicationContext } from "@nestjs/common";
import type { WorkerEnvironment } from "@threadsofgold/config/worker";

import { workerObservability } from "./instrumentation.js";
import { WorkerReadinessService } from "./operations/readiness.service.js";
import {
  closeWorkerOperationsServer,
  startWorkerOperationsServer,
} from "./operations/server.js";

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
  let operationsServer: Server | undefined;

  try {
    const [{ ConfigService }, { createWorkerApplication }] = await Promise.all([
      import("@nestjs/config"),
      import("./create-app.js"),
    ]);

    application = await createWorkerApplication(workerObservability);
    const configuration = application.get(
      ConfigService<WorkerEnvironment, true>,
    );
    const environment = configuration.get("APP_ENV", { infer: true });
    const healthHost = configuration.get("HEALTH_HOST", { infer: true });
    const healthPort = configuration.get("HEALTH_PORT", { infer: true });
    const release = configuration.get("APP_RELEASE", { infer: true });
    const readiness = application.get(WorkerReadinessService);
    operationsServer = await startWorkerOperationsServer({
      environment,
      host: healthHost,
      logger: workerObservability.logger,
      port: healthPort,
      readiness,
      release,
    });
    let shutdownPromise: Promise<void> | undefined;

    const shutdown = (signal: NodeJS.Signals): Promise<void> => {
      shutdownPromise ??= (async () => {
        workerObservability.logger.info("Worker shutdown requested", {
          event: "worker_shutdown_requested",
          signal,
        });
        if (operationsServer !== undefined) {
          await closeWorkerOperationsServer(operationsServer);
        }
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
      queue_connected: configuration.get("FOUNDATION_RUNTIME_ENABLED", {
        infer: true,
      }),
    });
  } catch (error) {
    if (operationsServer !== undefined) {
      await closeWorkerOperationsServer(operationsServer).catch(
        () => undefined,
      );
    }
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
