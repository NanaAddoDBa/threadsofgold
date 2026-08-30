## Summary

Describe the customer, merchant, or engineering outcome delivered by this change.

## Scope

- [ ] The change has one primary outcome and is small enough to review safely.
- [ ] Related requirements, decisions, or documentation have been updated.
- [ ] Unrelated refactoring has been left for a separate change.

## Verification

- [ ] `pnpm check` passes locally.
- [ ] New or changed behavior has appropriate automated coverage.
- [ ] Responsive and keyboard behavior has been checked when UI changed.
- [ ] Screenshots or recordings are attached when presentation changed.

## Commerce and data safety

- [ ] No secrets, credentials, real customer data, or payment data are included.
- [ ] Pricing, stock, discounts, tax, shipping, and order totals remain server-authoritative where applicable.
- [ ] Authentication, payment, webhook, or personal-data changes include a focused security review.
- [ ] Schema or infrastructure changes include migration, rollback, and operational notes.

## Release notes

State any deployment ordering, configuration, migration, monitoring, or rollback requirements. Write `None` when there are none.
