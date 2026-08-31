import type { LogContext, LogPrimitive, LogValue } from "./types.js";

export const REDACTED_VALUE = "[Redacted]";

const MAX_LOG_STRING_LENGTH = 2_048;
const MAX_LOG_ARRAY_LENGTH = 20;

const SENSITIVE_KEY_PATTERN =
  /authorization|cookie|password|passphrase|secret|token|api[_-]?key|dsn|signature|card|cvc|cvv|account|email|phone|address/i;
const INLINE_BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi;
const INLINE_SECRET_PATTERN =
  /((?:authorization|cookie|password|passphrase|secret|token|api[_-]?key|dsn|signature)\s*[:=]\s*)([^,;\s]+)/gi;
const QUERY_SECRET_PATTERN =
  /([?&](?:password|secret|token|api[_-]?key|signature)=)[^&#\s]+/gi;

const RESERVED_LOG_FIELDS = new Set([
  "environment",
  "level",
  "message",
  "release",
  "service",
  "span_id",
  "time",
  "trace_id",
]);

export const pinoRedactionPaths = [
  "authorization",
  "cookie",
  "password",
  "passphrase",
  "secret",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "dsn",
  "signature",
  "headers.authorization",
  "headers.cookie",
  "req.headers.authorization",
  "req.headers.cookie",
  "res.headers.set-cookie",
  "config.SENTRY_DSN",
  "config.sentryDsn",
] as const;

export function redactSensitiveText(value: string): string {
  return value
    .replace(INLINE_BEARER_PATTERN, REDACTED_VALUE)
    .replace(INLINE_SECRET_PATTERN, `$1${REDACTED_VALUE}`)
    .replace(QUERY_SECRET_PATTERN, `$1${REDACTED_VALUE}`)
    .slice(0, MAX_LOG_STRING_LENGTH);
}

function sanitizePrimitive(value: LogPrimitive): LogPrimitive {
  if (typeof value === "string") {
    return redactSensitiveText(value);
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return String(value);
  }

  return value;
}

function sanitizeValue(value: LogValue): LogValue {
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_LOG_ARRAY_LENGTH)
      .map((entry) => sanitizePrimitive(entry));
  }

  return sanitizePrimitive(value as LogPrimitive);
}

export function sanitizeLogContext(
  context: LogContext | undefined,
): Record<string, LogValue> {
  if (context === undefined) {
    return {};
  }

  const sanitized: Record<string, LogValue> = {};

  for (const [key, value] of Object.entries(context)) {
    if (RESERVED_LOG_FIELDS.has(key)) {
      continue;
    }

    sanitized[key] = SENSITIVE_KEY_PATTERN.test(key)
      ? REDACTED_VALUE
      : sanitizeValue(value);
  }

  return sanitized;
}

export function sanitizeLogMessage(value: unknown): string {
  if (typeof value === "string") {
    return redactSensitiveText(value);
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  if (value instanceof Error) {
    return redactSensitiveText(value.name || "Error");
  }

  if (value === null || value === undefined) {
    return String(value);
  }

  return "Structured value omitted";
}

export function getErrorType(exception: unknown): string {
  if (exception instanceof Error) {
    return redactSensitiveText(exception.name || "Error");
  }

  return typeof exception;
}
