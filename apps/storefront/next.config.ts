import { resolve } from "node:path";

import type { NextConfig } from "next";
import { parseStorefrontEnvironment } from "@threadsofgold/config/storefront";

parseStorefrontEnvironment({
  APP_ENV: process.env["APP_ENV"],
  APP_RELEASE: process.env["APP_RELEASE"],
  FOUNDATION_RUNTIME_ENABLED: process.env["FOUNDATION_RUNTIME_ENABLED"],
  FOUNDATION_VERIFIER_TOKEN: process.env["FOUNDATION_VERIFIER_TOKEN"],
  INTERNAL_API_URL: process.env["INTERNAL_API_URL"],
  NEXT_PUBLIC_STOREFRONT_URL: process.env.NEXT_PUBLIC_STOREFRONT_URL,
});

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  output: "standalone",
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  poweredByHeader: false,
  transpilePackages: ["@threadsofgold/ui"],
};

export default nextConfig;
