---
id: RB-DOMAIN-NNN
title: "[Task or incident procedure]"
status: Draft
service_owner: "[Accountable role or team]"
procedure_owner: "[Maintainer role or team]"
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_tested: null
review_due: YYYY-MM-DD
expires_on: null
services: []
environments: []
severity_or_change_class: "[class or not applicable]"
data_classification: Internal
---

# RB-DOMAIN-NNN: [Task or incident procedure]

> **Template boundary:** This draft is not authorization to operate production,
> proof of training, evidence of successful recovery, or approval of a legal,
> privacy, security, financial, or customer-impacting action. Do not include
> secrets, credentials, payment data, personal data or other personally
> identifiable information (PII), customer records, or private contact details.

## Record controls

| Field                        | Value                                    |
| ---------------------------- | ---------------------------------------- |
| Service owner                | [role/team]                              |
| Procedure owner              | [role/team]                              |
| Primary operator role        | [role]                                   |
| Independent verifier role    | [role or rationale if not required]      |
| Security/privacy reviewer    | [role or applicability rationale]        |
| Business/operations approver | [role or applicability rationale]        |
| Last tested                  | YYYY-MM-DD or `Never`                    |
| Review due                   | YYYY-MM-DD                               |
| Expiry                       | YYYY-MM-DD or `No fixed expiry` + reason |
| Supersedes/superseded by     | [references or `None`]                   |

## Purpose, trigger, and boundaries

### Intended outcome

[State the observable safe end state.]

### Trigger

- Alert, request, schedule, incident state, or change condition: [replace]
- Who may invoke this runbook: [role]
- Who declares completion: [role]

### Scope

- Systems, environments, regions, data, and customers potentially affected:
  [replace]
- Explicit exclusions and linked procedures: [replace]
- Maximum permitted impact or blast radius: [replace]

### Per-execution authorization

| Action class                              | Required authorization  | Authorized role | Evidence to record |
| ----------------------------------------- | ----------------------- | --------------- | ------------------ |
| Read-only diagnosis                       | [required/not required] | [role]          | [ticket/event ref] |
| Reversible change                         | [required/not required] | [role]          | [approval ref]     |
| Money/order/data/access/production change | Required                | [role]          | [approval ref]     |

Document approval does not replace per-execution authorization where this table
requires it.

## Service and impact context

| Item                        | Value                           |
| --------------------------- | ------------------------------- |
| Customer or merchant impact | [replace]                       |
| Security/privacy impact     | [replace]                       |
| Financial/order impact      | [replace]                       |
| Dependencies and providers  | [replace]                       |
| SLO/error-budget effect     | [replace]                       |
| RPO/RTO or recovery target  | [replace or approved reference] |
| Source-of-truth system      | [replace]                       |
| Monitoring/dashboard        | [controlled reference]          |

## Roles and escalation

Use role names and controlled directory references, not personal contact data.

| Responsibility       | Primary role | Backup role | Escalation condition | Contact reference |
| -------------------- | ------------ | ----------- | -------------------- | ----------------- |
| Incident/change lead | [role]       | [role]      | [replace]            | [directory ref]   |
| Technical operator   | [role]       | [role]      | [replace]            | [directory ref]   |
| Security/privacy     | [role]       | [role]      | [replace]            | [directory ref]   |
| Merchant/business    | [role]       | [role]      | [replace]            | [directory ref]   |
| Provider             | [role]       | [role]      | [replace]            | [support ref]     |

## Preconditions and safety checks

- [ ] Correct incident, ticket, or approved change reference exists.
- [ ] Target environment, account, region, service, and revision are verified.
- [ ] Required access was obtained through the approved access system.
- [ ] Current impact and source-of-truth state were captured without personal or
      secret data.
- [ ] Backup, rollback, reconciliation, or compensating control is available.
- [ ] Required operator, verifier, and authorization roles are present.
- [ ] Maintenance window and customer/provider communication needs are assessed.
- [ ] Known conflicting deployment, migration, reconciliation, or incident work
      is ruled out.

### Inputs

| Input                           | Safe source  | Validation | Sensitive handling  |
| ------------------------------- | ------------ | ---------- | ------------------- |
| [synthetic or non-sensitive ID] | [system ref] | [check]    | [do not copy value] |

### Stop conditions

Stop, preserve evidence, and escalate when:

- the environment, account, target, authorization, or source of truth is unclear;
- a step exceeds the recorded blast radius or creates unplanned customer,
  financial, order, privacy, security, or availability impact;
- expected results do not match, evidence cannot be collected safely, or a
  rollback/reconciliation prerequisite is unavailable;
- a secret or personal record would need to be copied into an unsafe channel; or
- concurrent work invalidates the procedure's assumptions.

## Procedure

Use commands with placeholders and safe read-back checks. Never paste live
credentials or personal data into commands or evidence.

| Step | Action           | Expected result     | Evidence to capture    | Operator | Verifier | Failure/stop response    |
| ---- | ---------------- | ------------------- | ---------------------- | -------- | -------- | ------------------------ |
| 1    | [bounded action] | [observable result] | [sanitized ref/output] | [role]   | [role]   | [stop/rollback/escalate] |
| 2    | [bounded action] | [observable result] | [sanitized ref/output] | [role]   | [role]   | [stop/rollback/escalate] |

## Verification and reconciliation

- [ ] Customer-visible and administrative state matches the source of truth.
- [ ] Payment, order, inventory, promotion, refund, or message state is
      reconciled where affected; browser state alone is not authoritative.
- [ ] Security and privacy controls remain active and logs are appropriately
      redacted.
- [ ] Health, readiness, metrics, logs, traces, alerts, queue state, and provider
      status meet the documented success criteria.
- [ ] No unresolved side effects, orphaned resources, duplicate actions, or data
      integrity discrepancies remain.
- [ ] Independent verifier recorded the result where required.

### Success criteria

| Criterion | Measurement/source | Required result | Actual result  | Evidence reference |
| --------- | ------------------ | --------------- | -------------- | ------------------ |
| [replace] | [source]           | [threshold]     | [record later] | [immutable ref]    |

## Rollback, recovery, and fallback

- Point of no return: [step or `None`]
- Rollback authority: [role]
- Rollback trigger and maximum decision time: [replace]
- Data, money, order, message, or inventory reconciliation after rollback:
  [replace]
- Recovery procedure and safe restoration point: [controlled reference]
- Manual fallback, capacity, duration limit, and exit criteria: [replace]
- Escalation if rollback fails: [role and controlled contact reference]

## Communications and jurisdiction prompts

These prompts require accountable review and do not determine legal duties.

- Could execution affect customers, staff, providers, data, payments, orders,
  or services in Ghana, Germany, the EU/EEA, or another country?
- Which role determines any customer, provider, regulator, data-protection,
  payment, consumer, tax, or incident-notification requirement and deadline?
- Which approved language, time zone, channel, and message template applies?
- Does evidence or operational access cross borders, and who confirms access,
  retention, transfer, confidentiality, and deletion requirements?

| Audience  | Trigger   | Owner  | Channel/template reference | Timing    | Approval required |
| --------- | --------- | ------ | -------------------------- | --------- | ----------------- |
| [replace] | [replace] | [role] | [controlled ref]           | [replace] | [role]            |

Do not expose personal data, security details, internal identifiers, or
unconfirmed cause in communications.

## Execution evidence record

Store detailed or sensitive evidence in the approved controlled system.

| Execution ID | Environment/revision | Started/ended | Operators/verifier | Authorization ref | Outcome | Evidence ref    | Exceptions/follow-up |
| ------------ | -------------------- | ------------- | ------------------ | ----------------- | ------- | --------------- | -------------------- |
| [ID]         | [replace]            | [timestamps]  | [roles]            | [ref]             | [state] | [immutable ref] | [replace]            |

An execution row documents what was observed. It does not by itself approve a
control, close an incident, or prove future executions will succeed.

## Post-execution actions

- [ ] Monitoring period completed and exit criteria met.
- [ ] Incident/change record and sanitized evidence references updated.
- [ ] Temporary access, bypasses, feature flags, and resources removed or assigned
      an owner and expiry.
- [ ] Customer, merchant, provider, security, privacy, and operational follow-ups
      assigned with due dates.
- [ ] Runbook deviations and required corrections recorded.
- [ ] Post-incident review scheduled when the threshold is met.

## Validation and approval history

| Type     | Environment | Revision   | Date   | Result   | Participants by role | Evidence | Limits/conditions | Valid until |
| -------- | ----------- | ---------- | ------ | -------- | -------------------- | -------- | ----------------- | ----------- |
| Tabletop | [replace]   | [revision] | [date] | [result] | [roles]              | [ref]    | [replace]         | [date]      |

| Review area         | Reviewer    | Decision | Date | Revision reviewed | Evidence | Conditions/expiry |
| ------------------- | ----------- | -------- | ---- | ----------------- | -------- | ----------------- |
| Service owner       | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Security/privacy    | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |
| Operations/business | [role/name] | Pending  | —    | [revision]        | [ref]    | [replace]         |

Permitted decisions are `Approved`, `Approved with conditions`, `Rejected`, and
`Pending`. Set document status to `Approved` only for the explicitly reviewed
revision and validity period.

## Review triggers and change log

Review after a failed or materially deviating execution, incident, architecture
or provider change, new environment or jurisdiction, access/control change,
recovery-objective change, or expiry.

| Date   | Revision | Author | Change        | Validation/approval impact      |
| ------ | -------- | ------ | ------------- | ------------------------------- |
| [date] | 0.1      | [role] | Initial draft | Validation and approval pending |
