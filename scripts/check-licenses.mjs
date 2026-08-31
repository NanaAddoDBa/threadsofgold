import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const policy = JSON.parse(
  readFileSync(new URL("../security/license-policy.json", import.meta.url), {
    encoding: "utf8",
  }),
);

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
    cwd: process.cwd(),
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

const licenseInventory = JSON.parse(result.stdout);
const allowedLicenses = new Set(policy.allowedLicenses);
const failures = [];
const activeExceptions = [];
const today = new Date().toISOString().slice(0, 10);

function globMatches(pattern, value) {
  const expression = pattern
    .replace(/[.+?^${}()|[\]\\]/gu, "\\$&")
    .replaceAll("*", ".*");

  return new RegExp(`^${expression}$`, "u").test(value);
}

for (const [license, packages] of Object.entries(licenseInventory)) {
  if (allowedLicenses.has(license)) continue;

  const applicableExceptions = policy.exceptions.filter(
    (exception) =>
      exception.license === license &&
      exception.expires >= today &&
      exception.approval === "temporary-engineering-review",
  );
  const uncoveredPackages = packages.filter(
    (package_) =>
      !applicableExceptions.some((exception) =>
        exception.packagePatterns.some((pattern) =>
          globMatches(pattern, package_.name),
        ),
      ),
  );

  if (uncoveredPackages.length === 0 && applicableExceptions.length > 0) {
    activeExceptions.push({
      license,
      packages: packages.map((package_) => package_.name).sort(),
      expires: applicableExceptions
        .map((exception) => exception.expires)
        .sort()[0],
    });
    continue;
  }

  const denied = policy.deniedLicenseFragments.some((fragment) =>
    license.includes(fragment),
  );
  failures.push({
    license,
    classification: denied ? "denied" : "unreviewed",
    packages: uncoveredPackages.map((package_) => package_.name).sort(),
  });
}

const summary = {
  licensesReviewed: Object.keys(licenseInventory).length,
  activeExceptions,
  failures,
};

process.stdout.write(`${JSON.stringify(summary)}\n`);

if (failures.length > 0) process.exit(1);
