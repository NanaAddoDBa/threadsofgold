import { defineConfig } from "orval";

export default defineConfig({
  threadsOfGold: {
    input: {
      target: "../../packages/contracts/openapi/v1.json",
    },
    output: {
      target: "./src/generated/client.ts",
      schemas: {
        importPath: "@threadsofgold/api-client/models",
        path: "./src/generated/models",
        type: "zod",
      },
      client: "fetch",
      clean: true,
      formatter: "prettier",
      fileExtension: ".ts",
      tsconfig: "./tsconfig.json",
      override: {
        header: false,
        operations: {
          createFoundationRequest: {
            fetch: { runtimeValidation: false },
          },
          getFoundationRequest: {
            fetch: { runtimeValidation: false },
          },
        },
        fetch: {
          includeHttpResponseReturnType: true,
          runtimeValidation: true,
          useRuntimeFetcher: true,
        },
        zod: {
          version: 4,
          strict: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
          generate: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
          generateEachHttpStatus: true,
          generateReusableSchemas: true,
        },
      },
    },
  },
});
