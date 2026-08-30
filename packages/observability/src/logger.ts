import { isSpanContextValid, trace } from "@opentelemetry/api";
import pino, { type Logger } from "pino";

import { getCorrelationContext } from "./context.js";
import {
  getErrorType,
  pinoRedactionPaths,
  REDACTED_VALUE,
  sanitizeLogContext,
  sanitizeLogMessage,
} from "./redaction.js";
import type {
  LogContext,
  LogLevel,
  LogPrimitive,
  StructuredLogger,
} from "./types.js";

export interface LoggerOptions {
  readonly serviceName: string;
  readonly environment: string;
  readonly release: string;
  readonly level: LogLevel;
}

type WritableLogLevel = Exclude<LogLevel, "silent">;

class PinoStructuredLogger implements StructuredLogger {
  constructor(private readonly logger: Logger) {}

  trace(message: string, context?: LogContext): void {
    this.write("trace", message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext, exception?: unknown): void {
    this.write("error", message, context, exception);
  }

  fatal(message: string, context?: LogContext, exception?: unknown): void {
    this.write("fatal", message, context, exception);
  }

  flush(): void {
    try {
      this.logger.flush();
    } catch {
      // Logging must never prevent application shutdown.
    }
  }

  private write(
    level: WritableLogLevel,
    message: string,
    context?: LogContext,
    exception?: unknown,
  ): void {
    const fields: Record<string, LogPrimitive | readonly LogPrimitive[]> = {
      ...sanitizeLogContext(context),
    };
    const correlationContext = getCorrelationContext();
    const spanContext = trace.getActiveSpan()?.spanContext();

    if (correlationContext !== undefined) {
      fields["correlation_id"] = correlationContext.correlationId;
    }

    if (spanContext !== undefined && isSpanContextValid(spanContext)) {
      fields["trace_id"] = spanContext.traceId;
      fields["span_id"] = spanContext.spanId;
    }

    if (exception !== undefined) {
      fields["error_type"] = getErrorType(exception);
    }

    const safeMessage = sanitizeLogMessage(message);

    switch (level) {
      case "trace":
        this.logger.trace(fields, safeMessage);
        return;
      case "debug":
        this.logger.debug(fields, safeMessage);
        return;
      case "info":
        this.logger.info(fields, safeMessage);
        return;
      case "warn":
        this.logger.warn(fields, safeMessage);
        return;
      case "error":
        this.logger.error(fields, safeMessage);
        return;
      case "fatal":
        this.logger.fatal(fields, safeMessage);
    }
  }
}

export function createStructuredLogger(
  options: LoggerOptions,
): StructuredLogger {
  const logger = pino({
    base: {
      service: options.serviceName,
      environment: options.environment,
      release: options.release,
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    level: options.level,
    messageKey: "message",
    redact: {
      paths: [...pinoRedactionPaths],
      censor: REDACTED_VALUE,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  return new PinoStructuredLogger(logger);
}
