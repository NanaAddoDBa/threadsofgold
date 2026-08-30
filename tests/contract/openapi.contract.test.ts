import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { serviceFoundationSchema } from "@threadsofgold/contracts/service";
import { describe, expect, it } from "vitest";

const contractPath = fileURLToPath(
  new URL("../../packages/contracts/openapi/v1.json", import.meta.url),
);

function requireRecord(
  value: unknown,
  location: string,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`Expected an object at ${location}.`);
  }

  return value as Record<string, unknown>;
}

function requireString(value: unknown, location: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string at ${location}.`);
  }

  return value;
}

async function readGeneratedContract(): Promise<Record<string, unknown>> {
  if (!existsSync(contractPath)) {
    throw new Error(
      `Generated OpenAPI contract is missing at ${contractPath}. Generate and commit packages/contracts/openapi/v1.json before running contract tests.`,
    );
  }

  const source = await readFile(contractPath, "utf8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    throw new Error(
      `Generated OpenAPI contract is not valid JSON: ${contractPath}`,
      {
        cause: error,
      },
    );
  }

  return requireRecord(parsed, "document");
}

describe("generated OpenAPI contract", () => {
  it("publishes the versioned service-foundation operation", async () => {
    const document = await readGeneratedContract();
    const openApiVersion = requireString(document["openapi"], "openapi");
    const info = requireRecord(document["info"], "info");
    const paths = requireRecord(document["paths"], "paths");
    const versionedPath = requireRecord(paths["/v1"], "paths./v1");
    const operation = requireRecord(versionedPath["get"], "paths./v1.get");
    const responses = requireRecord(
      operation["responses"],
      "paths./v1.get.responses",
    );
    const successResponse = requireRecord(
      responses["200"],
      "paths./v1.get.responses.200",
    );

    expect(openApiVersion).toMatch(/^3\.(?:0|1)\.\d+$/u);
    expect(requireString(info["title"], "info.title")).toContain(
      "Threads of Gold",
    );
    expect(requireString(info["version"], "info.version")).toMatch(
      /^\d+\.\d+\.\d+$/u,
    );
    expect(requireString(operation["operationId"], "operationId")).toBe(
      "getServiceFoundation",
    );
    expect(JSON.stringify(successResponse)).toContain(
      "#/components/schemas/ServiceFoundation",
    );
  });

  it("keeps the generated component compatible with the source schema", async () => {
    const document = await readGeneratedContract();
    const components = requireRecord(document["components"], "components");
    const schemas = requireRecord(components["schemas"], "components.schemas");
    const foundation = requireRecord(
      schemas["ServiceFoundation"],
      "components.schemas.ServiceFoundation",
    );
    const properties = requireRecord(
      foundation["properties"],
      "components.schemas.ServiceFoundation.properties",
    );

    const generatedExample = {
      service: requireRecord(properties["service"], "properties.service")[
        "example"
      ],
      status: requireRecord(properties["status"], "properties.status")[
        "example"
      ],
      version: requireRecord(properties["version"], "properties.version")[
        "example"
      ],
    };

    expect(foundation["required"]).toEqual(
      expect.arrayContaining(["service", "status", "version"]),
    );
    expect(serviceFoundationSchema.parse(generatedExample)).toEqual({
      service: "threads-of-gold-api",
      status: "foundation",
      version: "0.1.0",
    });
  });
});
