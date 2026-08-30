import { isSpanContextValid, trace } from "@opentelemetry/api";
import * as Sentry from "@sentry/node";

import { getCorrelationContext } from "./context.js";
import { resolveWithin } from "./lifecycle.js";
import { getErrorType } from "./redaction.js";

export interface ErrorReportingOptions {
  readonly dsn?: string;
  readonly enabled: boolean;
  readonly environment: string;
  readonly release: string;
  readonly serviceName: string;
}

export interface ErrorReportingStartResult {
  readonly started: boolean;
  readonly failureType?: string;
}

interface ErrorReportingState {
  readonly serviceName: string;
}

let activeState: ErrorReportingState | undefined;

export function initializeErrorReporting(
  options: ErrorReportingOptions,
): ErrorReportingStartResult {
  if (!options.enabled) {
    return { started: false };
  }

  try {
    Sentry.init({
      attachStacktrace: true,
      beforeSend(event) {
        delete event.breadcrumbs;
        delete event.extra;
        delete event.request;
        delete event.server_name;
        delete event.user;

        if (event.contexts !== undefined) {
          const traceContext = event.contexts["trace"];

          if (traceContext === undefined) {
            delete event.contexts;
          } else {
            event.contexts = { trace: traceContext };
          }
        }

        return event;
      },
      dsn: options.dsn,
      enabled: true,
      environment: options.environment,
      maxBreadcrumbs: 0,
      release: options.release,
      sendDefaultPii: false,
      skipOpenTelemetrySetup: true,
    });

    activeState = { serviceName: options.serviceName };

    return { started: true };
  } catch (error) {
    return { started: false, failureType: getErrorType(error) };
  }
}

export function reportException(exception: unknown): void {
  const state = activeState;

  if (state === undefined) {
    return;
  }

  try {
    const correlationContext = getCorrelationContext();
    const spanContext = trace.getActiveSpan()?.spanContext();

    Sentry.withScope((scope) => {
      scope.setTag("service", state.serviceName);

      if (correlationContext !== undefined) {
        scope.setTag("correlation_id", correlationContext.correlationId);
      }

      if (spanContext !== undefined && isSpanContextValid(spanContext)) {
        scope.setTag("otel_trace_id", spanContext.traceId);
        scope.setTag("otel_span_id", spanContext.spanId);
      }

      Sentry.captureException(exception);
    });
  } catch {
    // Error reporting is fail-open by design.
  }
}

export async function closeErrorReporting(
  timeoutMilliseconds: number,
): Promise<boolean> {
  if (activeState === undefined) {
    return true;
  }

  activeState = undefined;

  try {
    return await resolveWithin(
      Sentry.close(timeoutMilliseconds),
      timeoutMilliseconds + 250,
      false,
    );
  } catch {
    return false;
  }
}
