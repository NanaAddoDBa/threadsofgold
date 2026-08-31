import type { NextConfig } from "next";
import { parseAdminEnvironment } from "@threadsofgold/config/admin";

parseAdminEnvironment({
  APP_ENV: process.env["APP_ENV"],
  APP_RELEASE: process.env["APP_RELEASE"],
  NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
});

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
};

export default nextConfig;
