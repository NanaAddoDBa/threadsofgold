import {
  parseWorkerEnvironment,
  type WorkerEnvironment,
} from "@threadsofgold/config/worker";

export function validateWorkerEnvironment(
  environment: Record<string, unknown>,
): WorkerEnvironment {
  return parseWorkerEnvironment({
    APP_ENV: environment["APP_ENV"],
  });
}
