import {
  parseApiEnvironment,
  type ApiEnvironment,
} from "@threadsofgold/config/api";

export function validateApiEnvironment(
  environment: Record<string, unknown>,
): ApiEnvironment {
  return parseApiEnvironment({
    APP_ENV: environment["APP_ENV"],
    FOUNDATION_RUNTIME_ENABLED: environment["FOUNDATION_RUNTIME_ENABLED"],
    DATABASE_URL: environment["DATABASE_URL"],
    REDIS_URL: environment["REDIS_URL"],
    HOST: environment["HOST"],
    PORT: environment["PORT"],
    LOG_LEVEL: environment["LOG_LEVEL"],
    APP_RELEASE: environment["APP_RELEASE"],
    OTEL_ENABLED: environment["OTEL_ENABLED"],
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
      environment["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"],
    OTEL_TRACES_SAMPLER_ARG: environment["OTEL_TRACES_SAMPLER_ARG"],
    SENTRY_ENABLED: environment["SENTRY_ENABLED"],
    SENTRY_DSN: environment["SENTRY_DSN"],
  });
}
