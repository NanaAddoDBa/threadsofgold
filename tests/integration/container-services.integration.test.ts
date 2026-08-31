import { Client } from "pg";
import { createClient } from "redis";
import {
  createDeterministicId,
  readExplicitTestGate,
} from "@threadsofgold/test-utils";
import { startPostgreSqlTestContainer } from "@threadsofgold/test-utils/containers/postgresql";
import { startRedisTestContainer } from "@threadsofgold/test-utils/containers/redis";
import { describe, expect, it } from "vitest";

const gateName = "TOG_RUN_TESTCONTAINERS";
const testcontainersEnabled = readExplicitTestGate(
  gateName,
  process.env[gateName],
);

describe.skipIf(!testcontainersEnabled)(
  `container services (${gateName}=1 required)`,
  () => {
    it("starts PostgreSQL and executes a query", async () => {
      // This proves disposable runtime connectivity only, not application schema
      // or persistence integration.
      const container = await startPostgreSqlTestContainer();
      const client = new Client({
        connectionString: container.getConnectionUri(),
      });
      let connected = false;

      try {
        await client.connect();
        connected = true;

        const result = await client.query<{ value: number }>(
          "SELECT 1::integer AS value",
        );

        expect(result.rows).toEqual([{ value: 1 }]);
      } finally {
        try {
          if (connected) {
            await client.end();
          }
        } finally {
          await container.stop();
        }
      }
    });

    it("starts Redis and round-trips a synthetic value", async () => {
      // This proves disposable runtime connectivity only, not queue, cache, or
      // application behavior.
      const container = await startRedisTestContainer();
      const client = createClient({ url: container.getConnectionUrl() });

      try {
        await client.connect();
        const key = createDeterministicId("integration", 1);

        await client.set(key, "reachable");

        expect(await client.get(key)).toBe("reachable");
      } finally {
        try {
          if (client.isOpen) {
            client.destroy();
          }
        } finally {
          await container.stop();
        }
      }
    });
  },
);
