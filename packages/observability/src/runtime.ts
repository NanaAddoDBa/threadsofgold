import {
  closeErrorReporting,
  initializeErrorReporting,
  reportException,
} from "./error-reporting.js";
import { createStructuredLogger } from "./logger.js";
import { initializeTelemetry, shutdownTelemetry } from "./telemetry.js";
import type { LogLevel, StructuredLogger } from "./types.js";

const TELEMETRY_SHUTDOWN_TIMEOUT_MILLISECONDS = 5_000;
const ERROR_REPORTING_SHUTDOWN_TIMEOUT_MILLISECONDS = 2_000;

export interface ObservabilityOptions {
  readonly environment: string;
  readonly instrumentHttp: boolean;
  readonly logLevel: LogLevel;
  readonly otelEnabled: boolean;
  readonly otelEndpoint?: string;
  readonly release: string;
  readonly sentryDsn?: string;
  readonly sentryEnabled: boolean;
  readonly serviceName: string;
  readonly traceSampleRatio: number;
}

export interface ObservabilityRuntime {
  readonly logger: StructuredLogger;
  reportException(exception: unknown): void;
  shutdown(): Promise<void>;
}

export function initializeObservability(
  options: ObservabilityOptions,
): ObservabilityRuntime {
  const logger = createStructuredLogger({
    environment: options.environment,
    level: options.logLevel,
    release: options.release,
    serviceName: options.serviceName,
  });
  const errorReportingResult = initializeErrorReporting({
    enabled: options.sentryEnabled,
    environment: options.environment,
    release: options.release,
    serviceName: options.serviceName,
    ...(options.sentryDsn === undefined ? {} : { dsn: options.sentryDsn }),
  });
  const telemetryResult = initializeTelemetry({
    enabled: options.otelEnabled,
    environment: options.environment,
    instrumentHttp: options.instrumentHttp,
    release: options.release,
    sampleRatio: options.traceSampleRatio,
    serviceName: options.serviceName,
    ...(options.otelEndpoint === undefined
      ? {}
      : { endpoint: options.otelEndpoint }),
  });

  if (options.sentryEnabled && !errorReportingResult.started) {
    logger.warn("Error reporting could not be initialized", {
      event: "sentry_initialization_failed",
      failure_type: errorReportingResult.failureType ?? "UnknownError",
    });
  }

  if (options.otelEnabled && !telemetryResult.started) {
    logger.warn("Telemetry could not be initialized", {
      event: "otel_initialization_failed",
      failure_type: telemetryResult.failureType ?? "UnknownError",
    });
  }

  logger.info("Observability initialized", {
    event: "observability_initialized",
    otel_enabled: options.otelEnabled,
    otel_started: telemetryResult.started,
    sentry_enabled: options.sentryEnabled,
    sentry_started: errorReportingResult.started,
  });

  let shutdownPromise: Promise<void> | undefined;

  const shutdown = (): Promise<void> => {
    shutdownPromise ??= (async () => {
      const telemetryFlushed = await shutdownTelemetry(
        TELEMETRY_SHUTDOWN_TIMEOUT_MILLISECONDS,
      );
      const errorReportingFlushed = await closeErrorReporting(
        ERROR_REPORTING_SHUTDOWN_TIMEOUT_MILLISECONDS,
      );

      logger.info("Observability shutdown completed", {
        event: "observability_shutdown_completed",
        error_reporting_flushed: errorReportingFlushed,
        telemetry_flushed: telemetryFlushed,
      });
      logger.flush();
    })();

    return shutdownPromise;
  };

  return {
    logger,
    reportException,
    shutdown,
  };
}
