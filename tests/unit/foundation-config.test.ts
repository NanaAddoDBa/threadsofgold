import { parseApiEnvironment } from "@threadsofgold/config/api";
import { parseStorefrontServerEnvironment } from "@threadsofgold/config/storefront";
import { parseWorkerEnvironment } from "@threadsofgold/config/worker";
import { describe, expect, it } from "vitest";

const localDatabaseUrl =
  "postgresql://threadsofgold:local-development-only@127.0.0.1:5432/threadsofgold";
const localRedisUrl = "redis://:local-development-only@127.0.0.1:6379";
const localVerifierToken = "local-foundation-verifier-token-1234567890";

describe("foundation runtime configuration", () => {
  it("keeps the API runtime disabled without dependency URLs", () => {
    expect(parseApiEnvironment({ APP_ENV: "test" })).toMatchObject({
      APP_ENV: "test",
      FOUNDATION_RUNTIME_ENABLED: false,
    });
  });

  it("accepts only a local API dependency boundary", () => {
    expect(
      parseApiEnvironment({
        APP_ENV: "local",
        DATABASE_URL: localDatabaseUrl,
        FOUNDATION_RUNTIME_ENABLED: "true",
        REDIS_URL: localRedisUrl,
      }),
    ).toMatchObject({
      FOUNDATION_RUNTIME_ENABLED: true,
    });

    expect(() =>
      parseApiEnvironment({
        APP_ENV: "local",
        DATABASE_URL:
          "postgresql://foundation:secret@database.example.com/threadsofgold",
        FOUNDATION_RUNTIME_ENABLED: "true",
        REDIS_URL: localRedisUrl,
      }),
    ).toThrow("requires a loopback database");

    expect(() =>
      parseApiEnvironment({
        APP_ENV: "local",
        DATABASE_URL: localDatabaseUrl,
        FOUNDATION_RUNTIME_ENABLED: "true",
        HOST: "0.0.0.0",
        REDIS_URL: localRedisUrl,
      }),
    ).toThrow("requires a loopback API listener");
  });

  it("rejects enabling the synthetic route in deployed environments", () => {
    expect(() =>
      parseApiEnvironment({
        APP_ENV: "production",
        DATABASE_URL: localDatabaseUrl,
        FOUNDATION_RUNTIME_ENABLED: "true",
        REDIS_URL: localRedisUrl,
      }),
    ).toThrow("cannot be enabled when deployed");
  });

  it("pins worker notifications and SMTP to local capture", () => {
    expect(() =>
      parseWorkerEnvironment({
        APP_ENV: "local",
        DATABASE_URL: localDatabaseUrl,
        FOUNDATION_NOTIFICATION_TO: "customer@example.com",
        FOUNDATION_RUNTIME_ENABLED: "true",
        REDIS_URL: localRedisUrl,
      }),
    ).toThrow("FOUNDATION_NOTIFICATION_TO");

    expect(() =>
      parseWorkerEnvironment({
        APP_ENV: "local",
        DATABASE_URL: localDatabaseUrl,
        FOUNDATION_RUNTIME_ENABLED: "true",
        REDIS_URL: localRedisUrl,
        SMTP_HOST: "smtp.example.com",
      }),
    ).toThrow("requires a loopback SMTP server");
  });

  it("allows the storefront boundary to call only a loopback API", () => {
    expect(
      parseStorefrontServerEnvironment({
        APP_ENV: "local",
        FOUNDATION_RUNTIME_ENABLED: "true",
        FOUNDATION_VERIFIER_TOKEN: localVerifierToken,
        INTERNAL_API_URL: "http://127.0.0.1:4000",
      }),
    ).toMatchObject({ FOUNDATION_RUNTIME_ENABLED: true });

    expect(() =>
      parseStorefrontServerEnvironment({
        APP_ENV: "local",
        FOUNDATION_RUNTIME_ENABLED: "true",
        FOUNDATION_VERIFIER_TOKEN: localVerifierToken,
        INTERNAL_API_URL: "https://api.example.com",
      }),
    ).toThrow("requires a loopback API origin");

    expect(() =>
      parseStorefrontServerEnvironment({
        APP_ENV: "local",
        FOUNDATION_RUNTIME_ENABLED: "true",
        INTERNAL_API_URL: "http://127.0.0.1:4000",
      }),
    ).toThrow("FOUNDATION_VERIFIER_TOKEN");
  });
});
