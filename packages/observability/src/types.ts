export type LogPrimitive = string | number | boolean | null;

export type LogValue = LogPrimitive | readonly LogPrimitive[];

export type LogContext = Readonly<Record<string, LogValue>>;

export type LogLevel =
  "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export interface StructuredLogger {
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext, exception?: unknown): void;
  fatal(message: string, context?: LogContext, exception?: unknown): void;
  flush(): void;
}
