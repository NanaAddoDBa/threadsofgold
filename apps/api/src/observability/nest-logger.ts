import type { LoggerService } from "@nestjs/common";
import {
  sanitizeLogMessage,
  type LogContext,
  type StructuredLogger,
} from "@threadsofgold/observability";

function getNestContext(optionalParameters: readonly unknown[]): LogContext {
  const context = optionalParameters.findLast(
    (parameter): parameter is string => typeof parameter === "string",
  );

  return context === undefined
    ? {}
    : { nest_context: sanitizeLogMessage(context) };
}

function getException(
  message: unknown,
  optionalParameters: readonly unknown[],
): Error | undefined {
  if (message instanceof Error) {
    return message;
  }

  return optionalParameters.find(
    (parameter): parameter is Error => parameter instanceof Error,
  );
}

export class NestStructuredLogger implements LoggerService {
  constructor(private readonly logger: StructuredLogger) {}

  log(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.info(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
    );
  }

  error(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.error(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
      getException(message, optionalParameters),
    );
  }

  warn(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.warn(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
    );
  }

  debug(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.debug(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
    );
  }

  verbose(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.trace(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
    );
  }

  fatal(message: unknown, ...optionalParameters: unknown[]): void {
    this.logger.fatal(
      sanitizeLogMessage(message),
      getNestContext(optionalParameters),
      getException(message, optionalParameters),
    );
  }
}
