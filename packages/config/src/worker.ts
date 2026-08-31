import { z } from "zod";

import {
  applicationEnvironmentSchema,
  booleanEnvironmentSchema,
  hostSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  optionalPostgreSqlUrlSchema,
  optionalRedisUrlSchema,
  portSchema,
} from "./common.js";
import {
  addObservabilityEnvironmentIssues,
  observabilityEnvironmentShape,
} from "./observability.js";
import { parseEnvironment } from "./parse-environment.js";

export const workerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    FOUNDATION_RUNTIME_ENABLED: booleanEnvironmentSchema.default(false),
    DATABASE_URL: optionalPostgreSqlUrlSchema,
    REDIS_URL: optionalRedisUrlSchema,
    HEALTH_HOST: hostSchema,
    HEALTH_PORT: portSchema.default(4001),
    SMTP_HOST: hostSchema,
    SMTP_PORT: portSchema.default(1025),
    FOUNDATION_NOTIFICATION_TO: z
      .literal("foundation@threadsofgold.invalid")
      .default("foundation@threadsofgold.invalid"),
    ...observabilityEnvironmentShape,
  })
  .strict()
  .superRefine((environment, context) => {
    addObservabilityEnvironmentIssues(environment, context);

    if (!environment.FOUNDATION_RUNTIME_ENABLED) return;

    if (isDeployedEnvironment(environment.APP_ENV)) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton cannot be enabled when deployed.",
        path: ["FOUNDATION_RUNTIME_ENABLED"],
      });
    }

    if (environment.DATABASE_URL === undefined) {
      context.addIssue({
        code: "custom",
        message: "Required when FOUNDATION_RUNTIME_ENABLED is true.",
        path: ["DATABASE_URL"],
      });
    }

    if (
      environment.DATABASE_URL !== undefined &&
      !isLocalOrUnspecifiedOrigin(environment.DATABASE_URL)
    ) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton requires a loopback database.",
        path: ["DATABASE_URL"],
      });
    }

    if (environment.REDIS_URL === undefined) {
      context.addIssue({
        code: "custom",
        message: "Required when FOUNDATION_RUNTIME_ENABLED is true.",
        path: ["REDIS_URL"],
      });
    }

    if (
      environment.REDIS_URL !== undefined &&
      !isLocalOrUnspecifiedOrigin(environment.REDIS_URL)
    ) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton requires a loopback Redis server.",
        path: ["REDIS_URL"],
      });
    }

    if (
      environment.SMTP_HOST !== "127.0.0.1" &&
      environment.SMTP_HOST !== "localhost" &&
      environment.SMTP_HOST !== "::1"
    ) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton requires a loopback SMTP server.",
        path: ["SMTP_HOST"],
      });
    }
  });

export interface WorkerEnvironmentInput {
  APP_ENV?: unknown;
  FOUNDATION_RUNTIME_ENABLED?: unknown;
  DATABASE_URL?: unknown;
  REDIS_URL?: unknown;
  HEALTH_HOST?: unknown;
  HEALTH_PORT?: unknown;
  SMTP_HOST?: unknown;
  SMTP_PORT?: unknown;
  FOUNDATION_NOTIFICATION_TO?: unknown;
  LOG_LEVEL?: unknown;
  APP_RELEASE?: unknown;
  OTEL_ENABLED?: unknown;
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: unknown;
  OTEL_TRACES_SAMPLER_ARG?: unknown;
  SENTRY_ENABLED?: unknown;
  SENTRY_DSN?: unknown;
}

export type WorkerEnvironment = z.output<typeof workerEnvironmentSchema>;

export function parseWorkerEnvironment(
  input: WorkerEnvironmentInput,
): WorkerEnvironment {
  return parseEnvironment("worker", workerEnvironmentSchema, input);
}
