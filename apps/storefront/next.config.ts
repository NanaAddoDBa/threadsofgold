import type { NextConfig } from "next";
import { parseStorefrontEnvironment } from "@threadsofgold/config/storefront";

parseStorefrontEnvironment({
  APP_ENV: process.env["APP_ENV"],
  APP_RELEASE: process.env["APP_RELEASE"],
  NEXT_PUBLIC_STOREFRONT_URL: process.env.NEXT_PUBLIC_STOREFRONT_URL,
});

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ["@threadsofgold/ui"],
};

export default nextConfig;
