import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { VersioningType, type INestApplication } from "@nestjs/common";
import type { ObservabilityRuntime } from "@threadsofgold/observability";

import { AppModule } from "./app.module.js";
import { NestStructuredLogger } from "./observability/nest-logger.js";
import { createRequestObservabilityMiddleware } from "./observability/request-middleware.js";
import { UnexpectedExceptionFilter } from "./observability/unexpected-exception.filter.js";

export async function createApiApplication(
  observability: ObservabilityRuntime,
): Promise<INestApplication> {
  const application = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  application.useLogger(new NestStructuredLogger(observability.logger));
  application.flushLogs();
  application.enableVersioning({
    defaultVersion: "1",
    prefix: "v",
    type: VersioningType.URI,
  });
  application.use(createRequestObservabilityMiddleware(observability.logger));

  const adapterHost = application.get(HttpAdapterHost);
  application.useGlobalFilters(
    new UnexpectedExceptionFilter(observability, adapterHost.httpAdapter),
  );

  return application;
}
