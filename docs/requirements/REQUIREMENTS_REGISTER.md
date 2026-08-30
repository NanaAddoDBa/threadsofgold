# Threads of Gold Requirements and Decision Register

## Register rules

This repository is public. Record only non-sensitive summaries. Never store identity documents, TINs, bank details, Mobile Money numbers, home addresses, credentials, verification codes, private WhatsApp exports, or customer information here.

Every requirement must have a source and status. Developer assumptions are not client approvals.

### Status values

| Status          | Meaning                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `DISCOVERED`    | Mentioned but not yet clarified                                         |
| `PROPOSED`      | Proposed by the developer for client review                             |
| `ASSUMED`       | Temporary assumption that must remain configurable                      |
| `CONFIRMED`     | Client explicitly confirmed the non-sensitive requirement summary       |
| `EXPERT_REVIEW` | Requires accountant, legal, privacy, payment, or other qualified review |
| `DEFERRED`      | Intentionally excluded from the current release                         |
| `REJECTED`      | Considered and explicitly not required                                  |

### Priority values

| Priority | Meaning                                               |
| -------- | ----------------------------------------------------- |
| `P0`     | Required for the initial public shop                  |
| `P1`     | Required before or shortly after general availability |
| `P2`     | Future improvement based on evidence                  |

## Confirmed project context

| ID      | Requirement summary                                                                                                                                                 | Source                                                   | Status      | Priority | Prototype treatment                                              | Production consequence                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| BUS-001 | The public brand/project name is Threads of Gold.                                                                                                                   | Project owner                                            | `CONFIRMED` | P0       | Display as working brand name                                    | Verify exact legal/trading presentation with client                                   |
| BUS-002 | Threads of Gold sells preorder fashion pieces using made-to-order or bespoke production depending on the design.                                                    | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Represent preorder, made-to-order, bespoke, and limited examples | Drives product status, production timeline, option, checkout, and policy rules        |
| BUS-003 | The business operates primarily in Ghana.                                                                                                                           | Project owner                                            | `CONFIRMED` | P0       | Use Ghana context and GHS                                        | Drives payment, tax, delivery, privacy, and hosting review                            |
| EXP-001 | The shop should feel exclusive, bold, elegant, premium, distinctive, modern, sophisticated, editorial, and clean.                                                   | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Use as the first visual-direction brief                          | Validate the implementation visually with the client                                  |
| EXP-002 | The core palette is black, cream/ivory, warm neutrals, and restrained gold accents; the design must avoid busy, childish, overly colourful, or generic styling.     | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Establish semantic brand tokens                                  | Retain as the production design-system direction after visual approval                |
| EXP-003 | The brand idea and supplied tagline are "Express your unique style," emphasizing individuality, confidence, self-expression, modern fashion, and African influence. | Client discovery and supplied logo 2026-08-13            | `CONFIRMED` | P0       | Use approved story meaning and tagline                           | Final copy may be edited without changing the approved meaning                        |
| AUD-001 | Women seeking premium, distinctive fashion are the primary audience; selected menswear serves a secondary audience.                                                 | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Use women-first editorial hierarchy with a menswear capsule      | Drives merchandising, imagery, navigation, and content balance                        |
| CAT-001 | Initial categories are dresses, tops, trousers, two-piece sets, occasion wear, and menswear; statement pieces and accessories are future additions.                 | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Use initial categories and defer future categories               | Establishes initial taxonomy while allowing controlled extension                      |
| CAT-002 | Products may expose size, colour, fabric, and selected style/design choices; some pieces may be limited or one-off.                                                 | Client discovery 2026-08-13                              | `CONFIRMED` | P0       | Demonstrate optional per-product choices                         | Requires flexible option and availability modelling                                   |
| SOC-001 | The confirmed public Instagram account is `@threads_of_gold_` at `https://www.instagram.com/threads_of_gold_/`.                                                     | Client-provided link and profile verification 2026-08-13 | `CONFIRMED` | P0       | Link the Instagram account from appropriate prototype surfaces   | Use the canonical URL without tracking query parameters                               |
| FUN-001 | The merchant can list and manage products.                                                                                                                          | Project owner                                            | `CONFIRMED` | P0       | Mock product administration                                      | Requires catalog, variant, inventory, media, and staff authorization                  |
| FUN-002 | Customers can add products to a cart.                                                                                                                               | Project owner                                            | `CONFIRMED` | P0       | Interactive mock cart                                            | Requires server-authoritative cart and pricing in production                          |
| FUN-003 | Customers can create accounts.                                                                                                                                      | Project owner                                            | `CONFIRMED` | P0       | Functional temporary email registration, sign-in, and account screens | Confirm whether accounts are optional or mandatory for purchase; replace temporary storage with the selected production identity provider |
| FUN-004 | Customers can purchase products through the shop.                                                                                                                   | Project owner                                            | `CONFIRMED` | P0       | Simulated checkout                                               | Requires confirmed product, shipping, tax, policy, and payment rules                  |
| FUN-005 | The merchant receives an order notification and fulfills the order.                                                                                                 | Project owner                                            | `CONFIRMED` | P0       | Simulated notification and fulfillment                           | Confirm recipients, channels, state flow, and staff roles                             |
| PRO-001 | The merchant can run periodic promotions.                                                                                                                           | Project owner                                            | `CONFIRMED` | P0       | Sample scheduled promotions                                      | Confirm types, stacking, dates, limits, and exclusions                                |
| PRO-002 | Eligible new users can receive a random wheel discount.                                                                                                             | Project owner                                            | `CONFIRMED` | P0       | Clearly labelled sample wheel                                    | Requires legal approval, eligibility, odds, limits, audit, and abuse controls         |
| SUP-001 | The shop should provide automated customer support.                                                                                                                 | Project owner                                            | `CONFIRMED` | P1       | Deterministic sample assistant                                   | Requires approved knowledge, evaluation, disclosure, escalation, and privacy controls |
| TEC-001 | The storefront uses Next.js, TypeScript, Tailwind CSS, and shadcn/ui.                                                                                               | Project owner                                            | `CONFIRMED` | P0       | Use selected stack                                               | Establishes frontend and design-system baseline                                       |
| TEC-002 | Reusable React UI follows Atomic Design with feature/domain boundaries.                                                                                             | Project owner                                            | `CONFIRMED` | P0       | Demonstrate reusable system                                      | Enforce package and import boundaries                                                 |
| TEC-003 | The platform uses a dedicated production backend and Terraform-managed infrastructure.                                                                              | Project owner                                            | `CONFIRMED` | P0       | Mock interfaces only initially                                   | Selected production baseline is NestJS, PostgreSQL, Redis, AWS, and Terraform         |

## Open client decisions

| ID      | Decision needed                                                                                                                           | Owner                       | Status          | Blocks                                           | Safe prototype assumption                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| DEC-001 | Whether the supplied cyan logo remains unchanged or receives an approved gold/ivory treatment                                             | Client                      | `DISCOVERED`    | Final logo system                                | Show the supplied logo unchanged in context and resolve through visual review   |
| DEC-002 | Final operational distinction, lead time, deposit, measurement, and policy rules for preorder, made-to-order, bespoke, and limited pieces | Client                      | `DISCOVERED`    | Production inventory, checkout, and policy rules | Show confirmed product types with timeline clearly marked unconfirmed           |
| DEC-003 | Final names, prices, descriptions, fabrics, options, and images for launch products                                                       | Client                      | `DISCOVERED`    | Launch catalog                                   | Use fictional typed product content and supplied images                         |
| DEC-004 | Per-product sizes, colours, fabrics, style options, measurement, alteration, and availability rules                                       | Client                      | `DISCOVERED`    | Final option and inventory model                 | Demonstrate flexible optional choices without claiming final availability       |
| DEC-005 | Guest checkout versus mandatory account                                                                                                   | Client                      | `DISCOVERED`    | Final identity and checkout flow                 | Show both options for comparison                                                |
| DEC-006 | Sign-in identifier and account contents                                                                                                   | Client                      | `DISCOVERED`    | Identity configuration                           | Demonstrate email login and common account pages                                |
| DEC-007 | Payment channels, deposits, refunds, and Paystack readiness                                                                               | Client                      | `DISCOVERED`    | Live payment and refund                          | Simulate cards and Ghana Mobile Money                                           |
| DEC-008 | Delivery regions, providers, prices, times, collection, and failures                                                                      | Client                      | `DISCOVERED`    | Shipping calculation and policy                  | Use labelled sample Ghana options                                               |
| DEC-009 | Returns, exchanges, cancellations, custom-item, and discounted-item rules                                                                 | Client and legal reviewer   | `EXPERT_REVIEW` | Policy and order state rules                     | Show policy placement without final text                                        |
| DEC-010 | Tax/VAT status, price display, invoice fields, and retention                                                                              | Client and accountant       | `EXPERT_REVIEW` | Tax calculation and receipts                     | Display sample totals only                                                      |
| DEC-011 | DPC status, privacy contact, retention, marketing consent, and international hosting                                                      | Client and privacy reviewer | `EXPERT_REVIEW` | Production personal-data processing              | Use no real personal data                                                       |
| DEC-012 | Staff roles, product/order owners, notification recipients, and refund authority                                                          | Client                      | `DISCOVERED`    | Merchant RBAC and operations                     | Demonstrate common owner and fulfillment roles                                  |
| DEC-013 | Promotion types, dates, stacking, limits, and exclusions                                                                                  | Client                      | `DISCOVERED`    | Promotion engine configuration                   | Use sample promotions                                                           |
| DEC-014 | Wheel eligibility, prizes, odds, validity, exposure, and terms                                                                            | Client and legal reviewer   | `EXPERT_REVIEW` | Real wheel activation                            | Use clearly labelled sample results                                             |
| DEC-015 | Support FAQs, languages, hours, automated-answer limits, and escalation                                                                   | Client                      | `DISCOVERED`    | AI knowledge and support workflow                | Use deterministic sample FAQs                                                   |
| DEC-016 | Domain ownership and public contact details beyond the confirmed Instagram account                                                        | Client                      | `DISCOVERED`    | Production domain and public content             | Use the confirmed tagline and Instagram link but no unconfirmed contact details |

## Requirement entry template

Copy one row for each new requirement:

| ID      | Requirement summary    | Source/date                    | Status       | Priority | Acceptance criterion       | Prototype impact          | Production impact              |
| ------- | ---------------------- | ------------------------------ | ------------ | -------- | -------------------------- | ------------------------- | ------------------------------ |
| XXX-000 | Plain-language outcome | Client confirmation YYYY-MM-DD | `DISCOVERED` | P0       | Observable/testable result | What changes in prototype | What changes in implementation |

## Decision entry template

```text
Decision ID:
Question:
Options shown to client:
Client's confirmed choice:
Non-sensitive evidence/date:
Status:
Why it matters:
Prototype impact:
Production impact:
Approver:
Review date:
```

## Change-control rule

When the client changes a confirmed requirement:

1. Preserve the old decision in Git history; do not silently rewrite its consequences.
2. Record the newly confirmed summary and date.
3. Identify affected pages, contracts, data, tests, policies, integrations, and launch scope.
4. Estimate the impact before implementing it.
5. Obtain explicit agreement when the change affects delivery time, cost, money, customer data, or legal obligations.

## Prototype sign-off record

| Area                             | Client status              | Confirmation date | Open changes                                           |
| -------------------------------- | -------------------------- | ----------------- | ------------------------------------------------------ |
| Brand brief input                | Confirmed                  | 2026-08-13        | Visual implementation still needs client review        |
| Target audience                  | Confirmed                  | 2026-08-13        | Women's product imagery is still needed                |
| Category structure               | Confirmed                  | 2026-08-13        | Final launch product list is still needed              |
| Product-type model               | Confirmed                  | 2026-08-13        | Operational preorder/bespoke rules are deferred        |
| Logo and product assets          | Received                   | 2026-08-13        | Logo master and final product details are still needed |
| Visual direction implementation  | Positive initial review    | 2026-08-28        | Final approval and requested adjustments remain open   |
| Product-page presentation        | Positive initial review    | 2026-08-28        | Final approval and requested adjustments remain open   |
| Production exclusions understood | Confirmed by project owner | 2026-08-13        | Live commerce remains outside this prototype           |

The client said she likes the current prototype so far. This is recorded as positive directional feedback, not final prototype acceptance or production authorization.

Prototype sign-off validates the product direction. It does not authorize live payments, real customer-data processing, or production launch.
