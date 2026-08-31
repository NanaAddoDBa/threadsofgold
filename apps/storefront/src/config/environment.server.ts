import "server-only";

import { parseStorefrontServerEnvironment } from "@threadsofgold/config/storefront";

export const storefrontServerEnvironment = Object.freeze(
  parseStorefrontServerEnvironment({
    APP_ENV: process.env["APP_ENV"],
    APP_RELEASE: process.env["APP_RELEASE"],
  }),
);
