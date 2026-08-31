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

export const workerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    HEALTH_HOST: hostSchema,
    HEALTH_PORT: portSchema.default(4001),
    ...observabilityEnvironmentShape,
  })
  .strict()
  .superRefine(addObservabilityEnvironmentIssues);

export interface WorkerEnvironmentInput {
  APP_ENV?: unknown;
  HEALTH_HOST?: unknown;
  HEALTH_PORT?: unknown;
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
