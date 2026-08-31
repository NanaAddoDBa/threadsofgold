# Infrastructure

This directory separates local development services, declared cloud topology,
and future Terraform roots. A repository declaration describes intended design;
it is not evidence that an AWS account, control, resource, or deployment exists.

## Directory responsibilities

| Path                                           | Responsibility                                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `local/`                                       | Disposable PostgreSQL, Redis, Mailpit, and Paystack-compatible local services |
| `environments/topology.json`                   | Secret-free logical AWS account and environment isolation contract            |
| Future Terraform bootstrap directory           | P2.03 encrypted remote state and locking, isolated from application stacks    |
| Future Terraform modules and environment roots | P2.04 and later versioned, reusable infrastructure                            |

No Terraform root is intentionally present yet. P2.03 must establish the remote
state boundary before ordinary application stacks are added.

## Proposed environment boundary

The current draft proposes an AWS Organization with six logical accounts:

```text
Organization root
├── management (governance and billing only; no application workloads)
├── Security OU
│   ├── log-archive
│   └── security-audit
├── Development OU
│   └── development
├── Workloads-PreProduction OU
│   └── staging
└── Workloads-Production OU
    └── production
```

Development, staging, and production are independent workload boundaries.
Development and staging allow only synthetic or formally sanitized data.
Production is the only workload environment permitted to process or store
application customer data. Required production security, audit, access, and
operational telemetry may flow to log-archive and security-audit under separate
minimization, encryption, access, retention, deletion, and privacy controls.
The design and its provisional Control Tower home, governed, and workload
Region of `eu-central-1` remain unapproved; see
[ADR-0001](../docs/adr/0001-aws-account-and-environment-isolation.md).

The logical policy also requires a business-controlled management root with no
access keys, a strong unique password held outside systems dependent on the AWS
account, multiple MFA devices, non-circular recovery, separated password/MFA
custody or multi-person authorization, and monitored use. Routine landing-zone
setup uses a named, MFA-protected non-root administrator or assumable role.
After security-audit exists, both `RootCredentialsManagement` and `RootSessions`
are enabled, IAM trusted access is established, security-audit becomes the IAM
delegated administrator, and member accounts retain no long-lived root
credentials. These are declared requirements, not proof of live configuration.

The selected draft logging setup is the Control Tower-managed organization
CloudTrail delivered to log-archive; this is an explicit landing-zone choice,
not an automatic claim. P2.02 must verify and harden its live
coverage, encryption, retention, access, integrity monitoring, alerting, and
cost controls. This repository declaration does not prove that the trail or its
delivery exists.

Control Tower governance of `eu-central-1` does not prohibit deployment in an
ungoverned Region. IAM, service control policies, Control Tower controls, and
reviewed exceptions must enforce the approved Region set before workloads are
operational. The offline validator only rejects mapping strings outside the
declared workload Region set.

Development, Workloads-PreProduction, and Workloads-Production must be created
and registered as governed OUs with `AWSControlTowerBaseline` enabled. New
workload accounts must use Account Factory/Control Tower APIs; eligible existing
accounts require explicit enrollment. An Organizations account or OU alone is
not evidence of Control Tower governance.

## Repository and evidence boundary

Safe repository content includes logical names, intended responsibilities,
non-secret variable names, reusable policy definitions, schemas, tests, and
provider-neutral module code.

Secrets and sensitive operational or recovery data must not be committed. This
includes root/contact email addresses, phone numbers, mailbox membership,
recovery procedures, passwords, access keys, tokens, private keys, certificates,
credentials, connection URLs, Terraform state, production exports, customer
data, support records, live Terraform variable files, or real customer-derived
fixtures. Terraform state backups, saved plans, generated outputs, crash logs,
provider credential caches, and unsanitized provider inventories are also
potentially sensitive generated artifacts and must remain outside Git. A
Terraform `sensitive` mark can redact display without removing a value from
state. Explicit placeholder-only `*.tfvars.example` files may be committed.

AWS account IDs and ARNs are identifiers rather than authentication secrets.
Threads of Gold nevertheless keeps the following non-secret live metadata out
of this repository for portability, privacy, and deployment-target safety:

- account, organization, root, OU, and live resource identifiers;
- ID-bearing deployment-role ARNs.

Store live environment-to-account and role mappings in access-controlled
deployment settings. The manifest's `liveMetadataPolicy` means repository-
restricted live values stay external; it does not reclassify account IDs as
secrets. Keep sensitive raw evidence in the approved evidence system. Sanitized,
bounded evidence or an external controlled reference may be recorded here.

## Validation

Validate the committed logical contract without cloud access:

```bash
pnpm infrastructure:check
```

The check validates `topology.json` and rejects a contract that omits the six
logical accounts, shares the three workload boundaries, allows application
workloads in core accounts, allows application customer data in development or
staging, reuses protected variable names, or embeds common live AWS identifiers
or credential material. It does not scan the whole repository or enforce those
declarations in AWS.

After the ADR is accepted and protected settings exist, deployment automation
can additionally run:

```bash
node scripts/validate-environment-topology.mjs --resolved
```

Resolved mode fails unless all six account mappings have 12-digit syntax and are
distinct, each commercial-AWS role ARN has valid syntax and contains the expected
account-ID segment, every workload Region is in the approved Region set, the ADR
is `Accepted`, all required ADR approval rows are dated and evidenced, and P0.11
is approved. It does not print protected values. It is deliberately disabled
while the topology decision is `draft`.

This check proves internal mapping consistency only. It does not contact AWS or
prove that an account exists or belongs to an intended Organization/OU, a role
exists or is assumable, a trust or permission policy is correct, the caller
receives the intended identity, a Region is enabled/governed/privacy-approved,
core accounts contain no workloads, or data cannot cross a declared boundary.
Organizations inventory, successful role assumption followed by STS caller
identity, IAM/trust review, and resource inventory remain separate live evidence.
Runtime IAM, network, data-access, backup/restore, and deployment controls are
required before the declarations can be treated as enforced boundaries.

## P2.01 completion evidence

The repository contract alone does not complete P2.01. Completion requires:

1. explicit business authorization for account ownership, consolidated billing,
   provider charges, and six globally unique root-user addresses; AWS requires
   uniqueness, while purpose-specific business management, delivery testing,
   and independence from one individual are Threads of Gold policy;
2. accepted architecture, security, privacy/Region, operations, and billing
   reviews in ADR-0001;
3. verified management-root protection, non-root bootstrap administrator,
   primary company contact, exact shared-account display names, and approved
   eligible management, Log Archive, and Audit shared-account choices;
4. landing-zone status/home-Region/version/manifest/drift evidence plus the
   active approved organization-trail destination and security policy;
5. evidence that all four OUs have `AWSControlTowerBaseline` enabled and all five
   member accounts are enrolled/governed in the intended OUs;
6. evidence that IAM trusted access, both centralized-root features, and the
   security-audit delegated administrator are active; all member accounts retain
   no long-lived root credentials; and root-use monitoring was tested;
7. controlled verification that root emails and primary company contacts are
   current and business-controlled for all six accounts;
8. successful approved role assumption and STS caller-identity evidence for
   distinct development, staging, and production deployment roles;
9. protected external mappings passing string-level resolved validation; and
10. no Threads of Gold application workload discovered in management,
    log-archive, or security-audit within a documented inventory covering all
    commercial AWS Regions and relevant global services, with expected Control
    Tower, security, logging, and governance resources classified separately.

P2.02 owns IAM Identity Center workforce identities and MFA, permission sets,
least privilege, broader logging review and hardening, budgets, alternate
Billing/Operations/Security contacts, alerts, the tested Region-deny control and
reviewed exceptions, and operational readiness.
Control Tower itself creates or manages baseline governance, logging, shared
account, and potentially identity resources; P2.02 must review and harden rather
than assume those resources do not exist. P2.03 owns remote Terraform state. No
later step should be represented here as already active.
