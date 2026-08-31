import { z } from "zod";

import {
  applicationEnvironmentSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  releaseIdentifierSchema,
  webOriginSchema,
} from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

export const storefrontServerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    APP_RELEASE: releaseIdentifierSchema,
  })
  .strict();

export const storefrontPublicEnvironmentSchema = z
  .object({
    NEXT_PUBLIC_STOREFRONT_URL: webOriginSchema,
  })
  .strict();

export const storefrontEnvironmentSchema = storefrontServerEnvironmentSchema
  .extend(storefrontPublicEnvironmentSchema.shape)
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
