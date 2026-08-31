import { z } from "zod";

export const booleanEnvironmentSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const applicationEnvironmentSchema = z.enum([
  "local",
  "test",
  "development",
  "staging",
  "production",
]);

export type ApplicationEnvironment = z.output<
  typeof applicationEnvironmentSchema
>;

export const webOriginSchema = z
  .url({ protocol: /^https?$/ })
  .superRefine((value, context) => {
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      return;
    }

    const hasNonOriginParts =
      url.username.length > 0 ||
      url.password.length > 0 ||
      url.pathname !== "/" ||
      url.search.length > 0 ||
      url.hash.length > 0;

    if (hasNonOriginParts) {
      context.addIssue({
        code: "custom",
        message:
          "Must be an origin without credentials, a path, a query, or a fragment.",
      });
    }
  })
  .transform((value) => new URL(value).origin);

export const optionalPostgreSqlUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z.url({ protocol: /^postgres(?:ql)?$/ }).optional(),
);

export const optionalRedisUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z.url({ protocol: /^rediss?$/ }).optional(),
);

export const optionalWebOriginSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  webOriginSchema.optional(),
);

export const hostSchema = z
  .string()
  .trim()
  .min(1)
  .max(253)
  .default("127.0.0.1");

export const portSchema = z
  .union([z.number(), z.string().trim().regex(/^\d+$/)])
  .pipe(z.coerce.number<string | number>().int().min(1).max(65_535))
  .default(4000);

export const releaseIdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(
    /^[A-Za-z0-9][A-Za-z0-9._/@:+-]*$/,
    "Must be an immutable release identifier without whitespace.",
  )
  .default("local");

export function isDeployedEnvironment(
  environment: ApplicationEnvironment,
): boolean {
  return (
    environment === "development" ||
    environment === "staging" ||
    environment === "production"
  );
}

export function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.trim().toLowerCase();

  return (
    normalizedHost === "localhost" ||
    normalizedHost === "::1" ||
    normalizedHost === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/.test(normalizedHost)
  );
}

export function isLocalOrUnspecifiedOrigin(origin: string): boolean {
  const hostname = new URL(origin).hostname.toLowerCase();

  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "0.0.0.0" ||
    hostname === "[::]" ||
    hostname === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/.test(hostname)
  );
}
