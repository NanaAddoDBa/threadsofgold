# Repository Policy

Status: initial engineering policy

Effective from: 2026-08-28

Applies to: Threads of Gold application, infrastructure, automation, and documentation

## Purpose

This policy keeps changes reviewable, reproducible, and safe while the prototype evolves into an operational commerce platform. Repository files define the intended controls; GitHub settings must still be configured and verified separately after the branch containing them is pushed.

## Branch and change policy

- `main` is the releasable branch and must remain deployable.
- Work is performed on short-lived, project-focused branches such as `feature/catalog-management`, `fix/cart-total-validation`, or `chore/ci-quality-gate`.
- Direct pushes to `main` are prohibited after branch protection is enabled.
- Each pull request has one primary outcome, includes its verification, and avoids unrelated refactoring.
- Commits follow Conventional Commits, for example `feat(cart): persist server-priced baskets` or `fix(auth): reject expired sessions`.
- History must remain understandable; do not squash unrelated capabilities into one change.

## Pull-request requirements

Before merge, every pull request must:

1. Use the repository pull-request template.
2. Receive approval from a code owner other than the author when a second maintainer is available.
3. Pass the `Quality` job without bypassing or weakening checks.
4. Resolve review conversations and disclose any accepted follow-up work.
5. Include migration, deployment, monitoring, and rollback notes when runtime behavior can change.
6. Exclude secrets, credentials, payment data, and real customer data.

Changes to authentication, authorization, personal-data processing, pricing, promotions, payment, webhooks, order state, Terraform, or production workflows require an explicit security and operational review before merge.

## Required GitHub settings

Configure a ruleset for `main` after this workflow is available on GitHub:

- Require a pull request before merging.
- Require at least one approval and dismiss stale approvals after new commits.
- Require review from CODEOWNERS when an eligible second maintainer exists.
- Require the `Quality` status check and require the branch to be up to date.
- Require conversation resolution.
- Block force pushes and branch deletion.
- Restrict bypass permission to a documented emergency role.

These controls are not considered active until the remote ruleset and a real pull request have been verified.

## Release policy

- Use semantic versions once the first staging release exists.
- Create releases from reviewed commits on `main`; never release an unreviewed feature branch.
- Production deployment requires an immutable build artifact, protected environment approval, release notes, and an identified rollback target.
- Database migrations must be backward compatible during deployment and use documented roll-forward recovery.
- Payment, order, and customer-data changes require staging evidence before production approval.

## Current automated gate

The initial `Quality` workflow installs from the committed lockfile and runs formatting, linting, TypeScript checks, and a production build on pull requests and pushes to `main`. Unit, integration, contract, end-to-end, infrastructure, dependency, secret, and container security jobs will be added in their roadmap packages; their absence must not be represented as completed coverage.
