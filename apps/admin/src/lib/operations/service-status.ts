import { adminServerEnvironment } from "@/config/environment.server";

const SERVICE_NAME = "threads-of-gold-admin";
const SERVICE_VERSION = "0.1.0";

export function createLivenessResponse(): Response {
  return Response.json({
    service: SERVICE_NAME,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

export function createReadinessResponse(): Response {
  return Response.json({
    checks: [{ name: "process", status: "up" }],
    service: SERVICE_NAME,
    status: "ready",
    timestamp: new Date().toISOString(),
  });
}

export function createVersionResponse(): Response {
  return Response.json({
    environment: adminServerEnvironment.APP_ENV,
    release: adminServerEnvironment.APP_RELEASE,
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
  });
}
