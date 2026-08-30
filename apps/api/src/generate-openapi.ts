import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { initializeObservability } from "@threadsofgold/observability";

process.env["APP_ENV"] ??= "test";
process.env["APP_RELEASE"] ??= "contract-generation";
process.env["LOG_LEVEL"] ??= "silent";
process.env["OTEL_ENABLED"] ??= "false";
process.env["SENTRY_ENABLED"] ??= "false";

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortObject(entry)]),
  );
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(
  scriptDirectory,
  "../../../packages/contracts/openapi/v1.json",
);
const observability = initializeObservability({
  environment: "test",
  instrumentHttp: false,
  logLevel: "silent",
  otelEnabled: false,
  release: "contract-generation",
  sentryEnabled: false,
  serviceName: "threads-of-gold-openapi-generator",
  traceSampleRatio: 0,
});

try {
  const [{ createApiApplication }, { createApiOpenApiDocument }] =
    await Promise.all([import("./create-app.js"), import("./openapi.js")]);
  const application = await createApiApplication(observability);

  try {
    await application.init();
    const document = createApiOpenApiDocument(application);
    const serializedDocument = `${JSON.stringify(sortObject(document), null, 2)}\n`;

    await mkdir(dirname(contractPath), { recursive: true });
    await writeFile(contractPath, serializedDocument, "utf8");
  } finally {
    await application.close();
  }
} finally {
  await observability.shutdown();
}
