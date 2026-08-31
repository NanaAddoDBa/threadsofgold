import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller.js";
import { validateApiEnvironment } from "./config/environment.js";
import { FoundationController } from "./foundation/foundation.controller.js";
import { FoundationRuntimeService } from "./foundation/foundation-runtime.service.js";
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
  controllers: [AppController, FoundationController, HealthController],
  providers: [FoundationRuntimeService, HealthService],
})
export class AppModule {}
