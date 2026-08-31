---
id: ADR-0001
title: "AWS account and environment isolation"
status: Draft
revision: 0.1
owner: "Business account and billing owner"
authors:
  - "Engineering"
created: 2026-08-31
last_updated: 2026-08-31
review_due: 2026-09-14
expires_on: null
supersedes: []
superseded_by: null
systems:
  - AWS Organizations
  - AWS Control Tower
  - GitHub Actions
  - Terraform
environments:
  - development
  - staging
  - production
jurisdictions_to_assess:
  - Ghana
  - Germany
  - EU-EEA
data_classification: Internal
---

# ADR-0001: AWS account and environment isolation

> **Decision boundary:** This record is a proposal. It is not approval to open
> accounts, accept provider charges, process customer data, deploy a service, or
> select a lawful cross-border arrangement. It contains no live account
> identifiers, root contacts, credentials, customer records, or provider state.

## Record controls

| Field                    | Value                                                                         |
| ------------------------ | ----------------------------------------------------------------------------- |
| Accountable owner        | Business account and billing owner, pending assignment                        |
| Decision authority       | Split by architecture, provider/billing, privacy/Region, and operations below |
| Security reviewer        | Named security reviewer, pending assignment                                   |
| Privacy reviewer         | Named Ghana/privacy reviewer, pending assignment                              |
| Operations reviewer      | Engineering owner                                                             |
| Business reviewer        | Business account and billing owner                                            |
| Legal/financial reviewer | Pending applicability and billing-owner review                                |
| Review due               | 2026-09-14                                                                    |
| Expiry                   | No fixed expiry; review triggers apply                                        |

Engineering and security recommend and approve the architecture. Only the named
business account and billing owner may authorize AWS account activation,
consolidated billing, root/recovery custody, and provider charges. The named
privacy reviewer approves the Region and cross-border position. The named
operations owner approves operational readiness. No one authority substitutes
for another.

## Decision summary

### Proposed decision

Threads of Gold will use an AWS Organization with all features enabled and an
AWS Control Tower landing zone. The initial topology will contain six accounts:

| Logical account | Boundary                   | Permitted responsibility                                                             |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| management      | Organization root          | Organization governance, consolidated billing, and account vending                   |
| log-archive     | Security OU                | Protected organization audit-log and configuration-history archive                   |
| security-audit  | Security OU                | Cross-account audit, delegated security and member-root administration, and response |
| development     | Development OU             | Development and disposable test resources using non-customer data                    |
| staging         | Workloads-PreProduction OU | Production-like validation using synthetic or sanitized data                         |
| production      | Workloads-Production OU    | Live customer-facing workloads and approved production data                          |

The management, log-archive, and security-audit accounts will not run Threads
of Gold application workloads. Development, staging, and production will each
have a dedicated workload account, workload identities/roles, credential
sources, data stores, secrets, and GitHub Environment. Production will not
depend on development or staging services.

The management-account root will use business-controlled, non-circular recovery,
no access keys, and multiple registered MFA devices, preferably phishing-resistant
FIDO devices held under separate custody. The five member accounts will use
centralized root access delegated to `security-audit` and will not retain
long-lived root passwords, keys, certificates, or MFA credentials. Exceptional
member-root actions require an authorized, logged, task-scoped privileged
session; any temporarily restored recovery credential must be removed immediately
after the approved task. P2.02 will implement workforce IAM Identity Center,
permission sets, workforce MFA, least privilege, continuous alerts, budgets,
and security contacts.

`eu-central-1` is proposed separately as the Control Tower home Region, the sole
governed Region, and the sole primary workload Region. The Control Tower home
Region is an administrative landing-zone choice and cannot be changed after the
landing zone is established. It is not by itself a data-residency control or
proof that storage, processing, replication, logging, global-service activity,
or support access remains in Frankfurt. The Region set must not be treated as
accepted while the P0.11 Ghana/Frankfurt privacy and data-residency decision
remains open.

The exact management, log-archive, and security-audit account selections are
also foundational setup choices. Existing Log Archive and Audit accounts must
be selected during initial landing-zone setup and satisfy Control Tower
eligibility requirements. Landing-zone activation must wait for approval and
eligibility verification of the home Region and all shared-account choices.

The initial logging mode will use the Control Tower-managed organization
CloudTrail baseline delivered to the Log Archive account. P2.02 must verify and
harden its coverage, encryption, retention, access, integrity monitoring,
alerting, and cost controls; a later externally managed equivalent requires a
new reviewed decision and migration plan.

Control Tower governance of `eu-central-1` does not itself prevent a principal
from deploying in an ungoverned Region. Before workloads become operational,
explicit IAM/SCP/Control Tower controls must enforce the approved Region set
with reviewed global-service and operational exceptions.

Live account IDs and deployment-role ARNs will be supplied at deployment time
through protected settings outside Git. Deployment automation must fail closed
unless every environment maps to a distinct account and each declared role ARN
contains the same account-ID segment as its environment mapping. Separate role
assumption and STS caller-identity evidence is required to prove live targeting.

### Scope

- Included in this draft/repository slice: the AWS organization shape, account
  responsibilities, environment isolation, data-boundary intent, root-access
  policy intent, and secret-free deployment interfaces.
- Excluded from this draft/repository slice: actual provider/account changes,
  billing acceptance, workforce identities, IAM Identity Center, workforce MFA,
  Terraform state, naming/tagging standards, network design, application
  infrastructure, and deployment.
- Eventual P2.01 implementation includes authorized Control Tower landing-zone,
  shared-account, and workload-account establishment plus read-only verification.
  Control Tower establishes its selected baseline governance and the explicitly
  chosen managed organization trail, and may integrate IAM Identity Center.
  P2.02 reviews and hardens those baselines and owns workforce identity, broader
  logging controls, budgets, alerts, and alternate contacts.
- Earliest permitted provider change: after every required approval below is
  recorded, the P0.11 Region decision is closed, a business-controlled AWS
  management account is confirmed, its root baseline and primary company
  contact are verified, the shared-account selections are approved, and
  creation charges and root/recovery ownership are explicitly authorized.

### Current state and problem

The repository has a tested local walking skeleton and local development
services. It contains no Terraform roots, live AWS account mapping, or provider
evidence. No verified AWS Organization inventory has been supplied to this
record. A cloud deployment therefore needs explicit blast-radius, billing,
identity, and customer-data boundaries before infrastructure is introduced.

Repository declarations are design evidence only. They do not prove that an
organization, landing zone, account, control, role, log, or deployment exists.

## Drivers, constraints, and assumptions

### Decision drivers

- Isolate production identities, data, quotas, cost, and failure modes from
  non-production work.
- Prevent application workloads from inheriting the unusually broad management
  account boundary.
- Give audit logs and security administration independent trust boundaries.
- Make environment targeting deterministic and reject cross-account mistakes
  before Terraform or application deployment.
- Keep the first production topology small enough for one commerce workload
  while retaining a path to dedicated network, shared-services, or deployment
  accounts when justified.

AWS documents accounts as security, access, billing, and quota boundaries and
recommends separating production from non-production. AWS also recommends
keeping workloads out of the Organizations management account because service
control policies do not restrict it. See the AWS guidance on
[multi-account design principles](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/design-principles-for-your-multi-account-strategy.html),
[management-account practices](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html),
and [Control Tower shared accounts](https://docs.aws.amazon.com/controltower/latest/userguide/special-accounts.html).

### Constraints

- The business operates in Ghana, while the proposed Region is in Germany;
  qualified privacy review must determine the applicable safeguards and
  provider commitments.
- AWS requires a globally unique root-user email address for each account. AWS
  guidance recommends business-managed group addresses; Threads of Gold policy
  additionally requires each address to be purpose-specific, delivery-tested,
  business-controlled, and independent of one individual. An approved group
  address or alias may satisfy that policy. Exact addresses and recovery details
  remain outside Git.
- The management account's current primary company contact, phone, address, and
  recovery custody must be verified before member creation because AWS can copy
  its contact details to newly created member accounts.
- Control Tower, CloudTrail, Config, storage, monitoring, and workload services
  can create charges even where Control Tower has no separate fee.
- Control Tower Region governance is not a deployment allowlist; separate
  permission controls and tested exceptions must restrict unapproved Regions.
- P2.03 owns remote Terraform state; no application stack may precede its
  encrypted, locked, access-controlled bootstrap.

### Assumptions requiring confirmation

| ID  | Assumption                                                                                                                                                                       | Owner                | Confirmation source                                 | Due date   | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------- | ---------- | ------ |
| A-1 | The business owns or will authorize an AWS Organizations management account and consolidated-billing owner                                                                       | Business owner       | Controlled AWS account record                       | 2026-09-14 | Open   |
| A-2 | Six globally unique, purpose-specific, business-managed root-user email addresses are approved and delivery/access are tested                                                    | Business owner       | Controlled ownership checklist                      | 2026-09-14 | Open   |
| A-3 | The six-account operating cost and billing owner are accepted                                                                                                                    | Financial reviewer   | Dated budget and billing approval                   | 2026-09-14 | Open   |
| A-4 | Frankfurt is approved as the immutable Control Tower home Region                                                                                                                 | Privacy/operations   | Approved P0.11 and landing-zone decision            | 2026-09-14 | Open   |
| A-5 | `eu-central-1` is approved as the sole governed and primary workload Region, with service-specific storage, replication, logging, support-access, and transfer behavior reviewed | Privacy reviewer     | Approved P0.11 service/data-location review         | 2026-09-14 | Open   |
| A-6 | The named team can operate separate production and non-production paths                                                                                                          | Engineering owner    | Access and operations responsibility map            | 2026-09-14 | Open   |
| A-7 | The management primary contact and exact Control Tower shared-account display names, account selections, eligibility, root addresses, and ownership are current and approved     | Business/operations  | Controlled pre-launch checklist                     | 2026-09-14 | Open   |
| A-8 | The Control Tower-managed organization trail destination, encryption, integrity, access, and retention approach is approved                                                      | Security/privacy/ops | Controlled logging decision and retention reference | 2026-09-14 | Open   |

If any assumption fails, this ADR remains or returns to `Draft` and no cloud
activation is permitted from it.

## Options considered

| Option | Description                                      | Benefits                                      | Costs and risks                                                        | Outcome       |
| ------ | ------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------- | ------------- |
| A      | One account with namespace-level environments    | Lowest initial account overhead               | Weakest blast-radius, billing, quota, and privileged-access separation | Not preferred |
| B      | Management plus three workload accounts          | Strong workload isolation with fewer accounts | Logging and security administration share a broader trust boundary     | Not preferred |
| C      | Three core accounts plus three workload accounts | Strong workload, audit, and governance bounds | More mailboxes, ownership, cost visibility, and operational discipline | Proposed      |
| D      | Keep local-only current state                    | No provider cost or activation risk           | Cannot deliver the Phase 2 deployed walking skeleton                   | Current state |

Dedicated network, shared-services, and deployment accounts are deferred until
multiple workloads or centralized capabilities make their overhead worthwhile.

## Consequences and controls

### Expected outcomes

- The contract requires a unique protected account mapping for each workload
  environment before deployment automation can be introduced.
- The contract declares development and staging as synthetic-or-sanitized-data
  environments; later infrastructure, access, and data controls must enforce and
  verify that boundary.
- The contract declares organization management and security accounts as
  application-workload-free; later provider controls and inventory evidence
  must enforce and verify that rule.
- A later security review can apply controls at shallow OU boundaries without a
  deep hierarchy.

### Trade-offs and new risks

| Risk or trade-off                                                                                                                       | Likelihood | Impact | Control or response                                                     | Owner             | Review trigger                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------- | ----------------- | --------------------------------- |
| The six-account landing zone increases operations and may increase billable Config, CloudTrail, logging, monitoring, and workload usage | Medium     | Medium | Assign billing owner; P2.02 budgets; quarterly topology review          | Business/ops      | Material monthly-cost change      |
| Wrong protected mapping targets another account                                                                                         | Low        | High   | Unique-ID and role-account validator; protected deployment environments | Engineering       | Every deployment-path change      |
| Root/recovery ownership is lost                                                                                                         | Low        | High   | Business group mailboxes, independent recovery, documented custody      | Business/security | Staff, domain, or provider change |
| Region decision is made without privacy review                                                                                          | Medium     | High   | Keep ADR and manifest draft; block landing-zone activation              | Privacy owner     | P0.11 review                      |
| Control policy interrupts workloads                                                                                                     | Low        | High   | Test policies on narrow targets before broader OU attachment            | Security/ops      | Every organization-policy change  |

### Security and abuse considerations

- Accounts are the primary blast-radius boundaries. Cross-account access is
  denied unless a narrowly scoped trust and permission path is introduced.
- Before member-account creation, the management root baseline must be evidenced:
  business-controlled non-circular recovery, no access keys, multiple registered
  MFA devices with FIDO preferred, separated custody, and monitored root use.
  Member-account creation must enable delegated centralized root access through
  `security-audit` and preserve the no-long-lived-root-credentials model.
- P2.02 must establish IAM Identity Center workforce access, workforce MFA,
  least-privilege permission sets, broader logging review and hardening,
  Billing/Operations/Security alternate contacts, organization-wide continuous
  alerts, budgets, the selected Region-deny control with reviewed global-service
  and operational exceptions, and controlled emergency elevation before
  workloads are operational.
- Passwords, MFA device details, inboxes, phone numbers, recovery steps,
  credentials, customer data, and sensitive state must not enter Git. AWS account
  IDs and ARNs are not authentication secrets; Threads of Gold nevertheless
  keeps live IDs, organization/OU IDs, ID-bearing ARNs, resource identifiers,
  and unsanitized inventories out of this repository for portability, privacy,
  and deployment-target safety.
- Service control policies constrain maximum member-account permissions but do
  not grant access and do not protect the management account. Identity policies
  and explicit trust still own authorization.
- The threat model must cover compromised CI identity, cross-account trust,
  malicious infrastructure change, log deletion, cost abuse, root recovery,
  and production-data exfiltration before production activation.

### Privacy and data considerations

- Production may eventually contain customer account, address, order, payment
  reference, support, and operational-event data. Development and staging must
  use synthetic or formally sanitized data.
- Production is the only workload environment permitted to process or store
  application customer data. Required production security, audit, access, and
  operational telemetry may flow to log-archive and security-audit. That
  telemetry requires separate minimization, encryption, access, retention,
  deletion, and privacy review and may contain customer-linked metadata.
- The controller, processors, recipients, storage locations, support-access
  locations, retention, deletion, and cross-border safeguards remain open.
- P0.09, P0.10, and P0.11 require accountable Ghana/privacy and legal review.
  This ADR does not determine a lawful basis, transfer mechanism, or retention
  period.

### Reliability and operations considerations

- Independent accounts prevent a normal non-production change from consuming
  production quotas or directly changing production resources unless an
  explicitly authorized cross-account trust and permission path exists.
- The production release path must not rely on development or staging runtime
  services. Staging should resemble production while keeping its own secrets,
  providers, data, and failure domain.
- P2.02 through P2.20 own the later identity, monitoring, backup, release,
  restore, drift, rollback, disaster-recovery, and cost controls.
- AWS portability is reduced. Terraform modules, external mappings, documented
  data exports, and an explicit decommissioning runbook will limit exit cost.

## Jurisdiction and cross-border review prompts

These prompts require qualified determinations and are not legal conclusions:

- Which Ghana business, tax, consumer, privacy, and records requirements apply
  to the merchant and its cloud processing?
- Does operation or support from Germany or elsewhere in the EU/EEA change the
  applicable responsibilities or transfer analysis?
- Which exact AWS services and subprocessors store or access each data class,
  in which locations, and under which approved provider commitments?
- Who owns customer requests, deletion, incident notification, retention, and
  regulator or provider contact across Ghana and Germany?

## Implementation and verification plan

### Delivery plan

1. Merge the secret-free topology, validator, tests, and this draft without
   making provider changes.
2. Assign reviewers and close assumptions A-1 through A-8, including P0.11 and
   P0.17.
3. Verify the management account's root baseline, primary company contact, and
   recovery custody, including a strong unique password stored outside systems
   dependent on the AWS account and multi-person authorization or separated
   password/MFA custody. Establish a named, MFA-protected non-root administrator
   or assumable role for routine landing-zone setup. Approve the immutable home
   Region, governed/workload Region set, exact shared-account display names and
   selections, unique business-managed root addresses, managed trail approach,
   account creation, and charges outside Git.
4. Record all required dated approvals, move this ADR to `Accepted`, update the topology
   to `accepted` with `approved-p0.11`, and pass repository coherence checks.
5. Using the approved non-root administrator, launch Control Tower in the
   approved home Region, select or create the approved Log Archive and
   Audit/Security Tooling accounts, and select the Control Tower-managed
   organization trail during initial landing-zone setup after eligibility
   checks.
6. After security-audit exists, enable IAM trusted access plus
   `RootCredentialsManagement` and `RootSessions`, register security-audit as
   delegated administrator for `iam.amazonaws.com`, verify or remove shared
   member-account root credentials, and make root-use monitoring operational and
   tested.
7. Create and register the Development, Workloads-PreProduction, and
   Workloads-Production OUs and enable `AWSControlTowerBaseline` on each.
8. Provision workload accounts through Account Factory/Control Tower APIs or
   explicitly enroll eligible existing accounts into the governed OUs; verify
   all five member accounts retain no long-lived root credentials.
9. Store account and deployment-role mappings in protected settings; never in
   the repository, then run resolved validation for internal string-level
   consistency.
10. Collect the bounded provider evidence below, update the controlled evidence
    record, and mark P2.01 complete only when every implementation criterion is
    proven.

Control Tower setup itself creates or manages baseline shared-account,
governance, logging, and potentially identity resources. P2.02 reviews, extends,
hardens, and verifies those controls; it does not imply that no baseline
resources exist before P2.02.

### Rollback and exit plan

Before account creation, rollback is removal or revision of the draft contract.
After creation, an authorized operations owner must first inventory resources,
retention duties, balances, subscriptions, support cases, logs, backups, and
organization dependencies. Account removal or closure must follow a separately
approved, provider-aware runbook; it is never an automatic Terraform rollback.

### ADR acceptance criteria

- The repository validator confirms six logical accounts and exactly three
  distinct workload environments without storing live values.
- Required reviewers explicitly approve this revision and close or condition
  every assumption.
- The management root baseline, primary company contact, immutable home Region,
  governed/workload Region set, Control Tower shared-account choices, root-email
  ownership, and cost authority are approved before provider activation.

### P2.01 implementation completion criteria

- The landing zone reports the approved home Region, selected organization
  trail, active status, expected version/manifest, and no unresolved drift.
- The Security, Development, Workloads-PreProduction, and Workloads-Production
  OUs have `AWSControlTowerBaseline` enabled, and all five member accounts report
  the intended governed/enrolled state and OU membership.
- All six root email and primary company-contact records are current and
  business-controlled; exact values remain outside Git.
- The resolved validator shows that protected mapping strings are internally
  consistent, and separate successful role-assumption plus caller-identity
  evidence proves that each real deployment role returns its dedicated account.
- No Threads of Gold application workload is discovered in management,
  log-archive, or security-audit within a documented inventory covering every
  commercial AWS Region and relevant global service; expected Control Tower,
  security, logging, and governance resources are classified separately.
- Both centralized-root features are enabled, IAM trusted access and the
  security-audit delegated administrator are verified, all five member accounts
  retain no long-lived root credentials, and the management-root baseline and a
  root-use monitoring test remain evidenced.
- The active organization trail uses log-archive and the approved encryption,
  integrity, access, and retention approach.

### Evidence plan

| Claim to verify                                                       | Method                                                                                        | Environment     | Evidence owner | Due date    |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------- | -------------- | ----------- |
| Landing zone is active, correctly configured, and not drifted         | Control Tower landing-zone status, version, manifest, home-Region, and drift review           | Organization    | Operations     | Unscheduled |
| Required OU baselines are enabled                                     | Control Tower enabled-baseline inventory for all four OUs                                     | Organization    | Operations     | Unscheduled |
| All five member accounts are enrolled and in intended OUs             | Control Tower enrollment status plus Organizations membership                                 | Organization    | Operations     | Unscheduled |
| Organization trail uses the approved destination and security policy  | CloudTrail, log destination, encryption, integrity, access, and retention review              | Organization    | Security/ops   | Unscheduled |
| Both centralized-root features and delegated administrator are active | IAM Organizations feature list, trusted-access, and delegated-administrator inventory         | Organization    | Security       | Unscheduled |
| Root credential and monitoring baseline is effective                  | Consolidated member-root credential status, management-root checklist, and root-use test      | Organization    | Security       | Unscheduled |
| Root emails and primary contacts are current for all six accounts     | Controlled Account Management contact review; raw contact values remain outside Git           | Organization    | Business/ops   | Unscheduled |
| Workload account identities are distinct                              | Approved role assumption plus STS caller identity per role                                    | Dev/stage/prod  | Operations     | Unscheduled |
| Protected mapping strings are internally consistent                   | Resolved topology validator                                                                   | CI environments | Engineering    | Unscheduled |
| Core-account inventory finds no application workloads in stated scope | All-commercial-Region and relevant-global-service inventory with baseline-resource exclusions | Core accounts   | Security/ops   | Unscheduled |
| Region and cross-border position is approved                          | P0.11 approval reference                                                                      | All             | Privacy owner  | 2026-09-14  |

## Evidence reviewed

| Evidence ID | Claim supported                                                                     | Source reference, retrieved on the collected date                                                                                                                                                                                                               | Environment | Collected by | Collected on | Result and limits                                                                 | Valid until |
| ----------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ | ------------ | --------------------------------------------------------------------------------- | ----------- |
| EV-001      | AWS accounts provide resource and isolation boundaries                              | [AWS multi-account design principles](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/design-principles-for-your-multi-account-strategy.html)                                                                                    | Design      | Engineering  | 2026-08-31   | Supports proposal; does not prove a Threads of Gold organization exists           | 2026-09-14  |
| EV-002      | Control Tower defines management, Log Archive, and Audit responsibilities           | [AWS Control Tower shared accounts](https://docs.aws.amazon.com/controltower/latest/userguide/special-accounts.html)                                                                                                                                            | Design      | Engineering  | 2026-08-31   | Supports proposed core-account responsibilities; no landing zone was inspected    | 2026-09-14  |
| EV-003      | Management account should not host workloads                                        | [AWS Organizations management-account practices](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html)                                                                                                                 | Design      | Engineering  | 2026-08-31   | Supports the no-workload rule; no provider enforcement was verified               | 2026-09-14  |
| EV-004      | Home Region and shared-account choices are initial setup decisions                  | [AWS Control Tower quick start](https://docs.aws.amazon.com/controltower/latest/userguide/quick-start.html) and [shared-account configuration](https://docs.aws.amazon.com/controltower/latest/userguide/configure-shared-accounts.html)                        | Design      | Engineering  | 2026-08-31   | Supports the pre-launch gate; no eligibility or live selection was verified       | 2026-09-14  |
| EV-005      | Organizations can centralize member-root access                                     | [AWS centralized root access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-enable-root-access.html)                                                                                                                                                 | Design      | Engineering  | 2026-08-31   | Supports the proposed member-root model; no live root configuration was inspected | 2026-09-14  |
| EV-006      | AWS requires unique root emails; business management is guidance and project policy | [AWS Organizations account creation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html) and [account contact guidance](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-primary.html) | Design      | Engineering  | 2026-08-31   | Supports ownership prerequisites; no address, contact, or delivery was verified   | 2026-09-14  |
| EV-007      | AWS account IDs are identifiers, not secrets                                        | [AWS account identifiers](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-identifiers.html)                                                                                                                                                   | Design      | Engineering  | 2026-08-31   | Supports classification wording; repository restriction remains a project policy  | 2026-09-14  |
| EV-008      | Custom OUs require baseline enablement and accounts require enrollment              | [AWS Control Tower baselines](https://docs.aws.amazon.com/controltower/latest/userguide/types-of-baselines.html) and [account enrollment](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)                                        | Design      | Engineering  | 2026-08-31   | Supports governance gates; no OU baseline or account enrollment was inspected     | 2026-09-14  |
| EV-009      | Control Tower organization-trail handling is a setup choice                         | [AWS Control Tower CloudTrail configuration](https://docs.aws.amazon.com/controltower/latest/userguide/configure-org-trails.html)                                                                                                                               | Design      | Engineering  | 2026-08-31   | Supports selected trail strategy; no trail or destination was inspected           | 2026-09-14  |
| EV-010      | Governed Regions do not themselves prohibit other-Region deployment                 | [AWS Control Tower Region behavior](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) and [Region deny control](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)                                            | Design      | Engineering  | 2026-08-31   | Supports explicit Region-restriction control; no live policy was verified         | 2026-09-14  |
| EV-011      | Landing-zone status and drift require provider evidence                             | [AWS Control Tower GetLandingZone](https://docs.aws.amazon.com/controltower/latest/APIReference/API_GetLandingZone.html)                                                                                                                                        | Design      | Engineering  | 2026-08-31   | Defines evidence surface; no landing-zone response was collected                  | 2026-09-14  |

## Approval record

Approval is not implied by a merge, authorship, review request, meeting, or
silence.

Before this record can become `Accepted`, assumptions A-1 through A-8 must each
be `Confirmed` or `Conditioned` with an accountable owner, calendar due date,
and controlled confirmation reference. Every approval must name a non-placeholder
reviewer, use a real calendar date, reference this frontmatter revision, and cite
controlled evidence. An `Approved with conditions` row must use
`condition-ref: <controlled-reference>` in its final cell; that controlled
record must identify each condition's owner and due date.

| Review area                            | Accountable reviewer        | Decision | Date | Version/revision reviewed | Approval evidence | Conditions or expiry     |
| -------------------------------------- | --------------------------- | -------- | ---- | ------------------------- | ----------------- | ------------------------ |
| Architecture                           | Engineering owner           | Pending  | —    | 0.1                       | Pending           | P0.17 remains open       |
| Security                               | Pending assignment          | Pending  | —    | 0.1                       | Pending           | Reviewer required        |
| Privacy                                | Ghana/privacy reviewer      | Pending  | —    | 0.1                       | Pending           | P0.11 remains open       |
| Operations                             | Engineering owner           | Pending  | —    | 0.1                       | Pending           | Operating owner required |
| Business/legal/financial as applicable | Business and billing owners | Pending  | —    | 0.1                       | Pending           | Cost authority required  |

## Review and supersession

- Scheduled review date: 2026-09-14
- Review triggers: jurisdiction, data category, AWS guidance, account topology,
  root ownership, Region, service, cost, operating model, provider contract,
  incident, or control failure changes.
- Expiry action: return to or remain `Draft` until renewed approvals are
  recorded.
- Superseding ADR: none.

## Change log

| Date       | Revision | Author      | Change        | Approval impact       |
| ---------- | -------- | ----------- | ------------- | --------------------- |
| 2026-08-31 | 0.1      | Engineering | Initial draft | All approvals pending |
