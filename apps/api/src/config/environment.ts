import {
  parseApiEnvironment,
  type ApiEnvironment,
} from "@threadsofgold/config/api";

export function validateApiEnvironment(
  environment: Record<string, unknown>,
): ApiEnvironment {
  return parseApiEnvironment({
    APP_ENV: environment["APP_ENV"],
    HOST: environment["HOST"],
    PORT: environment["PORT"],
  });
}
