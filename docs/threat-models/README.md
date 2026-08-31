# Threat Models

Threat models identify assets, trust boundaries, credible abuse paths, and the
controls required to reduce risk. They are living engineering records. A threat
model is not a penetration test, security certification, privacy assessment,
legal opinion, risk acceptance, or proof that a control works in production.

## Handling rules

- Never record secrets, credentials, private keys, payment details, personal
  data or other personally identifiable information (PII), real customer data,
  exploit payloads against live systems, or confidential infrastructure
  coordinates.
- Use synthetic examples. Store restricted diagrams, scan output, provider
  reports, and incident evidence in an approved access-controlled system, then
  reference the non-sensitive identifier here.
- Minimize operational detail that would materially increase exploitability.
  Review restricted findings through the security process.
- Distinguish `Planned`, `Implemented`, `Verified`, and `Accepted risk`. Code or
  configuration alone is not verification; a test pass alone is not acceptance.
- Risk acceptance must identify the authorized acceptor, scope, rationale,
  compensating controls, evidence, review date, and expiry.

## Workflow

1. Copy [TEMPLATE.md](./TEMPLATE.md) and keep it `Draft`.
2. Define the exact feature, environment, data, and external-party scope.
3. Draw or link a versioned data-flow diagram and enumerate trust boundaries.
4. Review threats with engineering, security, privacy, and operations owners.
5. Link mitigations to objective verification evidence.
6. Record residual risk decisions separately from mitigation status.
7. Review before production activation and on every listed trigger.

Name files `TM-NNN-short-scope.md`. One model may reference related models, but
must not hide ownership or unresolved risk behind another document.
