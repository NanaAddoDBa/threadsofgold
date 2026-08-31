# Architecture Decision Records

Architecture decision records (ADRs) capture consequential technical decisions,
the alternatives considered, and the evidence needed to review those decisions.
They make the reasoning inspectable; they do not make an unreviewed decision
correct, approved, compliant, deployed, or effective.

## Safety and evidence boundary

- Never place passwords, tokens, private keys, connection strings, payment data,
  personal data or other personally identifiable information (PII), customer
  records, or confidential provider responses in an ADR.
- Use a stable reference to an access-controlled system when sensitive source
  material is necessary. Record only the minimum non-sensitive description.
- A link is not evidence by itself. Record what the evidence demonstrates, its
  environment, collector, collection date, immutable version or digest, and
  review outcome.
- Repository state describes intended design. Runtime, provider, legal, and
  business claims require separate current evidence from the accountable owner.
- Copying or merging an ADR does not constitute legal, privacy, security,
  financial, business, or production approval.

## Lifecycle

Use the following statuses exactly:

| Status       | Meaning                                                    |
| ------------ | ---------------------------------------------------------- |
| `Draft`      | Proposal is incomplete and must not be relied on.          |
| `In review`  | Named reviewers are evaluating the proposal and evidence.  |
| `Accepted`   | Required reviewers recorded approval for the stated scope. |
| `Rejected`   | Proposal was considered and not selected.                  |
| `Superseded` | A later ADR replaces this decision; link both records.     |
| `Deprecated` | Decision remains historical but must not guide new work.   |

`Accepted` is valid only when the approval table identifies the accountable
reviewers, decision, date, and approval evidence. Approval applies only to the
scope, environment, assumptions, and validity period recorded in the ADR.

## File convention

1. Copy [TEMPLATE.md](./TEMPLATE.md).
2. Name the file `NNNN-short-decision-title.md`, using the next sequential ID.
3. Keep the status `Draft` until all required fields and reviews are complete.
4. Link superseding and superseded records in both directions.
5. Review on the scheduled date and whenever a recorded trigger occurs.
6. Keep implementation evidence in the appropriate controlled evidence system;
   reference it from the ADR without copying sensitive content.

An ADR records one decision. Split unrelated decisions so their owners,
evidence, risks, approvals, and review schedules remain independently auditable.
