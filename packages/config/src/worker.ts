import { z } from "zod";

import { applicationEnvironmentSchema } from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

export const workerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
  })
  .strict();

export interface WorkerEnvironmentInput {
  APP_ENV?: unknown;
}

export type WorkerEnvironment = z.output<typeof workerEnvironmentSchema>;

export function parseWorkerEnvironment(
  input: WorkerEnvironmentInput,
): WorkerEnvironment {
  return parseEnvironment("worker", workerEnvironmentSchema, input);
}
