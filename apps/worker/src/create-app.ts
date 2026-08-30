import { NestFactory } from "@nestjs/core";
import type { INestApplicationContext } from "@nestjs/common";
import type { ObservabilityRuntime } from "@threadsofgold/observability";

import { AppModule } from "./app.module.js";
import { NestStructuredLogger } from "./observability/nest-logger.js";

export async function createWorkerApplication(
  observability: ObservabilityRuntime,
): Promise<INestApplicationContext> {
  const application = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  application.useLogger(new NestStructuredLogger(observability.logger));
  application.flushLogs();

  return application;
}
