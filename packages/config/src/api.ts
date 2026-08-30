import { z } from "zod";

import {
  applicationEnvironmentSchema,
  hostSchema,
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
    HOST: hostSchema,
    PORT: portSchema,
    ...observabilityEnvironmentShape,
  })
  .strict()
  .superRefine(addObservabilityEnvironmentIssues);

export interface ApiEnvironmentInput {
  APP_ENV?: unknown;
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
