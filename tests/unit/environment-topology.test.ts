import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  formatEnvironmentTopologyFailure,
  validateDecisionRecordCoherence,
  validateEnvironmentTopology,
  validateResolvedDeploymentTargets,
} from "../../scripts/lib/environment-topology.mjs";

const syntheticAwsAccessKeyId = ["AK", "IA", "ABCDEFGHIJKLMNOP"].join("");

const committedTopology = JSON.parse(
  readFileSync(
    new URL("../../infrastructure/environments/topology.json", import.meta.url),
    "utf8",
  ),
);

const committedDecisionRecord = readFileSync(
  new URL(
    "../../docs/adr/0001-aws-account-and-environment-isolation.md",
    import.meta.url,
  ),
  "utf8",
);

function createAcceptedDecisionRecord() {
  return `---
id: ADR-0001
status: Accepted
revision: 0.1
---

### Assumptions requiring confirmation

| ID | Assumption | Owner | Confirmation source | Due date | Status |
| --- | --- | --- | --- | --- | --- |
| A-1 | Confirmed assumption | Business owner | controlled-assumption-ref-1 | 2026-09-14 | Confirmed |
| A-2 | Confirmed assumption | Business owner | controlled-assumption-ref-2 | 2026-09-14 | Confirmed |
| A-3 | Confirmed assumption | Financial owner | controlled-assumption-ref-3 | 2026-09-14 | Confirmed |
| A-4 | Confirmed assumption | Privacy owner | controlled-assumption-ref-4 | 2026-09-14 | Confirmed |
| A-5 | Confirmed assumption | Privacy owner | controlled-assumption-ref-5 | 2026-09-14 | Confirmed |
| A-6 | Confirmed assumption | Operations owner | controlled-assumption-ref-6 | 2026-09-14 | Confirmed |
| A-7 | Confirmed assumption | Business owner | controlled-assumption-ref-7 | 2026-09-14 | Confirmed |
| A-8 | Confirmed assumption | Security owner | controlled-assumption-ref-8 | 2026-09-14 | Confirmed |

## Options considered

## Approval record

| Review area | Accountable reviewer | Decision | Date | Version/revision reviewed | Approval evidence | Conditions or expiry |
| --- | --- | --- | --- | --- | --- | --- |
| Architecture | Engineering owner | Approved | 2026-09-14 | 0.1 | controlled-ref-1 | None |
| Security | Security owner | Approved | 2026-09-14 | 0.1 | controlled-ref-2 | None |
| Privacy | Privacy owner | Approved | 2026-09-14 | 0.1 | controlled-ref-3 | None |
| Operations | Operations owner | Approved | 2026-09-14 | 0.1 | controlled-ref-4 | None |
| Business/legal/financial as applicable | Business owner | Approved | 2026-09-14 | 0.1 | controlled-ref-5 | None |

## Review and supersession

## Change log

| Date | Revision | Author | Change | Approval impact |
| --- | --- | --- | --- | --- |
| 2026-09-14 | 0.1 | Engineering | Accepted decision | Approval recorded |
`;
}

function cloneTopology() {
  return structuredClone(committedTopology);
}

function createResolvedEnvironment(topology: typeof committedTopology) {
  const resolvedEnvironment: Record<string, string> = {};
  const accountIds = new Map<string, string>();

  topology.accounts.forEach(
    (account: { accountIdVariable: string; key: string }, index: number) => {
      const accountId = String(index + 1).repeat(12);
      accountIds.set(account.key, accountId);
      resolvedEnvironment[account.accountIdVariable] = accountId;
    },
  );

  topology.environments.forEach(
    (environment: {
      account: string;
      deploymentRoleArnVariable: string;
      primaryRegionVariable: string;
    }) => {
      resolvedEnvironment[environment.primaryRegionVariable] = "eu-central-1";
      resolvedEnvironment[environment.deploymentRoleArnVariable] =
        `arn:aws:iam::${accountIds.get(environment.account)}:role/threadsofgold-deployment`;
    },
  );

  return resolvedEnvironment;
}

describe("AWS environment topology", () => {
  it("accepts the committed secret-free draft", () => {
    expect(validateEnvironmentTopology(committedTopology)).toEqual({
      accountCount: 6,
      decisionStatus: "draft",
      environmentCount: 3,
    });
    expect(
      validateDecisionRecordCoherence(
        committedTopology,
        committedDecisionRecord,
      ),
    ).toEqual({ decisionRecordStatus: "Draft" });
  });

  it("requires development, staging, and production exactly once", () => {
    const topology = cloneTopology();
    topology.environments = topology.environments.filter(
      (environment: { key: string }) => environment.key !== "staging",
    );

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /environments must contain the required members exactly once/,
    );
  });

  it("rejects unknown environments", () => {
    const topology = cloneTopology();
    topology.environments[0].key = "preview";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /unsupported environment/,
    );
  });

  it("rejects a shared workload account boundary", () => {
    const topology = cloneTopology();
    topology.environments.find(
      (environment: { key: string }) => environment.key === "production",
    ).account = "staging";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /dedicated workload account/,
    );
  });

  it("rejects protected variable reuse across mapping categories", () => {
    const topology = cloneTopology();
    topology.environments[0].primaryRegionVariable =
      topology.accounts[0].accountIdVariable;

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /all protected topology variables must contain unique values/,
    );
  });

  it("rejects application workloads in the management account", () => {
    const topology = cloneTopology();
    topology.accounts.find(
      (account: { key: string }) => account.key === "management",
    ).applicationWorkloadsAllowed = true;

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /management.*applicationWorkloadsAllowed violates the isolation contract/,
    );
  });

  it("rejects member-root administration outside the security boundary", () => {
    const topology = cloneTopology();
    topology.organization.memberRootDelegatedAdministrator = "management";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /memberRootDelegatedAdministrator must use the security boundary/,
    );
  });

  it("rejects an undefined organization logging baseline", () => {
    const topology = cloneTopology();
    topology.organization.organizationTrailStrategy = "deferred";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /organizationTrailStrategy violates the logging policy/,
    );
  });

  it("requires the Control Tower baseline on every declared OU", () => {
    const topology = cloneTopology();
    topology.organizationalUnits[1].controlTowerBaseline = "none";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /organizationalUnits\.development must require the Control Tower baseline/,
    );
  });

  it("requires Account Factory or explicit enrollment for workload accounts", () => {
    const topology = cloneTopology();
    topology.accounts.find(
      (account: { key: string }) => account.key === "staging",
    ).controlTowerEnrollment = "organizations-only";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /staging\.controlTowerEnrollment violates the governance contract/,
    );
  });

  it.each([
    ["account ID", "111111111111", /literal AWS account IDs/],
    [
      "role ARN",
      "arn:aws:iam::111111111111:role/example",
      /literal AWS account IDs|literal AWS ARNs/,
    ],
    ["access key", syntheticAwsAccessKeyId, /AWS access credentials/],
  ])("rejects a literal %s without echoing it", (_label, value, message) => {
    const topology = cloneTopology();
    topology.unapprovedValue = value;

    let errorMessage = "";
    try {
      validateEnvironmentTopology(topology);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    expect(errorMessage).toMatch(message);
    expect(errorMessage).not.toContain(value);
  });

  it("redacts source fragments from malformed JSON failures", () => {
    const credentialLikeValue = syntheticAwsAccessKeyId;
    let parseError: unknown;
    try {
      JSON.parse(`{"value": ${credentialLikeValue}}`);
    } catch (error) {
      parseError = error;
    }

    const failureMessage = formatEnvironmentTopologyFailure(parseError);
    expect(failureMessage).toBe(
      "Environment topology validation failed: topology.json contains invalid JSON.",
    );
    expect(failureMessage).not.toContain(credentialLikeValue);
  });

  it("refuses resolved deployment checks while the decision is a draft", () => {
    const resolvedEnvironment = createResolvedEnvironment(committedTopology);

    expect(() =>
      validateResolvedDeploymentTargets(
        committedTopology,
        resolvedEnvironment,
        committedDecisionRecord,
      ),
    ).toThrow(/disabled until the decision is accepted/);
  });

  it("validates distinct protected mappings after decision acceptance", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);

    expect(
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        createAcceptedDecisionRecord(),
      ),
    ).toEqual({
      accountCount: 6,
      environmentCount: 3,
      resolvedMappingValid: true,
    });
  });

  it("rejects an accepted topology while P0.11 is pending", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";

    expect(() => validateEnvironmentTopology(topology)).toThrow(
      /requires an approved P0.11 Region decision/,
    );
  });

  it("rejects resolved mode while ADR-0001 remains a draft", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);

    expect(() =>
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        committedDecisionRecord,
      ),
    ).toThrow(/requires ADR-0001 to be Accepted/);
  });

  it("rejects an Accepted ADR whose assumptions remain open", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = committedDecisionRecord.replace(
      "status: Draft",
      "status: Accepted",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(/A-1 must be confirmed or explicitly conditioned/);
  });

  it("rejects placeholder reviewers in an Accepted ADR", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = createAcceptedDecisionRecord().replace(
      "| Architecture | Engineering owner | Approved |",
      "| Architecture | Pending assignment | Approved |",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(/Architecture approval must name an accountable reviewer/);
  });

  it("rejects approvals for an outdated ADR revision", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = createAcceptedDecisionRecord().replace(
      "| Architecture | Engineering owner | Approved | 2026-09-14 | 0.1 |",
      "| Architecture | Engineering owner | Approved | 2026-09-14 | 0.0 |",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(/Architecture approval must review the current revision/);
  });

  it("rejects impossible approval calendar dates", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = createAcceptedDecisionRecord().replace(
      "| Architecture | Engineering owner | Approved | 2026-09-14 |",
      "| Architecture | Engineering owner | Approved | 2026-02-30 |",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(/Architecture approval must include a dated decision/);
  });

  it("rejects placeholder approval evidence", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = createAcceptedDecisionRecord().replace(
      "| 0.1 | controlled-ref-1 | None |",
      "| 0.1 | TBC | None |",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(/Architecture approval must reference controlled evidence/);
  });

  it("requires a controlled condition reference for conditional approval", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const decisionRecord = createAcceptedDecisionRecord().replace(
      "| Security | Security owner | Approved | 2026-09-14 | 0.1 | controlled-ref-2 | None |",
      "| Security | Security owner | Approved with conditions | 2026-09-14 | 0.1 | controlled-ref-2 | None |",
    );

    expect(() =>
      validateDecisionRecordCoherence(topology, decisionRecord),
    ).toThrow(
      /conditional approval must reference its owned and dated conditions/,
    );
  });

  it("rejects a resolved Region outside the approved contract", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);
    const staging = topology.environments.find(
      (environment: { key: string }) => environment.key === "staging",
    );
    resolvedEnvironment[staging.primaryRegionVariable] = "eu-west-1";

    expect(() =>
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        createAcceptedDecisionRecord(),
      ),
    ).toThrow(/staging.*outside the approved Region/);
  });

  it("rejects duplicate resolved AWS account mappings", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);
    const development = topology.accounts.find(
      (account: { key: string }) => account.key === "development",
    );
    const staging = topology.accounts.find(
      (account: { key: string }) => account.key === "staging",
    );
    resolvedEnvironment[staging.accountIdVariable] =
      resolvedEnvironment[development.accountIdVariable];

    expect(() =>
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        createAcceptedDecisionRecord(),
      ),
    ).toThrow(/resolved AWS account mappings must contain unique values/);
  });

  it("rejects a deployment role that targets another account", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);
    const production = topology.environments.find(
      (environment: { key: string }) => environment.key === "production",
    );
    const staging = topology.accounts.find(
      (account: { key: string }) => account.key === "staging",
    );
    resolvedEnvironment[production.deploymentRoleArnVariable] =
      `arn:aws:iam::${resolvedEnvironment[staging.accountIdVariable]}:role/threadsofgold-deployment`;

    expect(() =>
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        createAcceptedDecisionRecord(),
      ),
    ).toThrow(/production targets the wrong account/);
  });

  it("rejects a deployment role from an unapproved AWS partition", () => {
    const topology = cloneTopology();
    topology.decisionStatus = "accepted";
    topology.organization.regionDecisionStatus = "approved-p0.11";
    const resolvedEnvironment = createResolvedEnvironment(topology);
    const development = topology.environments.find(
      (environment: { key: string }) => environment.key === "development",
    );
    resolvedEnvironment[development.deploymentRoleArnVariable] =
      resolvedEnvironment[development.deploymentRoleArnVariable].replace(
        "arn:aws:",
        "arn:aws-cn:",
      );

    expect(() =>
      validateResolvedDeploymentTargets(
        topology,
        resolvedEnvironment,
        createAcceptedDecisionRecord(),
      ),
    ).toThrow(/development is missing or invalid/);
  });
});
