import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ["@threadsofgold/ui"],
};

export default nextConfig;
