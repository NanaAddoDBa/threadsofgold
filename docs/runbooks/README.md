# Operational Runbooks

Runbooks provide bounded, repeatable procedures for operating and recovering
Threads of Gold services. A runbook is not proof that staff are trained, access
works, a backup can be restored, an incident is resolved, or a control is
effective. Those claims require dated execution evidence for the stated
environment and version.

## Mandatory handling rules

- Never store passwords, tokens, API keys, private keys, recovery codes,
  connection strings, payment details, personal data or other personally
  identifiable information (PII), customer records, or private staff contact
  details in a runbook.
- Reference approved secret managers, access systems, contact directories, and
  restricted evidence stores by stable identifier. Do not copy their contents.
- Use synthetic identifiers and sanitized command output in examples.
- Procedures that can change money, orders, customer data, access, DNS,
  production infrastructure, or irreversible state must identify authorization,
  stop conditions, reconciliation, and recovery before execution.
- Never treat repository merge, a successful dry run, or an older execution as
  current production approval.

## Lifecycle and use

1. Copy [TEMPLATE.md](./TEMPLATE.md) and leave status `Draft`.
2. Use a stable ID such as `RB-ORD-001` and a task-focused filename.
3. Validate in the safest representative environment first.
4. Record dry-run and live-execution evidence outside the template when needed.
5. Obtain explicit approval from the named service, security/privacy, and
   business or operations owners required by the procedure's risk.
6. Review on schedule and after every material execution, incident, control
   change, provider change, or failed step.

Permitted document statuses are `Draft`, `In review`, `Approved`, `Deprecated`,
and `Superseded`. `Approved` applies only to the recorded revision, environment,
scope, approvers, and validity period. It does not authorize every execution;
the runbook must state whether per-execution authorization is required.
