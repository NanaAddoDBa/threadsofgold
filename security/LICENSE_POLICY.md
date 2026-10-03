# Production dependency license policy

Run `pnpm licenses:check` after a frozen workspace install. The Security workflow
runs the same check. `license-policy.json` is the policy source; the checker reads
`pnpm licenses list --prod --json` from the repository root on Windows and Linux.

`--prod` selects application runtime dependencies. The check also runs during
development; it does not mean the website has been deployed to production.

This is a dependency review gate. It neither licenses the Threads of Gold source
code and product images nor grants production legal approval.

## Enforcement

- A license expression must exactly match `allowedLicenses`. Allowing one part
  does not allow an entire combined expression.
- Expressions containing a denied fragment fail unless a matching, active,
  package-specific exception covers them. Other unknown expressions also fail.
- An exception requires an owner, reason, compensating control, explicit
  `temporary-engineering-review` approval, scoped package patterns, and a valid
  expiry date. An initial unrestricted wildcard is rejected.
- An exception remains valid through its expiry date in UTC. The following day
  it stops covering packages. The checker never renews exceptions automatically.
- Empty or malformed inventories and malformed policy records fail closed.

The JSON report includes the review date, inspected package-version count,
active and expired exceptions, owners, expiry dates, and package versions for
each failure. `expired-exception` distinguishes an overdue review from a newly
introduced dependency with `no-approved-exception`. Active exceptions remain
visible even if another package with the same license fails. A warning appears
on stderr during the final seven days of a matching active exception.

## Review recorded on 3 October 2026

The previous exceptions expired on 30 September 2026. The failed Linux job on
[pull request #8](https://github.com/NanaAddoDBa/threadsofgold/pull/8) reports
`@img/sharp-libvips-linux-x64`, `@img/sharp-libvips-linuxmusl-x64`, and `elkjs`.
The local Windows inventory reports `@img/sharp-win32-x64@0.35.5` and
`elkjs@0.11.1`. Optional native dependencies produce different platform
inventories, so a Windows pass alone does not prove the Linux policy passes.

| Dependency             | License expression reported by pnpm | Review boundary                                                                      |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `elkjs`                | `EPL-2.0`                           | Prisma Studio tooling; inspect deployed contents before asserting runtime exclusion. |
| `@img/sharp-win32-x64` | `Apache-2.0 AND LGPL-3.0-or-later`  | Native Sharp image-processing package on Windows.                                    |
| `@img/sharp-libvips-*` | `LGPL-3.0-or-later`                 | Native image-processing libraries in the Linux dependency graph.                     |

The Dockerfile separates build tooling from runtime stages, but source dependency
classification is not proof of the contents of a released container. Review the
final image SBOMs and relevant upstream notices before release.

### Approved engineering renewal

On 3 October 2026, NanaAddoDBA approved renewing all three existing exceptions
through **31 October 2026 (UTC)** for continued development and testing. This
decision retains the existing package patterns, license expressions, owners,
compensating controls, and denied-license rules. No license was added to the
global allowlist. The renewal is recorded in commit `48f7728`.

The project remains pre-production. This temporary engineering decision does
not grant production license approval. The exceptions stop covering packages on
1 November 2026 unless a further review authorizes renewal or the dependencies
are replaced.

## Resolving an expired exception

1. Confirm the dependency path, installed versions, platform, and whether the
   package ships in the final artifact. Do not infer absence from `devDependencies`
   alone when peer dependencies can make tooling reachable.
2. The owner chooses a narrowly scoped, time-limited engineering renewal or a
   dependency replacement. Record the decision and date in this document, then
   update the matching policy records. Do not broaden the global allowlist just
   to clear a failing check.
3. Run `pnpm test:unit` and `pnpm licenses:check`, then verify the Linux CI result.
   A renewal is temporary engineering acceptance; retain the production license
   review, notices, and artifact checks described in the exception controls.

There is no implemented production deployment gate that independently enforces
legal sign-off; production approval remains an explicit release prerequisite.
