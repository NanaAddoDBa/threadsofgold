# API versioning and contract policy

Status: active engineering policy

Owner: Threads of Gold engineering

Last reviewed: 2026-08-30

## Public contract

The Threads of Gold HTTP API uses a major version in the URI. Version 1 routes
begin with `/v1`. Controllers and routes declare their version through NestJS
version metadata; application code must not hard-code `v1` into controller
paths.

Additive, backward-compatible fields and operations remain in the current major
version. A new major version is required when an existing request, response,
status code, validation rule, authorization rule, or documented semantic
guarantee changes incompatibly.

Every public operation must have a stable, explicit, unique operation ID. That
ID is the generated client method contract and must not be renamed merely to
reorganize source code.

## Canonical specification

The canonical OpenAPI document is generated from the application and shared
Zod contracts. It is committed at `packages/contracts/openapi/v1.json` so
client generation and review do not depend on a running service or an external
network location.

Contract generation must be deterministic. CI regenerates the OpenAPI document
and typed client and fails when committed output is stale, missing, or contains
unexpected files. The generated document must not contain credentials, local
filesystem paths, private service addresses, environment-specific hosts, or
customer data.

The interactive Swagger UI is not a production runtime dependency. If it is
enabled for an approved non-production environment later, access controls and
data-exposure risk must be reviewed separately.

## Review rules

Contract changes require:

1. Updated runtime validation and OpenAPI schemas.
2. Regenerated typed client output.
3. Contract tests covering success and documented failure responses.
4. A compatibility assessment in the pull request.
5. A new major URI version when compatibility cannot be preserved.

Deprecation must be announced before removal, include an owner and target date,
and preserve the old version until the approved migration window closes.
