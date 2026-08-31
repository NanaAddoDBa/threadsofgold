import { z } from "zod";

import {
  applicationEnvironmentSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  releaseIdentifierSchema,
  webOriginSchema,
} from "./common.js";
import { parseEnvironment } from "./parse-environment.js";

export const adminServerEnvironmentSchema = z
  .object({
    APP_ENV: applicationEnvironmentSchema,
    APP_RELEASE: releaseIdentifierSchema,
  })
  .strict();

export const adminPublicEnvironmentSchema = z
  .object({
    NEXT_PUBLIC_ADMIN_URL: webOriginSchema,
  })
  .strict();

export const adminEnvironmentSchema = adminServerEnvironmentSchema
  .extend(adminPublicEnvironmentSchema.shape)
  .superRefine((environment, context) => {
    if (!isDeployedEnvironment(environment.APP_ENV)) return;

    let origin: URL;

    try {
      origin = new URL(environment.NEXT_PUBLIC_ADMIN_URL);
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
        path: ["NEXT_PUBLIC_ADMIN_URL"],
      });
    }
  });

export interface AdminServerEnvironmentInput {
  APP_ENV?: unknown;
  APP_RELEASE?: unknown;
}

export interface AdminPublicEnvironmentInput {
  NEXT_PUBLIC_ADMIN_URL?: unknown;
}

export type AdminServerEnvironment = z.output<
  typeof adminServerEnvironmentSchema
>;
export type AdminPublicEnvironment = z.output<
  typeof adminPublicEnvironmentSchema
>;
export type AdminEnvironment = z.output<typeof adminEnvironmentSchema>;

export function parseAdminServerEnvironment(
  input: AdminServerEnvironmentInput,
): AdminServerEnvironment {
  return parseEnvironment("admin server", adminServerEnvironmentSchema, input);
}

export function parseAdminPublicEnvironment(
  input: AdminPublicEnvironmentInput,
): AdminPublicEnvironment {
  return parseEnvironment("admin public", adminPublicEnvironmentSchema, input);
}

export function parseAdminEnvironment(
  input: AdminServerEnvironmentInput & AdminPublicEnvironmentInput,
): AdminEnvironment {
  return parseEnvironment("admin", adminEnvironmentSchema, input);
}
