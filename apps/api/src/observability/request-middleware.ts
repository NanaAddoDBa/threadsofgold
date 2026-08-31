import type { IncomingMessage, ServerResponse } from "node:http";

import {
  getOrCreateCorrelationId,
  runWithCorrelationContext,
  type StructuredLogger,
} from "@threadsofgold/observability";

type NextFunction = () => void;

export type RequestObservabilityMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction,
) => void;

function getRequestOutcome(statusCode: number): string {
  if (statusCode >= 500) {
    return "server_error";
  }

  if (statusCode >= 400) {
    return "client_error";
  }

  return "success";
}

export function createRequestObservabilityMiddleware(
  logger: StructuredLogger,
): RequestObservabilityMiddleware {
  return (request, response, next) => {
    const correlationId = getOrCreateCorrelationId(
      request.headers["x-request-id"],
    );
    const startedAt = process.hrtime.bigint();
    let completed = false;

    response.setHeader("x-request-id", correlationId);

    runWithCorrelationContext({ correlationId }, () => {
      response.once("finish", () => {
        if (completed) {
          return;
        }

        completed = true;
        const durationMilliseconds =
          Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        logger.info("HTTP request completed", {
          duration_ms: Math.round(durationMilliseconds * 100) / 100,
          event: "http_request_completed",
          http_method: request.method ?? "UNKNOWN",
          http_status_code: response.statusCode,
          outcome: getRequestOutcome(response.statusCode),
        });
      });

      response.once("close", () => {
        if (completed || response.writableEnded) {
          return;
        }

        completed = true;
        const durationMilliseconds =
          Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        logger.warn("HTTP request connection closed before completion", {
          duration_ms: Math.round(durationMilliseconds * 100) / 100,
          event: "http_request_aborted",
          http_method: request.method ?? "UNKNOWN",
          outcome: "aborted",
        });
      });

      next();
    });
  };
}
