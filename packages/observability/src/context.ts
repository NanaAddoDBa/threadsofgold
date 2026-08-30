import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;

export interface CorrelationContext {
  readonly correlationId: string;
}

const correlationStorage = new AsyncLocalStorage<CorrelationContext>();

export function normalizeCorrelationId(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const candidate = value.trim();

  if (UUID_PATTERN.test(candidate)) {
    return candidate.toLowerCase();
  }

  if (ULID_PATTERN.test(candidate)) {
    return candidate.toUpperCase();
  }

  return undefined;
}

export function getOrCreateCorrelationId(value: unknown): string {
  return normalizeCorrelationId(value) ?? randomUUID();
}

export function runWithCorrelationContext<T>(
  context: CorrelationContext,
  callback: () => T,
): T {
  return correlationStorage.run(context, callback);
}

export function getCorrelationContext(): CorrelationContext | undefined {
  return correlationStorage.getStore();
}
