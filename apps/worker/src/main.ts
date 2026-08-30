import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { WorkerEnvironment } from "@threadsofgold/config/worker";

import { AppModule } from "./app.module.js";

const IDLE_INTERVAL_MS = 60_000;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configuration = app.get(ConfigService<WorkerEnvironment, true>);
  const logger = new Logger("WorkerBootstrap");
  const idleHandle = setInterval(() => undefined, IDLE_INTERVAL_MS);
  const environment = configuration.get("APP_ENV", { infer: true });

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.log(`Worker foundation received ${signal}`);
    clearInterval(idleHandle);
    await app.close();
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  logger.log(
    `Worker foundation ready in ${environment}; queue processing is not connected`,
  );
}

await bootstrap();
