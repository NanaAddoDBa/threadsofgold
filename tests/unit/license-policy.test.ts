import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  evaluateLicensePolicy,
  validateLicensePolicy,
} from "../../scripts/lib/license-policy.mjs";

const today = "2026-10-03";
const restrictedLicense = "LGPL-3.0-or-later";
const libvips = {
  name: "@img/sharp-libvips-linux-x64",
  versions: ["1.3.1"],
};

function createPolicy() {
  return {
    allowedLicenses: ["MIT", "Apache-2.0", "(MIT OR WTFPL)"],
    deniedLicenseFragments: ["AGPL-", "GPL-", "LGPL-", "SSPL-"],
    exceptions: [
      {
        license: restrictedLicense,
        packagePatterns: ["@img/sharp-libvips-*"],
        owner: "Engineering",
        approval: "temporary-engineering-review",
        reason: "Synthetic exception for policy tests.",
        compensatingControl: "Synthetic review control.",
        expires: "2026-10-10",
      },
    ],
  };
}

describe("production dependency license policy", () => {
  it("accepts exact allowed expressions and reports package versions", () => {
    const result = evaluateLicensePolicy(
      {
        MIT: [{ name: "example", versions: ["1.0.0", "2.0.0"] }],
        "(MIT OR WTFPL)": [{ name: "dual-license", versions: ["1.0.0"] }],
      },
      createPolicy(),
      today,
    );
    expect(result).toMatchObject({
      licensesReviewed: 2,
      packagesReviewed: 3,
      failures: [],
    });
  });

  it("does not allow a compound expression merely because one part is allowed", () => {
    const result = evaluateLicensePolicy(
      { "MIT AND GPL-3.0-only": [libvips] },
      createPolicy(),
      today,
    );
    expect(result.failures).toEqual([
      expect.objectContaining({
        classification: "denied",
        reason: "no-approved-exception",
      }),
    ]);
  });

  it.each(["UNKNOWN", "UNLICENSED", "EPL-2.0"])(
    "requires review for %s",
    (license) => {
      const result = evaluateLicensePolicy(
        { [license]: [libvips] },
        createPolicy(),
        today,
      );
      expect(result.failures[0].classification).toBe("unreviewed");
    },
  );

  it("accepts a matching exception through its expiry date in UTC", () => {
    const result = evaluateLicensePolicy(
      { [restrictedLicense]: [libvips] },
      createPolicy(),
      "2026-10-10",
    );
    expect(result.failures).toEqual([]);
    expect(result.activeExceptions).toEqual([
      expect.objectContaining({
        packages: ["@img/sharp-libvips-linux-x64@1.3.1"],
        daysRemaining: 0,
      }),
    ]);
  });

  it("fails the day after expiry and reports the expired package and owner", () => {
    const result = evaluateLicensePolicy(
      { [restrictedLicense]: [libvips] },
      createPolicy(),
      "2026-10-11",
    );
    expect(result.activeExceptions).toEqual([]);
    expect(result.expiredExceptions).toEqual([
      expect.objectContaining({ owner: "Engineering", expires: "2026-10-10" }),
    ]);
    expect(result.failures[0]).toMatchObject({
      classification: "denied",
      reason: "expired-exception",
      packages: ["@img/sharp-libvips-linux-x64@1.3.1"],
    });
  });

  it("reports active exceptions even when another package in the license group fails", () => {
    const result = evaluateLicensePolicy(
      {
        [restrictedLicense]: [
          libvips,
          { name: "unrelated-package", versions: ["1.0.0"] },
        ],
      },
      createPolicy(),
      today,
    );
    expect(result.activeExceptions).toHaveLength(1);
    expect(result.failures[0].packages).toEqual(["unrelated-package@1.0.0"]);
  });

  it("anchors package patterns and escapes regular expression punctuation", () => {
    const policy = createPolicy();
    policy.exceptions[0].packagePatterns = ["example.js"];
    const result = evaluateLicensePolicy(
      {
        [restrictedLicense]: [
          { name: "example.js", versions: ["1"] },
          { name: "exampleXjs", versions: ["1"] },
          { name: "prefix-example.js", versions: ["1"] },
        ],
      },
      policy,
      today,
    );
    expect(result.activeExceptions[0].packages).toEqual(["example.js@1"]);
    expect(result.failures[0].packages).toEqual([
      "exampleXjs@1",
      "prefix-example.js@1",
    ]);
  });

  it("does not borrow an exception from another license expression", () => {
    const result = evaluateLicensePolicy(
      { "Apache-2.0 AND LGPL-3.0-or-later": [libvips] },
      createPolicy(),
      today,
    );
    expect(result.activeExceptions).toEqual([]);
    expect(result.failures[0].reason).toBe("no-approved-exception");
  });

  it("does not attach an unrelated exception's earlier expiry to covered packages", () => {
    const policy = createPolicy();
    policy.exceptions.push({
      ...policy.exceptions[0],
      packagePatterns: ["unrelated"],
      expires: today,
    });
    const result = evaluateLicensePolicy(
      { [restrictedLicense]: [libvips] },
      policy,
      today,
    );
    expect(result.activeExceptions).toHaveLength(1);
    expect(result.activeExceptions[0]).toMatchObject({
      expires: "2026-10-10",
      daysRemaining: 7,
    });
  });

  it("allows a valid matching renewal to supersede an expired record", () => {
    const policy = createPolicy();
    policy.exceptions.push({ ...policy.exceptions[0], expires: "2026-09-30" });
    const result = evaluateLicensePolicy(
      { [restrictedLicense]: [libvips] },
      policy,
      today,
    );
    expect(result.failures).toEqual([]);
    expect(result.expiredExceptions).toHaveLength(1);
  });

  it.each(["2026-02-30", "2026-13-01", "2026-9-30", "never"])(
    "rejects invalid expiry %s",
    (expires) => {
      const policy = createPolicy();
      policy.exceptions[0].expires = expires;
      expect(() =>
        evaluateLicensePolicy({ MIT: [libvips] }, policy, today),
      ).toThrow("Invalid license exception");
    },
  );

  it.each(["owner", "reason", "compensatingControl", "approval"] as const)(
    "rejects missing exception %s",
    (field) => {
      const policy = createPolicy();
      policy.exceptions[0][field] = "";
      expect(() => validateLicensePolicy(policy)).toThrow(
        "Invalid license exception",
      );
    },
  );

  it("rejects an unrestricted package wildcard", () => {
    const policy = createPolicy();
    policy.exceptions[0].packagePatterns = ["*"];
    expect(() => validateLicensePolicy(policy)).toThrow(
      "Invalid license exception",
    );
  });

  it.each([null, {}, [], { MIT: [] }, { MIT: [{ name: "example" }] }])(
    "fails closed on an empty or malformed inventory: %j",
    (inventory) => {
      expect(() =>
        evaluateLicensePolicy(inventory, createPolicy(), today),
      ).toThrow("Invalid license inventory");
    },
  );

  it("validates the committed policy without requiring permanent exceptions", () => {
    const policy = JSON.parse(
      readFileSync(
        new URL("../../security/license-policy.json", import.meta.url),
        "utf8",
      ),
    );
    expect(() => validateLicensePolicy(policy)).not.toThrow();
  });

  it.each([
    { date: "2026-10-31", active: 3, failures: 0 },
    { date: "2026-11-01", active: 0, failures: 3 },
  ])(
    "enforces the committed renewal boundary on $date",
    ({ date, active, failures }) => {
      const policy = JSON.parse(
        readFileSync(
          new URL("../../security/license-policy.json", import.meta.url),
          "utf8",
        ),
      );
      const inventory = {
        "EPL-2.0": [{ name: "elkjs", versions: ["0.11.1"] }],
        "Apache-2.0 AND LGPL-3.0-or-later": [
          { name: "@img/sharp-win32-x64", versions: ["0.35.5"] },
        ],
        "LGPL-3.0-or-later": [
          { name: "@img/sharp-libvips-linux-x64", versions: ["fixture"] },
          { name: "@img/sharp-libvips-linuxmusl-x64", versions: ["fixture"] },
        ],
      };
      const result = evaluateLicensePolicy(inventory, policy, date);
      expect(result.activeExceptions).toHaveLength(active);
      expect(result.failures).toHaveLength(failures);
      expect(result.expiredExceptions).toHaveLength(failures);
      expect(
        result.failures.every(
          (failure: { reason: string }) =>
            failure.reason === "expired-exception",
        ),
      ).toBe(true);
    },
  );
});
