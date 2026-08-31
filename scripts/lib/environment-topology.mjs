const REQUIRED_ACCOUNT_SPECS = Object.freeze({
  development: {
    applicationWorkloadsAllowed: true,
    category: "workload",
    controlTowerEnrollment: "account-factory-or-explicit-enrollment",
    displayName: "Threads of Gold Development",
    organizationalUnit: "development",
  },
  "log-archive": {
    applicationWorkloadsAllowed: false,
    category: "security",
    controlTowerEnrollment: "landing-zone-shared-account",
    displayName: "Threads of Gold Log Archive",
    organizationalUnit: "security",
  },
  management: {
    applicationWorkloadsAllowed: false,
    category: "core",
    controlTowerEnrollment: "management-account",
    displayName: "Threads of Gold Organization Management",
    organizationalUnit: null,
  },
  production: {
    applicationWorkloadsAllowed: true,
    category: "workload",
    controlTowerEnrollment: "account-factory-or-explicit-enrollment",
    displayName: "Threads of Gold Production",
    organizationalUnit: "workloads-production",
  },
  "security-audit": {
    applicationWorkloadsAllowed: false,
    category: "security",
    controlTowerEnrollment: "landing-zone-shared-account",
    displayName: "Threads of Gold Security Audit",
    organizationalUnit: "security",
  },
  staging: {
    applicationWorkloadsAllowed: true,
    category: "workload",
    controlTowerEnrollment: "account-factory-or-explicit-enrollment",
    displayName: "Threads of Gold Staging",
    organizationalUnit: "workloads-preproduction",
  },
});

const REQUIRED_ENVIRONMENT_SPECS = Object.freeze({
  development: {
    applicationCustomerDataAllowed: false,
    dataClassification: "synthetic-or-sanitized",
  },
  production: {
    applicationCustomerDataAllowed: true,
    dataClassification: "restricted-customer-data",
  },
  staging: {
    applicationCustomerDataAllowed: false,
    dataClassification: "synthetic-or-sanitized",
  },
});

const REQUIRED_OU_MEMBERSHIP = Object.freeze({
  development: ["development"],
  security: ["log-archive", "security-audit"],
  "workloads-preproduction": ["staging"],
  "workloads-production": ["production"],
});

const TOP_LEVEL_KEYS = [
  "accounts",
  "decisionStatus",
  "environments",
  "organization",
  "organizationalUnits",
  "provider",
  "schemaVersion",
];

const ORGANIZATION_KEYS = [
  "centralizedRootFeatures",
  "controlTowerHomeRegion",
  "featureSet",
  "governedRegions",
  "inventoryCoverageStrategy",
  "landingZone",
  "landingZoneAdministrationStrategy",
  "liveMetadataPolicy",
  "managementAccount",
  "managementRootAccessStrategy",
  "managementRootUseMonitoringRequired",
  "memberRootAccessStrategy",
  "memberRootDelegatedAdministrator",
  "organizationTrailDestinationAccount",
  "organizationTrailSecurityPolicy",
  "organizationTrailStrategy",
  "regionRestrictionStrategy",
  "regionDecisionStatus",
  "workloadRegions",
];

const ACCOUNT_KEYS = [
  "accountIdVariable",
  "applicationWorkloadsAllowed",
  "category",
  "controlTowerEnrollment",
  "displayName",
  "key",
  "organizationalUnit",
];

const ENVIRONMENT_KEYS = [
  "account",
  "applicationCustomerDataAllowed",
  "dataClassification",
  "deploymentRoleArnVariable",
  "githubEnvironment",
  "key",
  "primaryRegionVariable",
];

const ORGANIZATIONAL_UNIT_KEYS = ["accounts", "controlTowerBaseline", "key"];
const PROTECTED_VARIABLE_PATTERN = /^TOG_AWS_[A-Z0-9_]+$/;
const AWS_ACCOUNT_ID_PATTERN = /^\d{12}$/;
const AWS_REGION_PATTERN = /^[a-z]{2}(?:-[a-z]+)+-\d$/;
const AWS_ROLE_ARN_PATTERN =
  /^arn:aws:iam::(\d{12}):role\/[A-Za-z0-9+=,.@_/-]+$/;

const SENSITIVE_KEY_NAMES = new Set([
  "accesskeyid",
  "credential",
  "credentials",
  "password",
  "phone",
  "rootemail",
  "secret",
  "secretaccesskey",
  "sessiontoken",
]);

const REQUIRED_APPROVAL_AREAS = [
  "Architecture",
  "Security",
  "Privacy",
  "Operations",
  "Business/legal/financial as applicable",
];

const REQUIRED_ASSUMPTION_IDS = [
  "A-1",
  "A-2",
  "A-3",
  "A-4",
  "A-5",
  "A-6",
  "A-7",
  "A-8",
];

const PLACEHOLDER_PATTERN =
  /^(?:-|—|none|n\/a|open|pending|pending assignment|placeholder|tbc|tbd|\[replace\])$/i;

export class EnvironmentTopologyError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnvironmentTopologyError";
  }
}

export function formatEnvironmentTopologyFailure(error) {
  if (error instanceof SyntaxError) {
    return "Environment topology validation failed: topology.json contains invalid JSON.";
  }
  if (error instanceof EnvironmentTopologyError) {
    return `Environment topology validation failed: ${error.message}`;
  }

  return null;
}

function fail(message) {
  throw new EnvironmentTopologyError(message);
}

function assertRecord(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail(`${path} must be an object.`);
  }

  return value;
}

function assertArray(value, path) {
  if (!Array.isArray(value)) {
    fail(`${path} must be an array.`);
  }

  return value;
}

function assertString(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    fail(`${path} must be a non-empty string.`);
  }

  return value;
}

function assertBoolean(value, path) {
  if (typeof value !== "boolean") {
    fail(`${path} must be a boolean.`);
  }

  return value;
}

function assertExactKeys(value, expectedKeys, path) {
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();

  if (actualKeys.join("|") !== sortedExpectedKeys.join("|")) {
    fail(`${path} contains missing or unsupported fields.`);
  }
}

function assertExactMembers(actual, expected, path) {
  const sortedActual = [...actual].sort();
  const sortedExpected = [...expected].sort();

  if (
    sortedActual.length !== sortedExpected.length ||
    sortedActual.some((value, index) => value !== sortedExpected[index])
  ) {
    fail(`${path} must contain the required members exactly once.`);
  }
}

function assertUnique(values, path) {
  if (new Set(values).size !== values.length) {
    fail(`${path} must contain unique values.`);
  }
}

function isUsableRecordValue(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !PLACEHOLDER_PATTERN.test(value.trim())
  );
}

function isIsoCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function parseMarkdownTable(section, expectedCellCount) {
  return section
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("|"))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter(
      (cells) =>
        cells.length === expectedCellCount &&
        !cells[0].startsWith("-") &&
        !new Set(["Date", "ID", "Review area"]).has(cells[0]),
    );
}

function inspectForRepositoryRestrictedMaterial(value) {
  const serialized = JSON.stringify(value);

  if (/\b\d{12}\b/.test(serialized)) {
    fail("The topology must not contain literal AWS account IDs.");
  }

  if (/\barn:(?:aws|aws-us-gov|aws-cn):/i.test(serialized)) {
    fail("The topology must not contain literal AWS ARNs.");
  }

  if (/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/.test(serialized)) {
    fail("The topology must not contain AWS access credentials.");
  }

  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(serialized)) {
    fail("The topology must not contain private key material.");
  }

  if (/:\/\/[^/\s:@]+:[^@\s/]+@/.test(serialized)) {
    fail("The topology must not contain credential-bearing connection URLs.");
  }

  const pending = [value];
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === null || typeof current !== "object") {
      continue;
    }

    if (Array.isArray(current)) {
      pending.push(...current);
      continue;
    }

    for (const [key, child] of Object.entries(current)) {
      if (SENSITIVE_KEY_NAMES.has(key.toLowerCase())) {
        fail("The topology contains a field reserved for sensitive material.");
      }
      pending.push(child);
    }
  }
}

function validateOrganization(value) {
  const organization = assertRecord(value, "organization");
  assertExactKeys(organization, ORGANIZATION_KEYS, "organization");

  if (organization.featureSet !== "ALL") {
    fail("organization.featureSet must enable all AWS Organizations features.");
  }
  if (organization.landingZone !== "aws-control-tower") {
    fail(
      "organization.landingZone must use the approved landing-zone contract.",
    );
  }
  if (organization.managementAccount !== "management") {
    fail(
      "organization.managementAccount must reference the management account.",
    );
  }
  if (organization.liveMetadataPolicy !== "external-only") {
    fail("organization.liveMetadataPolicy must keep live values external.");
  }
  if (
    organization.landingZoneAdministrationStrategy !==
    "mfa-protected-non-root-role"
  ) {
    fail(
      "organization.landingZoneAdministrationStrategy violates the bootstrap policy.",
    );
  }
  if (
    organization.managementRootAccessStrategy !==
    "external-unique-password-business-recovery-multiple-mfa-separated-custody-no-access-keys"
  ) {
    fail("organization.managementRootAccessStrategy violates the root policy.");
  }
  if (organization.managementRootUseMonitoringRequired !== true) {
    fail("organization must require management-root-use monitoring.");
  }
  const centralizedRootFeatures = assertArray(
    organization.centralizedRootFeatures,
    "organization.centralizedRootFeatures",
  ).map((feature, index) =>
    assertString(feature, `organization.centralizedRootFeatures[${index}]`),
  );
  assertExactMembers(
    centralizedRootFeatures,
    ["RootCredentialsManagement", "RootSessions"],
    "organization.centralizedRootFeatures",
  );
  if (
    organization.memberRootAccessStrategy !==
    "centralized-no-long-lived-credentials"
  ) {
    fail("organization.memberRootAccessStrategy violates the root policy.");
  }
  if (organization.memberRootDelegatedAdministrator !== "security-audit") {
    fail(
      "organization.memberRootDelegatedAdministrator must use the security boundary.",
    );
  }
  if (organization.organizationTrailStrategy !== "control-tower-managed") {
    fail("organization.organizationTrailStrategy violates the logging policy.");
  }
  if (organization.organizationTrailDestinationAccount !== "log-archive") {
    fail("organization organization trail must use the log-archive boundary.");
  }
  if (
    organization.organizationTrailSecurityPolicy !==
    "encrypted-integrity-validated-access-controlled-retention-approved"
  ) {
    fail("organization organization trail security policy is incomplete.");
  }
  if (organization.controlTowerHomeRegion !== "eu-central-1") {
    fail(
      "organization.controlTowerHomeRegion must retain the current decision value.",
    );
  }
  const governedRegions = assertArray(
    organization.governedRegions,
    "organization.governedRegions",
  ).map((region, index) =>
    assertString(region, `organization.governedRegions[${index}]`),
  );
  assertExactMembers(
    governedRegions,
    ["eu-central-1"],
    "organization.governedRegions",
  );
  const workloadRegions = assertArray(
    organization.workloadRegions,
    "organization.workloadRegions",
  ).map((region, index) =>
    assertString(region, `organization.workloadRegions[${index}]`),
  );
  assertExactMembers(
    workloadRegions,
    ["eu-central-1"],
    "organization.workloadRegions",
  );
  if (
    organization.regionRestrictionStrategy !==
    "control-tower-region-deny-with-reviewed-exceptions"
  ) {
    fail("organization.regionRestrictionStrategy violates the Region policy.");
  }
  if (
    organization.inventoryCoverageStrategy !==
    "all-commercial-regions-and-relevant-global-services"
  ) {
    fail("organization.inventoryCoverageStrategy is incomplete.");
  }
  if (
    !new Set(["approved-p0.11", "pending-p0.11"]).has(
      organization.regionDecisionStatus,
    )
  ) {
    fail("organization.regionDecisionStatus must reference the P0.11 gate.");
  }
}

function validateOrganizationalUnits(value) {
  const organizationalUnits = assertArray(value, "organizationalUnits");
  const keys = organizationalUnits.map((entry, index) => {
    const organizationalUnit = assertRecord(
      entry,
      `organizationalUnits[${index}]`,
    );
    assertExactKeys(
      organizationalUnit,
      ORGANIZATIONAL_UNIT_KEYS,
      `organizationalUnits[${index}]`,
    );

    const key = assertString(
      organizationalUnit.key,
      `organizationalUnits[${index}].key`,
    );
    const requiredAccounts = REQUIRED_OU_MEMBERSHIP[key];
    if (!requiredAccounts) {
      fail("organizationalUnits contains an unsupported logical OU.");
    }
    if (organizationalUnit.controlTowerBaseline !== "AWSControlTowerBaseline") {
      fail(
        `organizationalUnits.${key} must require the Control Tower baseline.`,
      );
    }

    const accounts = assertArray(
      organizationalUnit.accounts,
      `organizationalUnits[${index}].accounts`,
    ).map((account, accountIndex) =>
      assertString(
        account,
        `organizationalUnits[${index}].accounts[${accountIndex}]`,
      ),
    );
    assertExactMembers(
      accounts,
      requiredAccounts,
      `organizationalUnits.${key}.accounts`,
    );
    return key;
  });

  assertExactMembers(
    keys,
    Object.keys(REQUIRED_OU_MEMBERSHIP),
    "organizationalUnits",
  );
}

function validateAccounts(value) {
  const accounts = assertArray(value, "accounts");
  const accountIdVariables = [];
  const accountKeys = accounts.map((entry, index) => {
    const account = assertRecord(entry, `accounts[${index}]`);
    assertExactKeys(account, ACCOUNT_KEYS, `accounts[${index}]`);

    const key = assertString(account.key, `accounts[${index}].key`);
    const required = REQUIRED_ACCOUNT_SPECS[key];
    if (!required) {
      fail("accounts contains an unsupported logical account.");
    }

    if (account.displayName !== required.displayName) {
      fail(`accounts.${key}.displayName violates the approved account choice.`);
    }

    if (account.controlTowerEnrollment !== required.controlTowerEnrollment) {
      fail(
        `accounts.${key}.controlTowerEnrollment violates the governance contract.`,
      );
    }

    const category = assertString(
      account.category,
      `accounts[${index}].category`,
    );
    if (category !== required.category) {
      fail(`accounts.${key}.category violates the isolation contract.`);
    }

    if (account.organizationalUnit !== required.organizationalUnit) {
      fail(
        `accounts.${key}.organizationalUnit violates the isolation contract.`,
      );
    }

    const applicationWorkloadsAllowed = assertBoolean(
      account.applicationWorkloadsAllowed,
      `accounts[${index}].applicationWorkloadsAllowed`,
    );
    if (applicationWorkloadsAllowed !== required.applicationWorkloadsAllowed) {
      fail(
        `accounts.${key}.applicationWorkloadsAllowed violates the isolation contract.`,
      );
    }

    const accountIdVariable = assertString(
      account.accountIdVariable,
      `accounts[${index}].accountIdVariable`,
    );
    if (!PROTECTED_VARIABLE_PATTERN.test(accountIdVariable)) {
      fail(
        `accounts.${key}.accountIdVariable must be a protected variable name.`,
      );
    }
    accountIdVariables.push(accountIdVariable);
    return key;
  });

  assertExactMembers(
    accountKeys,
    Object.keys(REQUIRED_ACCOUNT_SPECS),
    "accounts",
  );
  assertUnique(accountIdVariables, "accounts.accountIdVariable");

  return new Map(accounts.map((account) => [account.key, account]));
}

function validateEnvironments(value, accountsByKey) {
  const environments = assertArray(value, "environments");
  const accountReferences = [];
  const githubEnvironments = [];
  const protectedVariables = [];

  const environmentKeys = environments.map((entry, index) => {
    const environment = assertRecord(entry, `environments[${index}]`);
    assertExactKeys(environment, ENVIRONMENT_KEYS, `environments[${index}]`);

    const key = assertString(environment.key, `environments[${index}].key`);
    const required = REQUIRED_ENVIRONMENT_SPECS[key];
    if (!required) {
      fail("environments contains an unsupported environment.");
    }

    const account = assertString(
      environment.account,
      `environments[${index}].account`,
    );
    if (
      account !== key ||
      accountsByKey.get(account)?.category !== "workload"
    ) {
      fail(
        `environments.${key}.account must use its dedicated workload account.`,
      );
    }
    accountReferences.push(account);

    const githubEnvironment = assertString(
      environment.githubEnvironment,
      `environments[${index}].githubEnvironment`,
    );
    if (githubEnvironment !== key) {
      fail(
        `environments.${key}.githubEnvironment must use its dedicated boundary.`,
      );
    }
    githubEnvironments.push(githubEnvironment);

    const dataClassification = assertString(
      environment.dataClassification,
      `environments[${index}].dataClassification`,
    );
    if (dataClassification !== required.dataClassification) {
      fail(
        `environments.${key}.dataClassification violates the data boundary.`,
      );
    }

    const applicationCustomerDataAllowed = assertBoolean(
      environment.applicationCustomerDataAllowed,
      `environments[${index}].applicationCustomerDataAllowed`,
    );
    if (
      applicationCustomerDataAllowed !== required.applicationCustomerDataAllowed
    ) {
      fail(
        `environments.${key}.applicationCustomerDataAllowed violates the data boundary.`,
      );
    }

    for (const field of [
      "deploymentRoleArnVariable",
      "primaryRegionVariable",
    ]) {
      const variableName = assertString(
        environment[field],
        `environments[${index}].${field}`,
      );
      if (!PROTECTED_VARIABLE_PATTERN.test(variableName)) {
        fail(`environments.${key}.${field} must be a protected variable name.`);
      }
      protectedVariables.push(variableName);
    }

    return key;
  });

  assertExactMembers(
    environmentKeys,
    Object.keys(REQUIRED_ENVIRONMENT_SPECS),
    "environments",
  );
  assertUnique(accountReferences, "environments.account");
  assertUnique(githubEnvironments, "environments.githubEnvironment");
  assertUnique(protectedVariables, "environments protected variables");

  return environments;
}

export function validateEnvironmentTopology(value) {
  inspectForRepositoryRestrictedMaterial(value);
  const topology = assertRecord(value, "topology");
  assertExactKeys(topology, TOP_LEVEL_KEYS, "topology");

  if (topology.schemaVersion !== 1) {
    fail("schemaVersion must be 1.");
  }
  if (!new Set(["accepted", "draft"]).has(topology.decisionStatus)) {
    fail("decisionStatus must be draft or accepted.");
  }
  if (topology.provider !== "aws") {
    fail("provider must be aws.");
  }

  validateOrganization(topology.organization);
  if (
    topology.decisionStatus === "accepted" &&
    topology.organization.regionDecisionStatus !== "approved-p0.11"
  ) {
    fail("An accepted topology requires an approved P0.11 Region decision.");
  }
  validateOrganizationalUnits(topology.organizationalUnits);
  const accountsByKey = validateAccounts(topology.accounts);
  const environments = validateEnvironments(
    topology.environments,
    accountsByKey,
  );
  assertUnique(
    [
      ...topology.accounts.map((account) => account.accountIdVariable),
      ...topology.environments.flatMap((environment) => [
        environment.deploymentRoleArnVariable,
        environment.primaryRegionVariable,
      ]),
    ],
    "all protected topology variables",
  );

  return {
    accountCount: accountsByKey.size,
    decisionStatus: topology.decisionStatus,
    environmentCount: environments.length,
  };
}

export function validateDecisionRecordCoherence(value, decisionRecordText) {
  const topology = assertRecord(value, "topology");
  validateEnvironmentTopology(topology);

  if (typeof decisionRecordText !== "string") {
    fail("The architecture decision record is required.");
  }

  const frontmatterMatch = decisionRecordText.match(
    /^---\r?\n([\s\S]*?)\r?\n---/,
  );
  if (!frontmatterMatch) {
    fail("The architecture decision record frontmatter is invalid.");
  }

  const frontmatter = frontmatterMatch[1];
  if (!/^id:\s*ADR-0001\s*$/m.test(frontmatter)) {
    fail("The topology must be governed by ADR-0001.");
  }

  const statusMatch = frontmatter.match(/^status:\s*(.+?)\s*$/m);
  const decisionRecordStatus = statusMatch?.[1];
  if (!decisionRecordStatus) {
    fail("ADR-0001 must declare a lifecycle status.");
  }

  const revisionMatch = frontmatter.match(/^revision:\s*(.+?)\s*$/m);
  const decisionRecordRevision = revisionMatch?.[1];
  if (
    !decisionRecordRevision ||
    !/^\d+\.\d+(?:\.\d+)?$/.test(decisionRecordRevision)
  ) {
    fail("ADR-0001 must declare a numeric revision in frontmatter.");
  }

  if (topology.decisionStatus === "draft") {
    if (!new Set(["Draft", "In review"]).has(decisionRecordStatus)) {
      fail("The draft topology conflicts with the ADR-0001 lifecycle status.");
    }

    return { decisionRecordStatus };
  }

  if (decisionRecordStatus !== "Accepted") {
    fail("Resolved targeting requires ADR-0001 to be Accepted.");
  }

  const assumptionSection = decisionRecordText
    .split("### Assumptions requiring confirmation")[1]
    ?.split("## Options considered")[0];
  if (!assumptionSection) {
    fail("ADR-0001 must contain its assumption register.");
  }

  const assumptionRows = parseMarkdownTable(assumptionSection, 6);
  assertExactMembers(
    assumptionRows.map((row) => row[0]),
    REQUIRED_ASSUMPTION_IDS,
    "ADR-0001 assumptions",
  );
  for (const assumption of assumptionRows) {
    const [id, , owner, confirmationSource, dueDate, status] = assumption;
    if (!isUsableRecordValue(owner)) {
      fail(`ADR-0001 ${id} must have an accountable assumption owner.`);
    }
    if (!isUsableRecordValue(confirmationSource)) {
      fail(`ADR-0001 ${id} must reference controlled confirmation evidence.`);
    }
    if (!isIsoCalendarDate(dueDate)) {
      fail(`ADR-0001 ${id} must have a dated confirmation or condition.`);
    }
    if (!new Set(["Conditioned", "Confirmed"]).has(status)) {
      fail(`ADR-0001 ${id} must be confirmed or explicitly conditioned.`);
    }
  }

  const changeLogSection = decisionRecordText.split("## Change log")[1];
  if (!changeLogSection) {
    fail("ADR-0001 must contain a change log.");
  }
  const changeLogRows = parseMarkdownTable(changeLogSection, 5);
  const currentRevision = changeLogRows.at(-1)?.[1];
  if (currentRevision !== decisionRecordRevision) {
    fail("ADR-0001 frontmatter and change-log revisions must match.");
  }

  const approvalSection = decisionRecordText
    .split("## Approval record")[1]
    ?.split("## Review and supersession")[0];
  if (!approvalSection) {
    fail("ADR-0001 must contain an approval record.");
  }

  const parsedApprovalRows = parseMarkdownTable(approvalSection, 7);
  assertExactMembers(
    parsedApprovalRows.map((row) => row[0]),
    REQUIRED_APPROVAL_AREAS,
    "ADR-0001 approvals",
  );
  const approvalRows = new Map(
    parsedApprovalRows.map((cells) => [cells[0], cells]),
  );

  for (const area of REQUIRED_APPROVAL_AREAS) {
    const approval = approvalRows.get(area);
    const reviewer = approval[1];
    const decision = approval[2];
    const date = approval[3];
    const revision = approval[4];
    const evidence = approval[5];
    const conditions = approval[6];
    if (!isUsableRecordValue(reviewer)) {
      fail(`ADR-0001 ${area} approval must name an accountable reviewer.`);
    }
    if (!new Set(["Approved", "Approved with conditions"]).has(decision)) {
      fail(`ADR-0001 has not approved the ${area} review area.`);
    }
    if (!isIsoCalendarDate(date)) {
      fail(`ADR-0001 ${area} approval must include a dated decision.`);
    }
    if (revision !== decisionRecordRevision) {
      fail(`ADR-0001 ${area} approval must review the current revision.`);
    }
    if (!isUsableRecordValue(evidence)) {
      fail(`ADR-0001 ${area} approval must reference controlled evidence.`);
    }
    if (
      decision === "Approved with conditions" &&
      !/^condition-ref:\s*\S+/i.test(conditions)
    ) {
      fail(
        `ADR-0001 ${area} conditional approval must reference its owned and dated conditions.`,
      );
    }
  }

  return { decisionRecordStatus };
}

export function validateResolvedDeploymentTargets(
  value,
  environmentVariables,
  decisionRecordText,
) {
  const topology = assertRecord(value, "topology");
  validateEnvironmentTopology(topology);
  validateDecisionRecordCoherence(topology, decisionRecordText);

  if (topology.decisionStatus !== "accepted") {
    fail(
      "Resolved deployment targeting is disabled until the decision is accepted.",
    );
  }

  const variables = assertRecord(environmentVariables, "environmentVariables");
  const accountIdsByKey = new Map();
  for (const account of topology.accounts) {
    const accountId = variables[account.accountIdVariable];
    if (
      typeof accountId !== "string" ||
      !AWS_ACCOUNT_ID_PATTERN.test(accountId)
    ) {
      fail(
        `The protected account mapping for ${account.key} is missing or invalid.`,
      );
    }
    accountIdsByKey.set(account.key, accountId);
  }
  assertUnique([...accountIdsByKey.values()], "resolved AWS account mappings");

  for (const environment of topology.environments) {
    const region = variables[environment.primaryRegionVariable];
    if (
      typeof region !== "string" ||
      !AWS_REGION_PATTERN.test(region) ||
      !topology.organization.workloadRegions.includes(region)
    ) {
      fail(
        `The protected region mapping for ${environment.key} is missing or outside the approved Region.`,
      );
    }

    const roleArn = variables[environment.deploymentRoleArnVariable];
    const roleMatch =
      typeof roleArn === "string" ? roleArn.match(AWS_ROLE_ARN_PATTERN) : null;
    if (!roleMatch) {
      fail(
        `The protected deployment role for ${environment.key} is missing or invalid.`,
      );
    }

    if (roleMatch[1] !== accountIdsByKey.get(environment.account)) {
      fail(
        `The deployment role for ${environment.key} targets the wrong account.`,
      );
    }
  }

  return {
    accountCount: accountIdsByKey.size,
    environmentCount: topology.environments.length,
    resolvedMappingValid: true,
  };
}
