import "server-only";

import { parseAdminServerEnvironment } from "@threadsofgold/config/admin";

export const adminServerEnvironment = Object.freeze(
  parseAdminServerEnvironment({
    APP_ENV: process.env["APP_ENV"],
  }),
);
