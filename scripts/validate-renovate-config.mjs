import { readFileSync } from "node:fs";

import JSON5 from "json5";

const configuration = JSON5.parse(
  readFileSync(new URL("../renovate.json5", import.meta.url), "utf8"),
);
const failures = [];

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

requireCondition(
  configuration !== null &&
    typeof configuration === "object" &&
    !Array.isArray(configuration),
  "The Renovate configuration must be an object.",
);
requireCondition(
  configuration.$schema === "https://docs.renovatebot.com/renovate-schema.json",
  "The Renovate schema reference must use the official HTTPS endpoint.",
);
requireCondition(
  isStringArray(configuration.extends) && configuration.extends.length > 0,
  "The Renovate configuration must extend at least one preset.",
);
requireCondition(
  isNonEmptyString(configuration.timezone),
  "The Renovate timezone is required.",
);
requireCondition(
  isStringArray(configuration.schedule) && configuration.schedule.length > 0,
  "The Renovate schedule must contain at least one window.",
);
requireCondition(
  configuration.internalChecksFilter === "strict",
  "Renovate internal checks must remain strict.",
);
requireCondition(
  configuration.rangeStrategy === "pin",
  "Dependencies must remain pinned for reproducible builds.",
);
requireCondition(
  Number.isInteger(configuration.prConcurrentLimit) &&
    configuration.prConcurrentLimit > 0,
  "The pull request concurrency limit must be a positive integer.",
);
requireCondition(
  Number.isInteger(configuration.branchConcurrentLimit) &&
    configuration.branchConcurrentLimit > 0,
  "The branch concurrency limit must be a positive integer.",
);
requireCondition(
  configuration.vulnerabilityAlerts?.enabled === true &&
    configuration.vulnerabilityAlerts?.prCreation === "immediate" &&
    configuration.vulnerabilityAlerts?.minimumReleaseAge === null,
  "Vulnerability updates must remain enabled, immediate, and exempt from release age.",
);
requireCondition(
  Array.isArray(configuration.packageRules) &&
    configuration.packageRules.length > 0,
  "At least one package review rule is required.",
);

for (const [index, rule] of (configuration.packageRules ?? []).entries()) {
  requireCondition(
    rule !== null && typeof rule === "object" && !Array.isArray(rule),
    `Package rule ${String(index + 1)} must be an object.`,
  );
  requireCondition(
    isNonEmptyString(rule?.description),
    `Package rule ${String(index + 1)} requires a description.`,
  );

  const matchers = [
    rule?.matchManagers,
    rule?.matchPackageNames,
    rule?.matchUpdateTypes,
  ].filter((value) => value !== undefined);
  requireCondition(
    matchers.length > 0 && matchers.every(isStringArray),
    `Package rule ${String(index + 1)} requires valid string-array matchers.`,
  );
  requireCondition(
    rule?.automerge !== true,
    `Package rule ${String(index + 1)} must not enable automatic merging.`,
  );
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `${JSON.stringify({ packageRules: configuration.packageRules.length, status: "valid" })}\n`,
);
