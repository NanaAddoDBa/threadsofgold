---
id: EV-NNNN
title: "[Bounded evidence claim]"
status: Draft
control_or_obligation_refs: []
evidence_owner: "[Accountable role or team]"
collector: "[Role]"
reviewer: "[Independent role where required]"
created: YYYY-MM-DD
collected_at: YYYY-MM-DDTHH:MM:SSZ
reviewed_at: null
review_due: YYYY-MM-DD
valid_until: YYYY-MM-DD
retention_until: YYYY-MM-DD
systems: []
environments: []
release_or_revision: "[version, commit, image digest, or provider revision]"
jurisdictions_to_assess:
  - Ghana
  - Germany
  - EU-EEA
classification: Internal
---

# EV-NNNN: [Bounded evidence claim]

> **Template boundary:** This draft is not legal advice, a compliance approval,
> a legal determination, or proof beyond the exact claim, scope, version,
> environment, method, and validity period recorded below. Do not include
> secrets, credentials, payment data, personal data or other personally
> identifiable information (PII), customer records, or raw restricted evidence.

## Ownership and validity controls

| Field                  | Value                                    |
| ---------------------- | ---------------------------------------- |
| Evidence owner         | [role/team]                              |
| Control/process owner  | [role/team]                              |
| Collector              | [role]                                   |
| Reviewer               | [role]                                   |
| Independence limits    | [none or explain overlapping roles]      |
| Collection timestamp   | [ISO 8601 with time zone]                |
| Review due             | YYYY-MM-DD                               |
| Valid until            | YYYY-MM-DD + rationale                   |
| Retention until/action | YYYY-MM-DD + delete/archive/review owner |

## Claim and boundaries

### Claim being evaluated

[Write one testable statement. Include the control, system, environment,
revision, population or time range, and required result.]

### Explicit non-claims

- [State what this evidence cannot demonstrate.]
- [State environments, releases, transactions, users, or periods not covered.]

### Source requirement

- Internal control, policy, contract, business rule, or external requirement
  reference: [stable reference and revision]
- Applicability determination owner and evidence: [role + controlled reference]
- Required result and tolerance: [replace]

Do not infer applicability from an external title or checklist. A qualified,
accountable reviewer must record the determination.

## Jurisdiction and cross-border assessment prompts

These questions route review and are not legal conclusions.

- What connection, if any, does the claim have to merchant operations,
  customers, staff, tax, payments, promotions, delivery, records, or
  personal-data processing in Ghana?
- What connection, if any, does it have to people, infrastructure, processors,
  access, marketing, cookies, consumer activity, or personal-data processing in
  Germany or the EU/EEA?
- Does data, money, inventory, evidence, or operational access cross a national
  boundary? Who determines the required contract, safeguard, notice, retention,
  access, or reporting treatment?
- Which versioned primary source and qualified reviewer support the conclusion?

| Jurisdiction/topic | Potential connection | Determination needed from | Status  | Dated conclusion reference | Review due |
| ------------------ | -------------------- | ------------------------- | ------- | -------------------------- | ---------- |
| Ghana              | [replace]            | [role]                    | Pending | [controlled ref]           | [date]     |
| Germany/EU/EEA     | [replace]            | [role]                    | Pending | [controlled ref]           | [date]     |
| Cross-border/other | [replace]            | [role]                    | Pending | [controlled ref]           | [date]     |

## Evidence artifact

The repository stores metadata and safe references, not restricted artifacts.

| Attribute                        | Value                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Artifact type                    | [test report, log extract, configuration export, attestation, review, provider statement, etc.] |
| Authoritative source             | [system/provider/process]                                                                       |
| Controlled location              | [stable access-controlled reference]                                                            |
| Immutable version/object ID      | [replace]                                                                                       |
| Digest/signature                 | [algorithm:value or `Not available` + rationale]                                                |
| System/release/environment       | [replace]                                                                                       |
| Population/time window           | [replace]                                                                                       |
| Collection method/tool version   | [replace]                                                                                       |
| Chain-of-custody or provenance   | [creation, transfer, storage, access owner]                                                     |
| Classification                   | [public/internal/confidential/restricted]                                                       |
| Redaction/minimization performed | [method and reviewer; no removed values]                                                        |

## Privacy and security handling

- Personal or sensitive data expected in the source artifact: [categories only]
- Minimization and redaction applied: [replace]
- Authorized roles and access system: [roles + controlled reference]
- Encryption/integrity protection: [control reference]
- Storage region and cross-border access requiring review: [replace]
- Retention/deletion method and accountable owner: [replace]
- Suspected exposure, integrity failure, or access failure response: [runbook ref]

Never paste a sample record, identifier, credential, token, key, or customer data
to demonstrate handling.

## Collection and evaluation method

1. [Reproducible, bounded collection step using synthetic/sanitized output]

### Sampling and limitations

- Sampling method and population: [replace]
- Known blind spots, exclusions, uncertainty, and tool limitations: [replace]
- Conditions that would invalidate this evidence: [replace]

## Result

| Criterion | Expected  | Observed       | Result  | Evidence location      |
| --------- | --------- | -------------- | ------- | ---------------------- |
| [replace] | [replace] | [safe summary] | Pending | [artifact section/ref] |

Overall evaluation: `Pending`

Allowed evaluations are `Pass`, `Pass with conditions`, `Fail`, `Inconclusive`,
and `Pending`. A `Pass` means only that the stated criterion was met for the
recorded scope.

## Gaps, exceptions, and remediation

| ID  | Gap or exception | Risk/impact | Compensating control | Owner  | Due    | Blocking? | Tracking ref |
| --- | ---------------- | ----------- | -------------------- | ------ | ------ | --------- | ------------ |
| G-1 | [replace]        | [replace]   | [replace]            | [role] | [date] | [yes/no]  | [ref]        |

An exception is not approved until the authorized owner records scope,
rationale, controls, review date, and expiry in the approval section.

## Review and approval

| Review area                            | Reviewer    | Decision | Date | Record/artifact revision reviewed | Approval evidence | Conditions/expiry |
| -------------------------------------- | ----------- | -------- | ---- | --------------------------------- | ----------------- | ----------------- |
| Evidence relevance/integrity           | [role/name] | Pending  | —    | [revision]                        | [ref]             | [replace]         |
| Control/process owner                  | [role/name] | Pending  | —    | [revision]                        | [ref]             | [replace]         |
| Security/privacy as applicable         | [role/name] | Pending  | —    | [revision]                        | [ref]             | [replace]         |
| Legal/business/financial as applicable | [role/name] | Pending  | —    | [revision]                        | [ref]             | [replace]         |

Permitted decisions are `Approved`, `Approved with conditions`, `Rejected`, and
`Pending`. Approval applies only to the stated claim and evidence revision.

## Review triggers and change log

Review at expiry and after system, release, environment, control, source,
collection method, provider, jurisdiction, legal determination, incident, or
artifact-integrity changes.

| Date   | Revision | Author | Change        | Validity/approval impact |
| ------ | -------- | ------ | ------------- | ------------------------ |
| [date] | 0.1      | [role] | Initial draft | All reviews pending      |
