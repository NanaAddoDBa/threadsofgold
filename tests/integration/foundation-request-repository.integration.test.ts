import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  createDatabaseClient,
  FoundationRequestRepository,
} from "@threadsofgold/database";
import { readExplicitTestGate } from "@threadsofgold/test-utils";
import { startPostgreSqlTestContainer } from "@threadsofgold/test-utils/containers/postgresql";
import { Client } from "pg";
import { describe, expect, it } from "vitest";

const gateName = "TOG_RUN_TESTCONTAINERS";
const testcontainersEnabled = readExplicitTestGate(
  gateName,
  process.env[gateName],
);
const migrationPath = fileURLToPath(
  new URL(
    "../../packages/database/prisma/migrations/20260831030000_create_foundation_requests/migration.sql",
    import.meta.url,
  ),
);

describe.skipIf(!testcontainersEnabled)(
  `foundation request repository (${gateName}=1 required)`,
  () => {
    it("applies the migration and preserves idempotent request state", async () => {
      const container = await startPostgreSqlTestContainer();
      const connectionString = container.getConnectionUri();
      const migrationClient = new Client({ connectionString });
      const database = createDatabaseClient(connectionString);
      const repository = new FoundationRequestRepository(database);

      try {
        await migrationClient.connect();
        await migrationClient.query(await readFile(migrationPath, "utf8"));
        await migrationClient.end();
        await repository.connect();

        const idempotencyKey = randomUUID();
        const first = await repository.createOrGet({
          correlationId: randomUUID(),
          id: randomUUID(),
          idempotencyKey,
        });
        const repeated = await repository.createOrGet({
          correlationId: randomUUID(),
          id: randomUUID(),
          idempotencyKey,
        });

        expect(first.created).toBe(true);
        expect(repeated.created).toBe(false);
        expect(repeated.record.id).toBe(first.record.id);

        const processing = await repository.markProcessing(first.record.id);
        expect(processing).toMatchObject({ attempts: 1, status: "processing" });

        const completed = await repository.markCompleted(first.record.id);
        expect(completed.status).toBe("completed");
        expect(completed.completedAt).toBeInstanceOf(Date);

        const duplicateProcessing = await repository.markProcessing(
          first.record.id,
        );
        const lateFailure = await repository.markFailed(
          first.record.id,
          "SyntheticLateFailure",
        );

        expect(duplicateProcessing).toMatchObject({
          attempts: 1,
          status: "completed",
        });
        expect(lateFailure).toMatchObject({
          lastErrorType: null,
          status: "completed",
        });

        await repository.ping();
      } finally {
        if (!migrationClient.ended) {
          await migrationClient.end().catch(() => undefined);
        }
        await repository.disconnect().catch(() => undefined);
        await container.stop();
      }
    });
  },
);
