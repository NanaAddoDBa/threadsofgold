import { defineConfig, devices } from "@playwright/test";

const baseUrl = process.env["PLAYWRIGHT_BASE_URL"] ?? "http://127.0.0.1:3000";
const skipWebServer = process.env["PLAYWRIGHT_SKIP_WEB_SERVER"] === "1";
const defaultWebServerCommand = process.env["CI"]
  ? "pnpm exec turbo run build --filter=@threadsofgold/storefront... && pnpm --filter @threadsofgold/storefront start"
  : "pnpm dev:storefront";

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: Boolean(process.env["CI"]),
  fullyParallel: true,
  outputDir: "test-results/playwright",
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { height: 900, width: 1440 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  retries: process.env["CI"] ? 2 : 0,
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "accessibility/**/*.spec.ts"],
  timeout: 45_000,
  use: {
    baseURL: baseUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command:
            process.env["PLAYWRIGHT_WEB_SERVER_COMMAND"] ??
            defaultWebServerCommand,
          env: {
            APP_ENV: "local",
            NEXT_PUBLIC_STOREFRONT_URL: baseUrl,
          },
          reuseExistingServer: !process.env["CI"],
          timeout: 240_000,
          url: baseUrl,
        },
      }),
  ...(process.env["CI"] ? { workers: 1 } : {}),
});
