import { createServer, type Server, type ServerResponse } from "node:http";

import type { ApplicationEnvironment } from "@threadsofgold/config";
import type { StructuredLogger } from "@threadsofgold/observability";

import type { WorkerReadinessService } from "./readiness.service.js";

const SERVICE_NAME = "threads-of-gold-worker";
const SERVICE_VERSION = "0.1.0";

interface WorkerOperationsServerOptions {
  readonly environment: ApplicationEnvironment;
  readonly host: string;
  readonly logger: StructuredLogger;
  readonly port: number;
  readonly readiness: WorkerReadinessService;
  readonly release: string;
}

function writeJson(
  response: ServerResponse,
  statusCode: number,
  body: object,
): void {
  response.writeHead(statusCode, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

export async function startWorkerOperationsServer(
  options: WorkerOperationsServerOptions,
): Promise<Server> {
  const server = createServer((request, response) => {
    if (request.method !== "GET") {
      writeJson(response, 405, { status: "method_not_allowed" });
      return;
    }

    if (request.url === "/health/live") {
      writeJson(response, 200, {
        service: SERVICE_NAME,
        status: "ok",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.url === "/version") {
      writeJson(response, 200, {
        environment: options.environment,
        release: options.release,
        service: SERVICE_NAME,
        version: SERVICE_VERSION,
      });
      return;
    }

    if (request.url === "/health/ready") {
      void options.readiness.read().then((readiness) => {
        writeJson(response, readiness.ready ? 200 : 503, {
          checks: readiness.checks,
          service: SERVICE_NAME,
          status: readiness.ready ? "ready" : "not_ready",
          timestamp: new Date().toISOString(),
        });
      });
      return;
    }

    writeJson(response, 404, { status: "not_found" });
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = (): void => {
      server.off("error", onError);
      resolve();
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(options.port, options.host);
  });

  options.logger.info("Worker operations endpoint listening", {
    event: "worker_operations_listening",
    host: options.host,
    port: options.port,
  });

  return server;
}

export async function closeWorkerOperationsServer(
  server: Server,
): Promise<void> {
  if (!server.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
