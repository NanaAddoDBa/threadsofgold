# Local dependency runbook

Status: development foundation  
Owner: engineering  
Last reviewed: 2026-08-30

## Purpose and boundary

This runbook starts the local PostgreSQL, Redis, email-capture, and
Paystack-compatible dependency fixtures used by Threads of Gold development.
The application processes continue to run directly on the host during this
phase.

The payment fixture does not contact Paystack, collect money, validate a real
merchant account, or prove a payment flow. Its token, customer address,
reference, and responses are deliberately local-only test data.

## Prerequisites

- Node.js and pnpm versions declared by the repository.
- Docker Desktop with the WSL 2 backend and Linux containers on Windows, or a
  compatible Docker Engine and Docker Compose installation.
- Ports `5432`, `6379`, `1025`, `8025`, and `8089` available on the host, unless
  alternatives are configured in `infrastructure/local/.env.local`.

## First-time setup

From the repository root, create missing local environment files:

```text
node tooling/scripts/local-platform.mjs setup
```

The command copies each tracked `.env.example` to its ignored `.env.local`
counterpart only when the target is absent. It never overwrites an existing
local file. Review `infrastructure/local/.env.local` before starting Docker.

Validate the fully resolved Compose configuration without starting containers:

```text
node tooling/scripts/local-platform.mjs config
```

## Start and inspect dependencies

Start all four dependencies and wait for their health checks:

```text
node tooling/scripts/local-platform.mjs up
```

Inspect container and health state:

```text
node tooling/scripts/local-platform.mjs status
```

The default host endpoints are:

| Dependency       | Host endpoint           | Local purpose                   |
| ---------------- | ----------------------- | ------------------------------- |
| PostgreSQL       | `127.0.0.1:5432`        | Persistent application database |
| Redis            | `127.0.0.1:6379`        | Ephemeral cache and queue state |
| Mailpit SMTP     | `127.0.0.1:1025`        | Captured outbound email         |
| Mailpit UI/API   | `http://127.0.0.1:8025` | Inspect captured email          |
| Paystack fixture | `http://127.0.0.1:8089` | Deterministic provider contract |

The default host connection values are safe only for local development:

```text
postgresql://threadsofgold:local-development-only@127.0.0.1:5432/threadsofgold
redis://:local-development-only@127.0.0.1:6379
```

If a host port is changed, application `.env.local` files must use the changed
host port. A future containerized application must instead use the Compose
service name and the container port; `127.0.0.1` inside a container refers to
that container itself.

## Verify the Paystack-compatible fixture

The success fixture requires all of the following values:

- bearer token: `local-development-only`
- email: `foundation@threadsofgold.invalid`
- amount: `12500` GHS subunits
- currency: `GHS`
- reference: `tog-local-0001`

On Windows, initialize and verify the deterministic transaction with:

```text
curl.exe --fail-with-body --request POST http://127.0.0.1:8089/transaction/initialize --header "Authorization: Bearer local-development-only" --header "Content-Type: application/json" --data-binary "@infrastructure/local/paystack/requests/transaction-initialize.json"
curl.exe --fail-with-body http://127.0.0.1:8089/transaction/verify/tog-local-0001 --header "Authorization: Bearer local-development-only"
```

On Linux or macOS, use `curl` in place of `curl.exe`. A transaction request
that does not match the documented local authorization and contract receives a
deterministic `401` response.

## Stop or reset

Stop containers while preserving the PostgreSQL named volume:

```text
node tooling/scripts/local-platform.mjs down
```

Redis and Mailpit are intentionally ephemeral. Removing their containers
discards queued jobs and captured email.

The following command is destructive: it also deletes the Compose-managed
PostgreSQL volume and all local database data. The confirmation flag is
mandatory.

```text
node tooling/scripts/local-platform.mjs reset --confirm-reset
```

Never use the reset command against a shared or production environment.

## Troubleshooting and safety

- If Docker cannot be reached, start Docker Desktop and confirm that Linux
  containers and the WSL 2 backend are available.
- On Windows, inspect port ownership with `Get-NetTCPConnection` before changing
  the ports in `infrastructure/local/.env.local`.
- Run `config` after every Compose or local dependency environment change.
- The PostgreSQL named volume survives `down`; do not change PostgreSQL major
  versions against an existing volume without a migration plan.
- The WireMock directories are mounted read-only and should remain UTF-8 with
  LF line endings.
- Do not put real provider keys, customer data, or production credentials in
  any local environment or fixture file.
- All published ports are intentionally bound to `127.0.0.1`. Never expose
  PostgreSQL, Redis, Mailpit, WireMock, or their administrative endpoints through
  a public tunnel.
