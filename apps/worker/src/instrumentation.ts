import { config as loadEnvironmentFile } from "dotenv";
import { parseWorkerEnvironment } from "@threadsofgold/config/worker";
import { initializeObservability } from "@threadsofgold/observability";

loadEnvironmentFile({ path: ".env.local", quiet: true });
loadEnvironmentFile({ path: ".env", quiet: true });

const environment = parseWorkerEnvironment({
  APP_ENV: process.env["APP_ENV"],
  LOG_LEVEL: process.env["LOG_LEVEL"],
  APP_RELEASE: process.env["APP_RELEASE"],
  OTEL_ENABLED: process.env["OTEL_ENABLED"],
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
    process.env["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"],
  OTEL_TRACES_SAMPLER_ARG: process.env["OTEL_TRACES_SAMPLER_ARG"],
  SENTRY_ENABLED: process.env["SENTRY_ENABLED"],
  SENTRY_DSN: process.env["SENTRY_DSN"],
});

export const workerObservability = initializeObservability({
  environment: environment.APP_ENV,
  instrumentHttp: false,
  logLevel: environment.LOG_LEVEL,
  otelEnabled: environment.OTEL_ENABLED,
  release: environment.APP_RELEASE,
  sentryEnabled: environment.SENTRY_ENABLED,
  serviceName: "threads-of-gold-worker",
  traceSampleRatio: environment.OTEL_TRACES_SAMPLER_ARG,
  ...(environment.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT === undefined
    ? {}
    : { otelEndpoint: environment.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT }),
  ...(environment.SENTRY_DSN === undefined
    ? {}
    : { sentryDsn: environment.SENTRY_DSN }),
});
