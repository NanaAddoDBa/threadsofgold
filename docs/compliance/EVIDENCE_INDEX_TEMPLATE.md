# Compliance Evidence Index

> **Template boundary:** This index is an inventory, not the evidence itself and
> not proof of compliance or control effectiveness. Keep the status `Draft`
> until the accountable owner approves the index scope. Do not include secrets,
> credentials, payment data, personal data or other personally identifiable
> information (PII), customer records, private contact details, or raw restricted
> artifacts.

## Index metadata

| Field                        | Value                                                  |
| ---------------------------- | ------------------------------------------------------ |
| Index ID                     | EVI-NNN                                                |
| Title/scope                  | [system, control family, release, or reporting period] |
| Status                       | Draft                                                  |
| Accountable owner            | [role/team]                                            |
| Maintainer                   | [role/team]                                            |
| Created/last updated         | YYYY-MM-DD / YYYY-MM-DD                                |
| Review due                   | YYYY-MM-DD                                             |
| Validity period              | [start/end or event-bound scope]                       |
| Jurisdictions to assess      | Ghana; Germany; EU/EEA; [other]                        |
| Classification               | Internal                                               |
| Approved retention reference | [controlled reference or pending owner]                |

## Scope and completeness boundary

- Controls, obligations, systems, environments, releases, and time periods in
  scope: [replace]
- Explicit exclusions: [replace]
- Source used to determine the required evidence set: [versioned reference]
- Accountable applicability reviewer: [role]
- Completeness method and known blind spots: [replace]

Do not call the index complete merely because every current row has a link.
Completeness requires a reviewed required-evidence population and explicit
treatment of missing, expired, failed, inaccessible, and superseded records.

## Jurisdiction review routing

The index does not decide whether Ghanaian, German, EU/EEA, or other requirements
apply. Record the accountable qualified reviewer, dated conclusion, source
revision, scope, and next review for each potentially relevant topic.

| Topic/jurisdiction | Reviewer role | Status  | Conclusion reference | Source revision | Review due |
| ------------------ | ------------- | ------- | -------------------- | --------------- | ---------- |
| Ghana              | [role]        | Pending | [controlled ref]     | [replace]       | [date]     |
| Germany/EU/EEA     | [role]        | Pending | [controlled ref]     | [replace]       | [date]     |
| Cross-border/other | [role]        | Pending | [controlled ref]     | [replace]       | [date]     |

## Evidence inventory

Use one [evidence record](./EVIDENCE_RECORD_TEMPLATE.md) for each materially
different claim, artifact, environment, or validity period.

| Evidence ID | Control/obligation ref | Bounded claim | System/environment/revision | Artifact type | Controlled artifact ref | Record ref | Owner  | Evaluation | Collected | Valid until | Review due | Status/gaps |
| ----------- | ---------------------- | ------------- | --------------------------- | ------------- | ----------------------- | ---------- | ------ | ---------- | --------- | ----------- | ---------- | ----------- |
| EV-NNNN     | [ref]                  | [replace]     | [replace]                   | [type]        | [restricted ref]        | [record]   | [role] | Pending    | [date]    | [date]      | [date]     | Draft       |

Allowed inventory states are `Draft`, `In review`, `Current`, `Failed`,
`Inconclusive`, `Expired`, `Inaccessible`, and `Superseded`. Only an approved
evidence record with an unexpired validity window may be labelled `Current`.

## Coverage and gap review

| Required claim/control | Required evidence | Present record | Current? | Gap/risk  | Owner  | Due    | Blocking? |
| ---------------------- | ----------------- | -------------- | -------- | --------- | ------ | ------ | --------- |
| [replace]              | [replace]         | [EV ref/none]  | [yes/no] | [replace] | [role] | [date] | [yes/no]  |

## Access, privacy, security, and retention controls

- Evidence store and access-control owner: [controlled reference + role]
- Personal/sensitive categories expected in source evidence: [categories only]
- Minimization/redaction standard and reviewer: [reference + role]
- Integrity/provenance method: [digest, signature, immutable version, audit log]
- Cross-border storage/access requiring accountable review: [replace]
- Retention, legal-hold, deletion, and verification method: [approved reference]
- Exposure or integrity-failure runbook: [reference]

## Review and approval

| Review area                  | Reviewer    | Decision | Date | Index revision | Evidence | Conditions/expiry |
| ---------------------------- | ----------- | -------- | ---- | -------------- | -------- | ----------------- |
| Scope/completeness           | [role/name] | Pending  | —    | [revision]     | [ref]    | [replace]         |
| Security/privacy handling    | [role/name] | Pending  | —    | [revision]     | [ref]    | [replace]         |
| Legal/business applicability | [role/name] | Pending  | —    | [revision]     | [ref]    | [replace]         |

Review after evidence expiry or failure, control/source/system/provider changes,
new jurisdictions or processing, incidents, legal determinations, access loss,
or integrity concerns. Merge is not approval.

## Change log

| Date   | Revision | Author | Change        | Approval/completeness impact |
| ------ | -------- | ------ | ------------- | ---------------------------- |
| [date] | 0.1      | [role] | Initial draft | All reviews pending          |
