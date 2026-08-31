import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const sourceAliases = {
  "@threadsofgold/api-client/models": fileURLToPath(
    new URL(
      "./packages/api-client/src/generated/models/index.ts",
      import.meta.url,
    ),
  ),
  "@threadsofgold/api-client": fileURLToPath(
    new URL("./packages/api-client/src/index.ts", import.meta.url),
  ),
  "@threadsofgold/config/api": fileURLToPath(
    new URL("./packages/config/src/api.ts", import.meta.url),
  ),
  "@threadsofgold/config/storefront": fileURLToPath(
    new URL("./packages/config/src/storefront.ts", import.meta.url),
  ),
  "@threadsofgold/config/worker": fileURLToPath(
    new URL("./packages/config/src/worker.ts", import.meta.url),
  ),
  "@threadsofgold/contracts/foundation-request": fileURLToPath(
    new URL("./packages/contracts/src/foundation-request.ts", import.meta.url),
  ),
  "@threadsofgold/contracts/service": fileURLToPath(
    new URL("./packages/contracts/src/service.ts", import.meta.url),
  ),
  "@threadsofgold/database": fileURLToPath(
    new URL("./packages/database/src/index.ts", import.meta.url),
  ),
  "@threadsofgold/test-utils/containers/postgresql": fileURLToPath(
    new URL(
      "./packages/test-utils/src/containers/postgresql.ts",
      import.meta.url,
    ),
  ),
  "@threadsofgold/test-utils/containers/redis": fileURLToPath(
    new URL("./packages/test-utils/src/containers/redis.ts", import.meta.url),
  ),
  "@threadsofgold/test-utils": fileURLToPath(
    new URL("./packages/test-utils/src/index.ts", import.meta.url),
  ),
};

export default defineConfig({
  resolve: {
    alias: sourceAliases,
  },
  test: {
    allowOnly: false,
    clearMocks: true,
    coverage: {
      // This initial gate covers only the pure test foundation. It is not
      // application or commerce-feature coverage and must expand with those slices.
      exclude: ["packages/test-utils/src/containers/**"],
      include: ["packages/test-utils/src/foundation.ts"],
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    passWithNoTests: false,
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
          name: "unit",
          testTimeout: 10_000,
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          fileParallelism: false,
          hookTimeout: 120_000,
          include: ["tests/integration/**/*.integration.test.ts"],
          maxWorkers: 1,
          name: "integration",
          testTimeout: 120_000,
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["tests/contract/**/*.contract.test.ts"],
          name: "contract",
          testTimeout: 15_000,
        },
      },
    ],
    restoreMocks: true,
  },
});
