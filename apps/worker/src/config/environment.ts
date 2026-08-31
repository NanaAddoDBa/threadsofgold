import {
  parseWorkerEnvironment,
  type WorkerEnvironment,
} from "@threadsofgold/config/worker";

export function validateWorkerEnvironment(
  environment: Record<string, unknown>,
): WorkerEnvironment {
  return parseWorkerEnvironment({
    APP_ENV: environment["APP_ENV"],
    FOUNDATION_RUNTIME_ENABLED: environment["FOUNDATION_RUNTIME_ENABLED"],
    DATABASE_URL: environment["DATABASE_URL"],
    REDIS_URL: environment["REDIS_URL"],
    HEALTH_HOST: environment["HEALTH_HOST"],
    HEALTH_PORT: environment["HEALTH_PORT"],
    SMTP_HOST: environment["SMTP_HOST"],
    SMTP_PORT: environment["SMTP_PORT"],
    FOUNDATION_NOTIFICATION_TO: environment["FOUNDATION_NOTIFICATION_TO"],
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
