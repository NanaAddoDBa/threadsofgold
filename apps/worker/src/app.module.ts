import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validateWorkerEnvironment } from "./config/environment.js";
import { WorkerReadinessService } from "./operations/readiness.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [".env.local", ".env"],
      isGlobal: true,
      validate: validateWorkerEnvironment,
    }),
  ],
  providers: [WorkerReadinessService],
})
export class AppModule {}
