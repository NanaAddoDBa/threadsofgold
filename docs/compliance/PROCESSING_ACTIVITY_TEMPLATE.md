---
id: PA-NNN
title: "[Processing activity]"
status: Draft
business_owner: "[Accountable role or team]"
privacy_owner: "[Accountable privacy role]"
system_owner: "[Accountable technical role]"
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
review_due: YYYY-MM-DD
expires_on: null
systems: []
environments: []
jurisdictions_to_assess:
  - Ghana
  - Germany
  - EU-EEA
classification: Restricted
---

# PA-NNN: [Processing activity]

> **Template boundary:** This draft is a requirements and review aid. It is not
> legal advice, a lawful-basis determination, authorization to process personal
> data, a completed processing register, a transfer assessment, a privacy notice,
> or proof of compliance. Never include real names, identifiers, personal data or
> other personally identifiable information (PII), customer records, payment
> data, credentials, or other secret data.

## Ownership and review controls

| Field                    | Value                                    |
| ------------------------ | ---------------------------------------- |
| Business owner           | [role/team]                              |
| Privacy owner/reviewer   | [role/team]                              |
| System/security owner    | [role/team]                              |
| Operations owner         | [role/team]                              |
| Legal reviewer if needed | [role or pending applicability review]   |
| Review due               | YYYY-MM-DD                               |
| Expiry                   | YYYY-MM-DD or `No fixed expiry` + reason |
| Related evidence index   | [reference]                              |

## Activity and purpose

- Plain-language activity description: [replace]
- Business capability and accountable purpose owner: [replace]
- Proposed purposes: [replace]
- Explicit incompatible or prohibited uses: [replace]
- Start/stop events and frequency: [replace]
- Systems, environments, staff roles, automation, and providers involved:
  [replace]

Purpose descriptions are proposals until the accountable privacy/legal reviewer
records a determination and the business owner approves the stated use.

## People and data

Use categories only; never enter real records or identifiers.

| Data-subject category  | Relationship/context | Vulnerability or power imbalance to assess | Approximate scale | Jurisdictions/locations to assess |
| ---------------------- | -------------------- | ------------------------------------------ | ----------------- | --------------------------------- |
| [customers/staff/etc.] | [replace]            | [replace]                                  | [range]           | [replace]                         |

| Personal-data category | Fields/categories only | Source    | Required for purpose? | Optional? | Accuracy owner | Sensitivity assessment |
| ---------------------- | ---------------------- | --------- | --------------------- | --------- | -------------- | ---------------------- |
| [category]             | [no real values]       | [replace] | [pending]             | [pending] | [role]         | [pending review]       |

### Minimization decisions

| Proposed data | Purpose dependency | Less intrusive alternative | Decision owner | Decision/evidence ref | Review due |
| ------------- | ------------------ | -------------------------- | -------------- | --------------------- | ---------- |
| [category]    | [replace]          | [replace]                  | [role]         | [pending]             | [date]     |

## Roles, recipients, and providers

Do not infer controller, joint-controller, processor, subprocessor, or recipient
status from this template. Record the qualified determination and contract
reference.

| Organization/role   | Proposed relationship | Data/actions | Purpose   | Location/access location | Determination owner | Contract/terms/DPA ref | Status  |
| ------------------- | --------------------- | ------------ | --------- | ------------------------ | ------------------- | ---------------------- | ------- |
| [merchant/provider] | [pending review]      | [categories] | [replace] | [country/region]         | [role]              | [controlled ref]       | Pending |

## Data flow, storage, and access

- Versioned data-flow diagram: [reference]
- Collection points and notices: [replace]
- Storage systems, regions, backups, caches, logs, analytics, and exports:
  [replace]
- Internal and provider access roles; least-privilege and review process:
  [replace]
- Automated decisions, profiling, recommendations, support AI, or human review:
  [replace]
- Interfaces for access, correction, export, restriction, objection, deletion,
  consent/preference change, and complaint handling: [replace]

## Jurisdiction and cross-border determination prompts

These prompts identify required expertise; they do not decide applicability.

- Ghana: Which accountable reviewer determines any data-protection registration,
  controller/processor, notice, consent or other basis, security, retention,
  data-subject rights, breach, marketing, payment, employment, or records
  requirements connected to the activity?
- Germany and the EU/EEA: Which reviewer determines whether people,
  establishment, offering, monitoring, cookies/marketing, employment,
  infrastructure, or processor activity creates relevant obligations?
- Cross-border: For every flow or remote-access path involving Ghana, Germany,
  the EU/EEA, or another country, who determines roles, transfer safeguards,
  contracts, recipient disclosures, localization, retention, and onward access?
- Provider/merchant boundary: Who confirms current service region, merchant
  eligibility, provider terms, subprocessor locations, deletion, export, and
  incident commitments?

| Topic              | Question requiring determination | Accountable reviewer | Primary source/revision | Dated conclusion ref | Review due | Status  |
| ------------------ | -------------------------------- | -------------------- | ----------------------- | -------------------- | ---------- | ------- |
| Ghana              | [replace]                        | [role]               | [versioned source]      | [controlled ref]     | [date]     | Pending |
| Germany/EU/EEA     | [replace]                        | [role]               | [versioned source]      | [controlled ref]     | [date]     | Pending |
| Cross-border/other | [replace]                        | [role]               | [versioned source]      | [controlled ref]     | [date]     | Pending |

## Legal/privacy determinations requiring approval

Record conclusions supplied by qualified accountable reviewers; do not fill
these fields by assumption or reuse a decision beyond its recorded scope.

| Topic                               | Proposed treatment | Determination | Reviewer | Date | Scope/source/evidence | Conditions/expiry |
| ----------------------------------- | ------------------ | ------------- | -------- | ---- | --------------------- | ----------------- |
| Purpose and role                    | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| Lawful basis/consent                | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| Notice/cookies/marketing            | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| Rights handling                     | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| Retention/deletion                  | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| Cross-border transfer/access        | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |
| High-risk/privacy-impact assessment | [replace]          | Pending       | [role]   | —    | [ref]                 | [replace]         |

## Retention, deletion, and lifecycle

| Data/category/system | Trigger | Proposed active period | Backup/log/cache treatment | Deletion/anonymization method | Exceptions/hold owner | Verification evidence | Approved by |
| -------------------- | ------- | ---------------------- | -------------------------- | ----------------------------- | --------------------- | --------------------- | ----------- |
| [category/system]    | [event] | [pending review]       | [replace]                  | [replace]                     | [role]                | [ref]                 | Pending     |

- Account closure, order/contract completion, consent/preference withdrawal, and
  deletion-request effects: [replace]
- Provider termination/export/deletion procedure: [replace]
- Deletion failure detection, escalation, and runbook: [reference]

## Security, privacy, and operational controls

| Control area             | Required outcome | Design/control reference | Owner  | Implementation status | Verification evidence | Review due |
| ------------------------ | ---------------- | ------------------------ | ------ | --------------------- | --------------------- | ---------- |
| Access/segregation       | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Encryption/secrets       | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Logging/redaction        | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Accuracy/integrity       | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Availability/recovery    | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Rights/deletion          | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |
| Incident/breach response | [replace]        | [ref]                    | [role] | Planned               | [EV ref]              | [date]     |

`Implemented` does not mean `Verified`; verification requires objective,
current evidence for the stated release and environment.

## Risk, necessity, and review threshold

- Necessity and proportionality questions: [replace]
- Potential harm, discrimination, exclusion, disclosure, loss, fraud, distress,
  surveillance, or loss-of-control scenarios: [replace]
- Less intrusive alternatives considered: [replace]
- Trigger and owner for formal privacy-impact, security, legal, or business-risk
  assessment: [replace]
- Related threat model and open risks: [reference]

| Risk ID | Scenario  | Likelihood | Impact   | Treatment | Owner  | Residual decision owner | Due/expiry |
| ------- | --------- | ---------- | -------- | --------- | ------ | ----------------------- | ---------- |
| PR-001  | [replace] | [rating]   | [rating] | [replace] | [role] | [role]                  | [date]     |

## Evidence and approval

| Evidence ID | Claim supported | Environment/revision | Evidence record | Result  | Valid until |
| ----------- | --------------- | -------------------- | --------------- | ------- | ----------- |
| EV-NNNN     | [replace]       | [replace]            | [reference]     | Pending | [date]      |

| Review area                 | Reviewer    | Decision | Date | Revision reviewed | Evidence | Conditions/expiry |
| --------------------------- | ----------- | -------- | ---- | ----------------- | -------- | ----------------- |
| Business purpose            | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Privacy/legal determination | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Security                    | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Operations                  | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |

Permitted decisions are `Approved`, `Approved with conditions`, `Rejected`, and
`Pending`. Set status to `Approved` only after all required determinations and
control/evidence conditions are recorded. Approval of this record does not prove
continuous compliance or authorize a materially changed activity.

## Review triggers and change log

Review before activation and after purpose, data, people, scale, provider,
location, access, automation, retention, security, incident, rights request,
legal determination, or evidence-validity changes.

| Date   | Revision | Author | Change        | Re-review/approval impact |
| ------ | -------- | ------ | ------------- | ------------------------- |
| [date] | 0.1      | [role] | Initial draft | All reviews pending       |
