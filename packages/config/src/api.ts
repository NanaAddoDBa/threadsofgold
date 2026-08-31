import { z } from "zod";

import {
  applicationEnvironmentSchema,
  booleanEnvironmentSchema,
  hostSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  isLoopbackHost,
  optionalPostgreSqlUrlSchema,
  optionalRedisUrlSchema,
  portSchema,
} from "./common.js";
import {
  addObservabilityEnvironmentIssues,
  observabilityEnvironmentShape,
} from "./observability.js";
import { parseEnvironment } from "./parse-environment.js";

export const apiEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    FOUNDATION_RUNTIME_ENABLED: booleanEnvironmentSchema.default(false),
    DATABASE_URL: optionalPostgreSqlUrlSchema,
    REDIS_URL: optionalRedisUrlSchema,
    HOST: hostSchema,
    PORT: portSchema,
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

    if (!isLoopbackHost(environment.HOST)) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton requires a loopback API listener.",
        path: ["HOST"],
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
  });

export interface ApiEnvironmentInput {
  APP_ENV?: unknown;
  FOUNDATION_RUNTIME_ENABLED?: unknown;
  DATABASE_URL?: unknown;
  REDIS_URL?: unknown;
  HOST?: unknown;
  PORT?: unknown;
  LOG_LEVEL?: unknown;
  APP_RELEASE?: unknown;
  OTEL_ENABLED?: unknown;
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: unknown;
  OTEL_TRACES_SAMPLER_ARG?: unknown;
  SENTRY_ENABLED?: unknown;
  SENTRY_DSN?: unknown;
}

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;

export function parseApiEnvironment(
  input: ApiEnvironmentInput,
): ApiEnvironment {
  return parseEnvironment("API", apiEnvironmentSchema, input);
}
