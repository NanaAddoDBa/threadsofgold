import { parseStorefrontPublicEnvironment } from "@threadsofgold/config/storefront";

export const storefrontPublicEnvironment = Object.freeze(
  parseStorefrontPublicEnvironment({
    NEXT_PUBLIC_STOREFRONT_URL: process.env.NEXT_PUBLIC_STOREFRONT_URL,
  }),
);
