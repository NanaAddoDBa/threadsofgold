import { z } from "zod";

import {
  applicationEnvironmentSchema,
  hostSchema,
  portSchema,
} from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

export const apiEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    HOST: hostSchema,
    PORT: portSchema,
  })
  .strict();

export interface ApiEnvironmentInput {
  APP_ENV?: unknown;
  HOST?: unknown;
  PORT?: unknown;
}

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;

export function parseApiEnvironment(
  input: ApiEnvironmentInput,
): ApiEnvironment {
  return parseEnvironment("API", apiEnvironmentSchema, input);
}
