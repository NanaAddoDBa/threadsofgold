export type LogPrimitive = string | number | boolean | null;

export type LogContext = Readonly<Record<string, LogPrimitive>>;

export interface StructuredLogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}
