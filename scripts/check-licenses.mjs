import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  evaluateLicensePolicy,
  validateLicensePolicy,
} from "./lib/license-policy.mjs";

const policy = JSON.parse(
  readFileSync(new URL("../security/license-policy.json", import.meta.url), {
    encoding: "utf8",
  }),
);

validateLicensePolicy(policy);

const packageManagerInvocation =
  process.platform === "win32"
    ? {
        command: process.env.ComSpec ?? "cmd.exe",
        args: ["/d", "/s", "/c", "pnpm.cmd licenses list --prod --json"],
      }
    : {
        command: "pnpm",
        args: ["licenses", "list", "--prod", "--json"],
      };
const result = spawnSync(
  packageManagerInvocation.command,
  packageManagerInvocation.args,
  {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true,
  },
);

if (result.error) throw result.error;

if (result.status !== 0) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const summary = evaluateLicensePolicy(JSON.parse(result.stdout), policy);

process.stdout.write(`${JSON.stringify(summary)}\n`);

for (const exception of summary.activeExceptions) {
  if (exception.daysRemaining <= 7) {
    console.error(
      `License exception expires on ${exception.expires}: ${exception.packages.join(", ")} (${exception.owner}).`,
    );
  }
}

if (
  summary.failures.some((failure) => failure.reason === "expired-exception")
) {
  console.error(
    "Expired license exceptions require an owner-approved renewal or dependency replacement. See security/LICENSE_POLICY.md.",
  );
}

if (summary.failures.length > 0) process.exitCode = 1;
