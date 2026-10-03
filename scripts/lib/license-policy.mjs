const DAY_IN_MILLISECONDS = 86_400_000;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isTextList(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isText);
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function globMatches(pattern, value) {
  const expression = pattern
    .replace(/[.+?^${}()|[\]\\]/gu, "\\$&")
    .replaceAll("*", ".*");
  return new RegExp(`^${expression}$`, "u").test(value);
}

function packageIdentifiers(packages) {
  return [
    ...new Set(
      packages.flatMap(({ name, versions }) =>
        versions.map((version) => `${name}@${version}`),
      ),
    ),
  ].sort();
}

export function validateLicensePolicy(policy) {
  if (
    !isRecord(policy) ||
    !isTextList(policy.allowedLicenses) ||
    !isTextList(policy.deniedLicenseFragments) ||
    !Array.isArray(policy.exceptions)
  ) {
    throw new Error(
      "Invalid license policy: expected license lists and exceptions.",
    );
  }

  for (const [index, exception] of policy.exceptions.entries()) {
    if (
      !isRecord(exception) ||
      !isText(exception.license) ||
      !isTextList(exception.packagePatterns) ||
      exception.packagePatterns.some((pattern) => pattern.startsWith("*")) ||
      !isText(exception.owner) ||
      !isText(exception.reason) ||
      !isText(exception.compensatingControl) ||
      exception.approval !== "temporary-engineering-review" ||
      !isDate(exception.expires)
    ) {
      throw new Error(
        `Invalid license exception ${index + 1}: require a license, scoped package patterns, owner, reason, compensating control, temporary-engineering-review approval, and a real YYYY-MM-DD expiry.`,
      );
    }
  }
}

export function evaluateLicensePolicy(
  inventory,
  policy,
  today = new Date().toISOString().slice(0, 10),
) {
  validateLicensePolicy(policy);
  if (!isDate(today)) throw new Error("Invalid license review date.");
  if (!isRecord(inventory) || Object.keys(inventory).length === 0) {
    throw new Error(
      "Invalid license inventory: expected non-empty pnpm license groups.",
    );
  }

  const allowedLicenses = new Set(policy.allowedLicenses);
  const summary = {
    reviewedOn: today,
    licensesReviewed: Object.keys(inventory).length,
    packagesReviewed: 0,
    activeExceptions: [],
    expiredExceptions: [],
    failures: [],
  };

  for (const [license, packages] of Object.entries(inventory)) {
    if (
      !isText(license) ||
      !Array.isArray(packages) ||
      packages.length === 0 ||
      packages.some(
        (entry) =>
          !isRecord(entry) ||
          !isText(entry.name) ||
          !isTextList(entry.versions),
      )
    ) {
      throw new Error(`Invalid license inventory group: ${license}.`);
    }
    summary.packagesReviewed += packageIdentifiers(packages).length;
    if (allowedLicenses.has(license)) continue;

    const coveredPackages = new Set();
    const expiredPackages = new Set();

    for (const exception of policy.exceptions) {
      if (exception.license !== license) continue;
      const matched = packages.filter((entry) =>
        exception.packagePatterns.some((pattern) =>
          globMatches(pattern, entry.name),
        ),
      );
      if (matched.length === 0) continue;

      const expired = exception.expires < today;
      const record = {
        license,
        packages: packageIdentifiers(matched),
        owner: exception.owner,
        expires: exception.expires,
      };
      if (expired) {
        summary.expiredExceptions.push(record);
        matched.forEach((entry) => expiredPackages.add(entry));
      } else {
        summary.activeExceptions.push({
          ...record,
          daysRemaining: Math.round(
            (Date.parse(exception.expires) - Date.parse(today)) /
              DAY_IN_MILLISECONDS,
          ),
        });
        matched.forEach((entry) => coveredPackages.add(entry));
      }
    }

    const uncovered = packages.filter((entry) => !coveredPackages.has(entry));
    const classification = policy.deniedLicenseFragments.some((fragment) =>
      license.includes(fragment),
    )
      ? "denied"
      : "unreviewed";

    for (const reason of ["expired-exception", "no-approved-exception"]) {
      const failed = uncovered.filter(
        (entry) =>
          (reason === "expired-exception") === expiredPackages.has(entry),
      );
      if (failed.length > 0) {
        summary.failures.push({
          license,
          classification,
          reason,
          packages: packageIdentifiers(failed),
        });
      }
    }
  }

  return summary;
}
