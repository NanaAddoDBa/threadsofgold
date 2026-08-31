# Local walking-skeleton runbook

Status: validated development procedure
Owner: engineering
Last reviewed: 2026-08-31

## Purpose and evidence boundary

This procedure proves one synthetic request can travel from the Next.js
storefront boundary to the NestJS API, PostgreSQL, a Redis-backed BullMQ worker,
and Mailpit. It also verifies correlation propagation and API idempotency.

The route is restricted to `local` and `test` application environments and is
disabled by default. It contains no customer, account, product, order, payment,
shipping, or fulfillment data. A successful run is not evidence of a real
commerce flow, a deployed environment, production capacity, or launch
readiness.

Delivery is intentionally at least once. The worker skips records already
marked complete, but a process failure after SMTP accepts the message and before
PostgreSQL records completion can produce a duplicate notification. A durable
transactional-outbox design belongs to the later order and notification phase;
this Phase 1 slice does not claim exactly-once delivery.

## Prerequisites

- The pinned Node.js and pnpm versions from the repository.
- Docker Desktop or a compatible Docker Engine with Compose.
- Default ports `3000`, `4000`, `4001`, `5432`, `6379`, `1025`, and `8025`
  available, or matching values configured in the local environment files.

## Prepare the local environment

From the repository root:

```text
pnpm local:setup
pnpm local:config
pnpm local:up
```

`local:setup` preserves existing environment values and generates a random
foundation verifier token when the storefront's ignored `.env.local` does not
already contain one. If an environment file existed before the walking skeleton
was added, compare it with the corresponding tracked `.env.example` and add the
other new foundation runtime values manually. Never reuse the generated token
or documented local-only credentials outside this isolated environment.

Deploy the committed database migration. In PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://threadsofgold:local-development-only@127.0.0.1:5432/threadsofgold?schema=public"
pnpm database:migrate:deploy
```

On Linux or macOS:

```bash
DATABASE_URL='postgresql://threadsofgold:local-development-only@127.0.0.1:5432/threadsofgold?schema=public' pnpm database:migrate:deploy
```

## Start the application path

Use three terminals from the repository root and leave each process running:

```text
pnpm dev:api
```

```text
pnpm dev:worker
```

```text
pnpm dev:storefront
```

The operational endpoints are:

| Process    | Liveness                            | Readiness                            | Version                         |
| ---------- | ----------------------------------- | ------------------------------------ | ------------------------------- |
| Storefront | `http://127.0.0.1:3000/health/live` | `http://127.0.0.1:3000/health/ready` | `http://127.0.0.1:3000/version` |
| API        | `http://127.0.0.1:4000/health/live` | `http://127.0.0.1:4000/health/ready` | `http://127.0.0.1:4000/version` |
| Worker     | `http://127.0.0.1:4001/health/live` | `http://127.0.0.1:4001/health/ready` | `http://127.0.0.1:4001/version` |

The API and worker readiness endpoints must report PostgreSQL and Redis as
`up`; worker readiness must also report SMTP and the queue worker as `up`.

## Exercise and verify

In a fourth terminal:

```text
pnpm foundation:verify
```

The verifier only accepts loopback HTTP origins. It creates a fresh synthetic
idempotency key and correlation ID, repeats the request to prove that one
database record is reused, polls until the worker marks it complete, and checks
Mailpit's local API for the captured request identifier.

The verifier reads the non-committed token generated in
`apps/storefront/.env.local` and sends it to both synthetic BFF routes. Requests
without that token receive the same `404` response as a disabled runtime.

A successful result reports one `idempotentRequestId`, the matching
`correlationId`, a `completed` status, at least one processing attempt, and
`notificationCaptured: true`. The captured message can also be inspected at
`http://127.0.0.1:8025`.

## Stop and recover

Stop each application process with `Ctrl+C`, then preserve PostgreSQL data while
stopping the local dependencies:

```text
pnpm local:down
```

If the verifier fails:

1. Inspect `/health/ready` for the first dependency reported `down`.
2. Run `pnpm local:status` and confirm all four dependency containers are
   healthy.
3. Confirm the migration status with the same local `DATABASE_URL` used above:
   `pnpm --filter @threadsofgold/database migrate:status`.
4. Inspect sanitized API and worker logs using the reported correlation ID.
5. Inspect Mailpit rather than forwarding or replacing the synthetic message
   with a real address.

Do not expose any dependency, health endpoint, or walking-skeleton route through
a public tunnel. Do not enable `FOUNDATION_RUNTIME_ENABLED` in development,
staging, or production; configuration validation rejects that state.
