import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const DEFAULT_API_PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("ApiBootstrap");
  const configuredPort = Number(process.env.PORT ?? DEFAULT_API_PORT);
  const port =
    Number.isInteger(configuredPort) && configuredPort > 0
      ? configuredPort
      : DEFAULT_API_PORT;

  app.enableShutdownHooks();
  await app.listen(port, "0.0.0.0");
  logger.log(`API foundation listening on port ${port}`);
}

await bootstrap();
