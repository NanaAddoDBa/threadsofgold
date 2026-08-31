---
id: TM-NNN
title: "[System or journey threat model]"
status: Draft
owner: "[Accountable engineering or security role]"
facilitator: "[Role]"
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
review_due: YYYY-MM-DD
expires_on: null
systems: []
environments: []
release_or_revision: "[version, commit, or design revision]"
jurisdictions_to_assess:
  - Ghana
  - Germany
  - EU-EEA
data_classification: Restricted
---

# TM-NNN: [System or journey]

> **Template boundary:** This draft is not a security approval, penetration
> test, compliance result, privacy assessment, or proof of control operation.
> Do not include secrets, credentials, payment data, personal data or other
> personally identifiable information (PII), customer records, live exploit
> payloads, or confidential infrastructure details.

## Record controls

| Field                | Value                                    |
| -------------------- | ---------------------------------------- |
| Accountable owner    | [role or team]                           |
| Security reviewer    | [role]                                   |
| Privacy reviewer     | [role]                                   |
| Operations reviewer  | [role]                                   |
| Business risk owner  | [role]                                   |
| Scope revision       | [design/commit/release reference]        |
| Review due           | YYYY-MM-DD                               |
| Expiry               | YYYY-MM-DD or `No fixed expiry` + reason |
| Restricted companion | [controlled reference or `None`]         |

## Scope and security objectives

### In scope

- Journeys, services, queues, stores, identities, providers, and environments:
  [replace]
- Entry and exit points: [replace]

### Out of scope

- [Explicit exclusion, owner, and separate model or review date]

### Security and privacy objectives

- Confidentiality: [objective]
- Integrity: [objective]
- Availability and recoverability: [objective]
- Authenticity, authorization, and non-repudiation: [objective]
- Privacy, minimization, purpose limitation, and deletion: [objective]
- Financial, inventory, promotion, and order correctness: [objective]

## Assumptions and dependencies

| ID  | Assumption or dependency | Owner  | Confirmation evidence | Due    | Failure impact |
| --- | ------------------------ | ------ | --------------------- | ------ | -------------- |
| A-1 | [replace]                | [role] | [reference]           | [date] | [replace]      |

Do not mark provider, framework, cloud, payment, or identity controls as trusted
without stating their boundary and the evidence reviewed.

## Architecture and data flow

### Diagram

[Link a versioned diagram or add a non-sensitive Mermaid diagram. Number every
process, datastore, actor, external system, data flow, and trust boundary.]

### Components and trust boundaries

| ID  | Component/actor | Role      | Trust level | Authentication | Authorization | Owner  |
| --- | --------------- | --------- | ----------- | -------------- | ------------- | ------ |
| C1  | [replace]       | [replace] | [replace]   | [replace]      | [replace]     | [role] |

| Boundary ID | From/to   | Why trust changes | Data/actions crossing | Protection | Failure mode |
| ----------- | --------- | ----------------- | --------------------- | ---------- | ------------ |
| TB1         | [replace] | [replace]         | [replace]             | [replace]  | [replace]    |

### Data inventory

| Data ID | Category  | Personal/sensitive? | Source    | Destinations | Purpose to confirm | Retention/deletion owner | Protection |
| ------- | --------- | ------------------- | --------- | ------------ | ------------------ | ------------------------ | ---------- |
| D1      | [replace] | [yes/no/unknown]    | [replace] | [replace]    | [replace]          | [role]                   | [replace]  |

Do not enter real records or identifiers. Link the approved processing record
for any personal-data purpose, legal basis, retention, or transfer conclusion.

## Actors, assets, and abuse goals

### Assets

| Asset     | Required property | Business impact if lost | Technical owner | Business owner |
| --------- | ----------------- | ----------------------- | --------------- | -------------- |
| [replace] | [C/I/A/etc.]      | [replace]               | [role]          | [role]         |

### Actors and capabilities

| Actor     | Intended access | Credible capability | Motivation or error | Boundary |
| --------- | --------------- | ------------------- | ------------------- | -------- |
| [replace] | [replace]       | [replace]           | [replace]           | [TB]     |

Consider anonymous customers, registered customers, merchant staff,
administrators, support operators, developers, providers, automation, insiders,
compromised dependencies, bots, and accidental misuse where relevant.

### Misuse and abuse cases

| ID  | Abuse goal or failure | Preconditions | Observable signal | Impact    | Existing control |
| --- | --------------------- | ------------- | ----------------- | --------- | ---------------- |
| U1  | [replace]             | [replace]     | [replace]         | [replace] | [replace]        |

## Threat analysis

Use STRIDE or another named method consistently. Include privacy, fraud, safety,
availability, supply-chain, and operational failure even when they do not fit a
single STRIDE category.

| Threat ID | Category          | Scenario and affected boundary | Existing control | Likelihood | Impact   | Initial risk | Proposed treatment | Owner  | Due    |
| --------- | ----------------- | ------------------------------ | ---------------- | ---------- | -------- | ------------ | ------------------ | ------ | ------ |
| T-001     | [method/category] | [credible scenario]            | [replace]        | [rating]   | [rating] | [rating]     | [replace]          | [role] | [date] |

### Required review lenses

- Identity and session lifecycle, privilege escalation, access revocation, and
  administrative segregation: [findings]
- Input validation, injection, file/media handling, SSRF, unsafe redirects, and
  browser security boundaries: [findings]
- Server-authoritative price, inventory, promotion, order, refund, and payment
  state; replay, race, idempotency, webhook, and reconciliation: [findings]
- Logging, redaction, detection, alerting, investigation, and evidence integrity:
  [findings]
- Dependency, build, CI/CD, container, infrastructure, secret, and provider
  supply-chain exposure: [findings]
- Denial of service, resource exhaustion, recovery, backup, and failover:
  [findings]
- Automation, support AI, tool access, prompt/content injection, disclosure, and
  required human escalation where applicable: [findings]

## Jurisdiction and cross-border review prompts

These are scoping prompts for accountable reviewers, not legal conclusions.

- Identify whether people, merchant operations, processors, support access, or
  infrastructure in Ghana, Germany, the EU/EEA, or another country are affected.
- Identify who must determine applicable privacy, payment, consumer, promotion,
  employment, records, breach-notification, and cybersecurity obligations.
- Map every cross-border personal-data or operational-access path and link the
  qualified review of roles, safeguards, contracts, retention, and recipients.
- Record time-zone, language, local incident contact, evidence-preservation, and
  notification dependencies without copying personal contact details here.

## Treatment and verification

| Control ID | Threats addressed | Treatment | Layer                            | Delivery owner | Status  | Verification method | Evidence reference | Verified by/on | Valid until |
| ---------- | ----------------- | --------- | -------------------------------- | -------------- | ------- | ------------------- | ------------------ | -------------- | ----------- |
| CT-001     | T-001             | [replace] | [prevent/detect/respond/recover] | [role]         | Planned | [test/review]       | [immutable ref]    | [role/date]    | [date]      |

Control status values:

- `Planned`: intended but not delivered.
- `Implemented`: present in code/configuration but not independently verified.
- `Verified`: objective evidence passed for the stated version and environment.
- `Failed`: verification failed or the control regressed.
- `Not applicable`: reviewer recorded a scoped rationale and evidence.

## Detection, response, and recovery

- Required logs and redaction controls: [replace]
- Alert signals, thresholds, owner, and escalation path: [replace]
- Containment and revocation actions: [replace]
- Reconciliation, restoration, and integrity checks: [replace]
- Runbooks, dashboards, provider contacts, and communication references:
  [controlled references]
- Evidence preservation and access controls: [replace]

## Residual risk decisions

Mitigation completion does not automatically accept residual risk.

| Risk ID | Residual scenario | Rating   | Decision | Authorized acceptor | Rationale | Compensating controls | Evidence | Review due | Expires |
| ------- | ----------------- | -------- | -------- | ------------------- | --------- | --------------------- | -------- | ---------- | ------- |
| T-001   | [replace]         | [rating] | Pending  | [role/name]         | [replace] | [replace]             | [ref]    | [date]     | [date]  |

Only an explicitly authorized business or security risk owner may record
`Accepted`. Expired acceptance returns to `Pending` until reviewed.

## Exit gate and approval record

- [ ] Scope and data flow match the reviewed release or design revision.
- [ ] Every threat has an owner and treatment or explicit residual-risk decision.
- [ ] High-impact controls have objective verification evidence.
- [ ] Privacy and jurisdiction questions have named accountable reviewers.
- [ ] Detection, response, recovery, and runbook dependencies are addressed.
- [ ] Open conditions have due dates and block activation where required.

| Review area   | Reviewer    | Decision | Date | Revision reviewed | Evidence | Conditions/expiry |
| ------------- | ----------- | -------- | ---- | ----------------- | -------- | ----------------- |
| Engineering   | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Security      | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Privacy       | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Operations    | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Business risk | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |

Permitted decisions are `Approved`, `Approved with conditions`, `Rejected`, and
`Pending`. Document merge does not change a pending decision.

## Review triggers and change log

Review after material architecture, data, provider, privilege, dependency,
jurisdiction, threat, incident, control-failure, or release-boundary changes.

| Date   | Revision | Author | Change        | Threat/control impact    | Re-review required |
| ------ | -------- | ------ | ------------- | ------------------------ | ------------------ |
| [date] | 0.1      | [role] | Initial draft | Baseline not established | Yes                |
