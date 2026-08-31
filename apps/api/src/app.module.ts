import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller.js";
import { validateApiEnvironment } from "./config/environment.js";
import { HealthController } from "./operations/health.controller.js";
import { HealthService } from "./operations/health.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [".env.local", ".env"],
      isGlobal: true,
      validate: validateApiEnvironment,
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [HealthService],
})
export class AppModule {}
