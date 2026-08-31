import { z } from "zod";

import {
  applicationEnvironmentSchema,
  booleanEnvironmentSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  releaseIdentifierSchema,
  optionalWebOriginSchema,
  webOriginSchema,
} from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

export const storefrontServerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    APP_RELEASE: releaseIdentifierSchema,
    FOUNDATION_RUNTIME_ENABLED: booleanEnvironmentSchema.default(false),
    FOUNDATION_VERIFIER_TOKEN: z.string().trim().min(32).max(200).optional(),
    INTERNAL_API_URL: optionalWebOriginSchema,
  })
  .strict()
  .superRefine((environment, context) => {
    if (!environment.FOUNDATION_RUNTIME_ENABLED) return;

    if (isDeployedEnvironment(environment.APP_ENV)) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton cannot be enabled when deployed.",
        path: ["FOUNDATION_RUNTIME_ENABLED"],
      });
    }

    if (environment.FOUNDATION_VERIFIER_TOKEN === undefined) {
      context.addIssue({
        code: "custom",
        message: "Required when FOUNDATION_RUNTIME_ENABLED is true.",
        path: ["FOUNDATION_VERIFIER_TOKEN"],
      });
    }

    if (environment.INTERNAL_API_URL === undefined) {
      context.addIssue({
        code: "custom",
        message: "Required when FOUNDATION_RUNTIME_ENABLED is true.",
        path: ["INTERNAL_API_URL"],
      });
    }

    if (
      environment.INTERNAL_API_URL !== undefined &&
      !isLocalOrUnspecifiedOrigin(environment.INTERNAL_API_URL)
    ) {
      context.addIssue({
        code: "custom",
        message: "The local walking skeleton requires a loopback API origin.",
        path: ["INTERNAL_API_URL"],
      });
    }
  });

export const storefrontPublicEnvironmentSchema = z
  .object({
    NEXT_PUBLIC_STOREFRONT_URL: webOriginSchema,
  })
  .strict();

export const storefrontEnvironmentSchema = storefrontServerEnvironmentSchema
  .safeExtend(storefrontPublicEnvironmentSchema.shape)
  .superRefine((environment, context) => {
    if (!isDeployedEnvironment(environment.APP_ENV)) return;

    let origin: URL;

    try {
      origin = new URL(environment.NEXT_PUBLIC_STOREFRONT_URL);
    } catch {
      return;
    }

    if (
      origin.protocol !== "https:" ||
      isLocalOrUnspecifiedOrigin(origin.origin)
    ) {
      context.addIssue({
        code: "custom",
        message: "Must use a non-local HTTPS origin when deployed.",
        path: ["NEXT_PUBLIC_STOREFRONT_URL"],
      });
    }
  });

export interface StorefrontServerEnvironmentInput {
  APP_ENV?: unknown;
  APP_RELEASE?: unknown;
  FOUNDATION_RUNTIME_ENABLED?: unknown;
  FOUNDATION_VERIFIER_TOKEN?: unknown;
  INTERNAL_API_URL?: unknown;
}

export interface StorefrontPublicEnvironmentInput {
  NEXT_PUBLIC_STOREFRONT_URL?: unknown;
}

export type StorefrontServerEnvironment = z.output<
  typeof storefrontServerEnvironmentSchema
>;
export type StorefrontPublicEnvironment = z.output<
  typeof storefrontPublicEnvironmentSchema
>;
export type StorefrontEnvironment = z.output<
  typeof storefrontEnvironmentSchema
>;

export function parseStorefrontServerEnvironment(
  input: StorefrontServerEnvironmentInput,
): StorefrontServerEnvironment {
  return parseEnvironment(
    "storefront server",
    storefrontServerEnvironmentSchema,
    input,
  );
}

export function parseStorefrontPublicEnvironment(
  input: StorefrontPublicEnvironmentInput,
): StorefrontPublicEnvironment {
  return parseEnvironment(
    "storefront public",
    storefrontPublicEnvironmentSchema,
    input,
  );
}

export function parseStorefrontEnvironment(
  input: StorefrontServerEnvironmentInput & StorefrontPublicEnvironmentInput,
): StorefrontEnvironment {
  return parseEnvironment("storefront", storefrontEnvironmentSchema, input);
}
