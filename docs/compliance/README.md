# Compliance Evidence Records

This directory provides neutral records for compliance-related claims,
processing activities, and evidence inventory. These files support traceability;
they do not determine which law applies, provide legal advice, establish
compliance, authorize processing, or prove that a control is effective.

## Templates

- [EVIDENCE_RECORD_TEMPLATE.md](./EVIDENCE_RECORD_TEMPLATE.md) records one
  bounded claim and the artifact reviewed to support or refute it.
- [EVIDENCE_INDEX_TEMPLATE.md](./EVIDENCE_INDEX_TEMPLATE.md) inventories
  evidence without copying restricted artifacts into the repository.
- [PROCESSING_ACTIVITY_TEMPLATE.md](./PROCESSING_ACTIVITY_TEMPLATE.md) captures
  questions and accountable determinations for one processing activity. It is a
  foundation only; an unapproved copy is not a completed processing register.

## Non-negotiable handling rules

- Do not commit secrets, credentials, private keys, payment data, personal data
  or other personally identifiable information (PII), customer records, staff
  contact details, identity documents, contracts, provider reports, raw logs,
  screenshots containing personal data, or regulator correspondence.
- Use synthetic examples and access-controlled references. Record a cryptographic
  digest, immutable object/version ID, or release identifier when appropriate,
  without exposing the protected artifact.
- Evidence must identify the exact claim, source, environment, system version,
  collection method, collector, collection time, review result, limitations,
  owner, retention, review date, and expiry.
- A policy, code change, configuration file, screenshot, check result, or signed
  statement supports only the claim it actually demonstrates. It is not blanket
  compliance evidence.
- Separate evidence collection, evidence review, control ownership, legal/privacy
  determination, and approval. One person may hold multiple roles only when the
  resulting independence limitation is recorded.
- Expired, superseded, inaccessible, or failed evidence must not remain labelled
  current. Preserve history according to the approved retention decision.

## Jurisdiction boundary

Every record asks whether Ghana, Germany, the EU/EEA, or another country may be
relevant because the merchant, customers, staff, infrastructure, processors,
support access, money, or data may cross those boundaries. The template does not
decide applicability. An accountable business, legal/privacy, tax, payment, or
other qualified reviewer must record the dated conclusion and its source.

## Workflow

1. Copy the narrowest applicable template and retain status `Draft`.
2. Assign an accountable owner and stable ID before gathering evidence.
3. Define the claim and explicit non-claims before linking an artifact.
4. Minimize and redact; store restricted material only in the approved system.
5. Have the named reviewer assess relevance, integrity, result, and limits.
6. Record approval or rejection explicitly, including conditions and expiry.
7. Review on schedule and after control, system, provider, purpose, data,
   jurisdiction, incident, legal-determination, or evidence-integrity changes.

Document statuses are `Draft`, `In review`, `Approved`, `Expired`, `Superseded`,
and `Rejected`. Repository presence or merge never changes status automatically.
