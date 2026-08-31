---
id: ADR-NNNN
title: "[Decision title]"
status: Draft
owner: "[Accountable role or team]"
authors:
  - "[Author role or team]"
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
review_due: YYYY-MM-DD
expires_on: null
supersedes: []
superseded_by: null
systems: []
environments: []
jurisdictions_to_assess:
  - Ghana
  - Germany
  - EU-EEA
data_classification: Internal
---

# ADR-NNNN: [Decision title]

> **Template boundary:** This record starts as a draft. It is not legal advice,
> an approval, compliance evidence, an implementation record, or proof of a
> production control. Do not include secrets, credentials, payment data,
> personal data or other personally identifiable information (PII), customer
> records, or confidential provider material.

## Record controls

| Field                    | Value                                       |
| ------------------------ | ------------------------------------------- |
| Accountable owner        | [Named role or team]                        |
| Decision authority       | [Role permitted to accept this decision]    |
| Security reviewer        | [Role or `Not required` with rationale]     |
| Privacy reviewer         | [Role or `Not required` with rationale]     |
| Operations reviewer      | [Role or `Not required` with rationale]     |
| Business reviewer        | [Role or `Not required` with rationale]     |
| Legal/financial reviewer | [Role or `Pending applicability review`]    |
| Review due               | YYYY-MM-DD                                  |
| Expiry                   | YYYY-MM-DD or `No fixed expiry` + rationale |

## Decision summary

### Proposed decision

[State one decision in precise, implementation-neutral language.]

### Scope

- Included systems, processes, data, teams, and environments: [replace]
- Explicit exclusions and non-goals: [replace]
- Earliest permitted implementation or activation point: [replace]

### Current state and problem

[Describe the verified current state, the problem, who is affected, and why a
decision is needed. Separate facts from assumptions.]

## Drivers, constraints, and assumptions

### Decision drivers

- [Measurable requirement or outcome]

### Constraints

- [Technical, commercial, contractual, operational, security, privacy, or
  accessibility constraint]

### Assumptions requiring confirmation

| ID  | Assumption | Owner  | Confirmation source | Due date | Status |
| --- | ---------- | ------ | ------------------- | -------- | ------ |
| A-1 | [replace]  | [role] | [stable reference]  | [date]   | Open   |

An assumption is not client, provider, legal, or operational approval. If an
assumption fails, record whether the decision must return to `Draft`.

## Options considered

| Option | Description | Benefits  | Costs and risks | Evidence | Outcome |
| ------ | ----------- | --------- | --------------- | -------- | ------- |
| A      | [replace]   | [replace] | [replace]       | [ref]    | [state] |
| B      | [replace]   | [replace] | [replace]       | [ref]    | [state] |

Include the current-state option. Explain why each rejected option did not meet
the stated drivers; do not manufacture alternatives after the decision.

## Consequences and controls

### Expected outcomes

- [Positive consequence and how it will be measured]

### Trade-offs and new risks

| Risk or trade-off | Likelihood | Impact   | Control or response | Owner  | Review trigger |
| ----------------- | ---------- | -------- | ------------------- | ------ | -------------- |
| [replace]         | [rating]   | [rating] | [replace]           | [role] | [replace]      |

### Security and abuse considerations

- Assets, identities, trust boundaries, and privileged actions affected:
  [replace]
- Authentication, authorization, encryption, key management, audit, and
  segregation-of-duties effects: [replace]
- Abuse, fraud, supply-chain, availability, and incident-detection effects:
  [replace]
- Required threat model and unresolved security findings: [reference]

### Privacy and data considerations

- Personal-data categories and data subjects potentially affected: [replace]
- Purpose, minimization, access, retention, deletion, and data-subject request
  effects: [replace]
- Controller, processor, subprocessor, recipient, storage, and transfer
  questions requiring accountable review: [replace]
- Required privacy assessment and unresolved privacy findings: [reference]

Do not infer a lawful basis, retention period, transfer mechanism, consent
requirement, or regulatory obligation. Record the named qualified reviewer and
their dated determination in the evidence section.

### Reliability and operations considerations

- Availability, capacity, observability, alerting, backup, recovery, RPO, RTO,
  and support effects: [replace]
- Deployment, migration, rollback, reconciliation, and manual fallback:
  [replace]
- Required runbooks, training, access changes, and on-call ownership: [replace]
- Cost, vendor dependency, exit plan, and decommissioning effects: [replace]

## Jurisdiction and cross-border review prompts

These prompts identify questions for qualified review; they do not state which
law applies or provide a legal conclusion.

- Ghana: Could the decision affect business registration, tax, payments,
  promotions, consumer commitments, delivery, records, or personal-data
  processing? Who must determine the applicable requirement and provide the
  dated source?
- Germany and the EU/EEA: Could the decision affect people, infrastructure,
  monitoring, marketing, cookies, price presentation, consumer rights, or
  personal-data processing in Germany or the EU/EEA? Who must determine scope?
- Cross-border: Does data, support access, money, inventory, or operational
  responsibility move between Ghana, Germany, the EU/EEA, or another country?
  Which owner must assess location, transfer, contract, retention, and access?
- Provider boundary: Which provider terms, merchant eligibility, regional
  service limitations, or processor commitments require current confirmation?

Record conclusions only after the accountable business, legal/privacy,
financial, or provider reviewer supplies a dated, citable determination.

## Implementation and verification plan

### Delivery plan

1. [Smallest reversible implementation step]

### Rollback and exit plan

[State the last safe rollback point, data migration implications, and who may
authorize rollback.]

### Acceptance criteria

- [Objective, observable criterion]

### Evidence plan

| Claim to verify | Method        | Environment   | Evidence owner | Due date |
| --------------- | ------------- | ------------- | -------------- | -------- |
| [replace]       | [test/review] | [environment] | [role]         | [date]   |

## Evidence reviewed

Do not attach sensitive raw evidence. Use immutable, access-controlled
references and a digest where practical.

| Evidence ID | Claim supported | Source and immutable reference | Environment | Collected by | Collected on | Result and limits | Valid until |
| ----------- | --------------- | ------------------------------ | ----------- | ------------ | ------------ | ----------------- | ----------- |
| EV-001      | [replace]       | [reference + version/digest]   | [replace]   | [role]       | [date]       | [replace]         | [date]      |

## Approval record

Approval is never implied by authorship, merge, silence, a meeting, or a linked
artifact. Each required reviewer records an explicit decision for this version.

| Review area                            | Accountable reviewer | Decision | Date | Version/revision reviewed | Approval evidence | Conditions or expiry |
| -------------------------------------- | -------------------- | -------- | ---- | ------------------------- | ----------------- | -------------------- |
| Architecture                           | [role/name]          | Pending  | —    | [revision]                | [reference]       | [replace]            |
| Security                               | [role/name]          | Pending  | —    | [revision]                | [reference]       | [replace]            |
| Privacy                                | [role/name]          | Pending  | —    | [revision]                | [reference]       | [replace]            |
| Operations                             | [role/name]          | Pending  | —    | [revision]                | [reference]       | [replace]            |
| Business/legal/financial as applicable | [role/name]          | Pending  | —    | [revision]                | [reference]       | [replace]            |

Permitted decisions are `Approved`, `Approved with conditions`, `Rejected`, or
`Pending`. Update the ADR status to `Accepted` only after all required decisions
are recorded and open conditions have owners and due dates.

## Review and supersession

- Scheduled review date: YYYY-MM-DD
- Review triggers: material scope change, new jurisdiction, new data category,
  provider or contract change, control failure, incident, legal determination,
  cost or reliability threshold breach, or replacement technology.
- Expiry action: [return to `Draft`, renew approval, supersede, or deprecate]
- Superseding ADR: [none or reference]

## Change log

| Date   | Revision | Author | Change        | Approval impact       |
| ------ | -------- | ------ | ------------- | --------------------- |
| [date] | 0.1      | [role] | Initial draft | All approvals pending |
