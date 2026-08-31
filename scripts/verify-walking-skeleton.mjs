import { randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import { resolve } from "node:path";

try {
  loadEnvFile(resolve("apps/storefront/.env.local"));
} catch (error) {
  if (!(error && typeof error === "object" && error.code === "ENOENT")) {
    throw error;
  }
}

const storefrontOrigin = readLoopbackOrigin(
  "TOG_STOREFRONT_ORIGIN",
  process.env["TOG_STOREFRONT_ORIGIN"] ?? "http://127.0.0.1:3000",
);
const mailpitOrigin = readLoopbackOrigin(
  "TOG_MAILPIT_ORIGIN",
  process.env["TOG_MAILPIT_ORIGIN"] ?? "http://127.0.0.1:8025",
);
const idempotencyKey = randomUUID();
const correlationId = randomUUID();
const verifierToken =
  process.env["TOG_FOUNDATION_VERIFIER_TOKEN"] ??
  process.env["FOUNDATION_VERIFIER_TOKEN"];

if (verifierToken === undefined || verifierToken.trim().length < 32) {
  throw new Error(
    "A local foundation verifier token is required. Run pnpm local:setup or set TOG_FOUNDATION_VERIFIER_TOKEN.",
  );
}

function readLoopbackOrigin(name, value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid HTTP loopback origin.`);
  }

  const isLoopback =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]";
  const isOrigin =
    url.username.length === 0 &&
    url.password.length === 0 &&
    url.pathname === "/" &&
    url.search.length === 0 &&
    url.hash.length === 0;

  if (url.protocol !== "http:" || !isLoopback || !isOrigin) {
    throw new Error(`${name} must be an HTTP loopback origin without a path.`);
  }

  return url.origin;
}

async function readJson(response, context) {
  const body = await response.text();

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${context} did not return valid JSON.`);
  }
}

async function createRequest() {
  const response = await fetch(`${storefrontOrigin}/api/foundation/requests`, {
    headers: {
      "Idempotency-Key": idempotencyKey,
      "x-foundation-verifier-token": verifierToken,
      "x-request-id": correlationId,
    },
    method: "POST",
  });
  const body = await readJson(response, "The storefront foundation endpoint");

  if (response.status !== 202) {
    throw new Error(
      `The storefront foundation endpoint returned ${String(response.status)}: ${JSON.stringify(body)}`,
    );
  }

  return body;
}

async function readRequest(requestId) {
  const response = await fetch(
    `${storefrontOrigin}/api/foundation/requests/${requestId}`,
    {
      cache: "no-store",
      headers: { "x-foundation-verifier-token": verifierToken },
    },
  );
  const body = await readJson(response, "The foundation status endpoint");

  if (response.status !== 200) {
    throw new Error(
      `The foundation status endpoint returned ${String(response.status)}: ${JSON.stringify(body)}`,
    );
  }

  return body;
}

async function waitForCompletion(requestId) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const request = await readRequest(requestId);

    if (request.status === "completed") return request;

    if (request.status === "failed") {
      throw new Error(
        `The foundation worker exhausted its attempt with ${String(request.lastErrorType ?? "an unknown error")}.`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("The foundation request did not complete within 60 seconds.");
}

async function verifyCapturedNotification(requestId) {
  const response = await fetch(`${mailpitOrigin}/api/v1/messages`, {
    cache: "no-store",
  });
  const messages = await readJson(response, "Mailpit");

  if (!response.ok || !JSON.stringify(messages).includes(requestId)) {
    throw new Error(
      "Mailpit did not contain the synthetic request notification.",
    );
  }
}

const first = await createRequest();
const repeated = await createRequest();

if (first.id !== repeated.id) {
  throw new Error("Repeating the idempotency key created a second request.");
}

if (first.correlationId !== correlationId) {
  throw new Error("The request correlation ID did not reach persistence.");
}

const completed = await waitForCompletion(first.id);
await verifyCapturedNotification(first.id);

if (!Number.isInteger(completed.attempts) || completed.attempts < 1) {
  throw new Error("The worker did not record a processing attempt.");
}

process.stdout.write(
  `${JSON.stringify(
    {
      attempts: completed.attempts,
      correlationId: completed.correlationId,
      idempotentRequestId: completed.id,
      notificationCaptured: true,
      status: completed.status,
    },
    null,
    2,
  )}\n`,
);
