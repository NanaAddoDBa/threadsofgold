import { z } from "zod";

import {
  applicationEnvironmentSchema,
  isDeployedEnvironment,
  releaseIdentifierSchema,
  type ApplicationEnvironment,
} from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

const booleanEnvironmentSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

const optionalHttpUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z.url({ protocol: /^https?$/ }).optional(),
);

export const logLevelSchema = z.enum([
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
]);

export const observabilityEnvironmentShape = {
  LOG_LEVEL: logLevelSchema.default("info"),
  APP_RELEASE: releaseIdentifierSchema,
  OTEL_ENABLED: booleanEnvironmentSchema.default(false),
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: optionalHttpUrlSchema,
  OTEL_TRACES_SAMPLER_ARG: z
    .union([z.number(), z.string().trim().min(1)])
    .pipe(z.coerce.number<string | number>().min(0).max(1))
    .default(0.1),
  SENTRY_ENABLED: booleanEnvironmentSchema.default(false),
  SENTRY_DSN: optionalHttpUrlSchema,
} as const;

const observabilityEnvironmentObjectSchema = z.object(
  observabilityEnvironmentShape,
);

export type ObservabilityEnvironment = z.output<
  typeof observabilityEnvironmentObjectSchema
>;

export interface ObservabilityEnvironmentInput {
  LOG_LEVEL?: unknown;
  APP_RELEASE?: unknown;
  OTEL_ENABLED?: unknown;
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: unknown;
  OTEL_TRACES_SAMPLER_ARG?: unknown;
  SENTRY_ENABLED?: unknown;
  SENTRY_DSN?: unknown;
}

export function addObservabilityEnvironmentIssues(
  environment: ObservabilityEnvironment & {
    APP_ENV: ApplicationEnvironment;
  },
  context: z.RefinementCtx,
): void {
  if (
    environment.OTEL_ENABLED &&
    environment.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT === undefined
  ) {
    context.addIssue({
      code: "custom",
      message: "Required when OTEL_ENABLED is true.",
      path: ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"],
    });
  }

  if (environment.SENTRY_ENABLED && environment.SENTRY_DSN === undefined) {
    context.addIssue({
      code: "custom",
      message: "Required when SENTRY_ENABLED is true.",
      path: ["SENTRY_DSN"],
    });
  }

  if (
    isDeployedEnvironment(environment.APP_ENV) &&
    environment.APP_RELEASE === "local"
  ) {
    context.addIssue({
      code: "custom",
      message:
        "Must be an immutable build or deployment identifier outside local and test environments.",
      path: ["APP_RELEASE"],
    });
  }
}

export const observabilityEnvironmentSchema =
  observabilityEnvironmentObjectSchema
    .extend({ APP_ENV: applicationEnvironmentSchema })
    .strict()
    .superRefine(addObservabilityEnvironmentIssues);

export function parseObservabilityEnvironment(
  input: ObservabilityEnvironmentInput & { APP_ENV?: unknown },
): ObservabilityEnvironment & { APP_ENV: ApplicationEnvironment } {
  return parseEnvironment(
    "observability",
    observabilityEnvironmentSchema,
    input,
  );
}
