import "server-only";

import { parseStorefrontServerEnvironment } from "@threadsofgold/config/storefront";

export const storefrontServerEnvironment = Object.freeze(
  parseStorefrontServerEnvironment({
    APP_ENV: process.env["APP_ENV"],
    APP_RELEASE: process.env["APP_RELEASE"],
    FOUNDATION_RUNTIME_ENABLED: process.env["FOUNDATION_RUNTIME_ENABLED"],
    FOUNDATION_VERIFIER_TOKEN: process.env["FOUNDATION_VERIFIER_TOKEN"],
    INTERNAL_API_URL: process.env["INTERNAL_API_URL"],
  }),
);
