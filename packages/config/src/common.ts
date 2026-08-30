import { z } from "zod";

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

export function isDeployedEnvironment(
  environment: ApplicationEnvironment,
): boolean {
  return (
    environment === "development" ||
    environment === "staging" ||
    environment === "production"
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
