import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { ApiEnvironment } from "@threadsofgold/config/api";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigService<ApiEnvironment, true>);
  const logger = new Logger("ApiBootstrap");
  const host = configuration.get("HOST", { infer: true });
  const port = configuration.get("PORT", { infer: true });

  app.enableShutdownHooks();
  await app.listen(port, host);
  logger.log(`API foundation listening on ${host}:${port}`);
}

await bootstrap();
