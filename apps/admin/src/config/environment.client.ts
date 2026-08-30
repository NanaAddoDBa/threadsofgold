import { parseAdminPublicEnvironment } from "@threadsofgold/config/admin";

export const adminPublicEnvironment = Object.freeze(
  parseAdminPublicEnvironment({
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
  }),
);
