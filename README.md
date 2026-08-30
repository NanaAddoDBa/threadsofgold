# threadsofgold

Production-grade ecommerce platform for Threads of Gold, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, a dedicated backend, automation, and Terraform.

## Current implementation

The customer-facing prototype now includes a high-fidelity homepage and product-discovery journey with:

- A responsive editorial hero and mobile navigation
- Centralized typed brand, content, navigation, and product fixtures
- A reusable product-card and homepage-section system
- A searchable, filterable, sortable shop catalogue with a no-results state
- Statically generated product-detail routes with accessible galleries, configurable options, production notes, editorial information, and related pieces
- A complete local-only cart journey with option-aware lines, quantity controls, review, transparent sample totals, and persistence
- A Ghana-aware checkout preview with accessible delivery fields, illustrative methods, native validation, and an explicit no-order confirmation state
- Functional temporary registration, sign-in, session, protected account, and sign-out journeys
- Server-side scrypt password hashing, HTTP-only same-site session cookies, origin checks, and prototype rate limits
- Radix-based shadcn/ui buttons, badges, sheets, empty states, and separators
- Responsive image optimization using only client-supplied Threads of Gold assets
- Accessible focus, labels, dialog structure, reduced motion, and `noindex` foundations

Temporary prototype accounts live only in server memory and reset whenever the local server restarts. They are not production customer accounts and do not include verification, recovery, permanent storage, or order history. The slice does not create real orders, real checkouts, or payments. Checkout details are kept only in the active page and are not persisted or transmitted.

For review, the sign-in screen provides a clearly labelled preview account. New temporary accounts can also be registered locally and used until the server restarts.

## Local development

```bash
pnpm install
pnpm dev
```

The root development command targets the storefront workspace at `http://localhost:3000`. To run that workspace explicitly:

```bash
pnpm dev:storefront
```

Each application has a committed, secret-free `.env.example`. The deployment
stage and browser origins are intentionally required so a misconfigured build
cannot silently behave like a local environment. Before running an application
locally, copy its example to `.env.local` in the same directory:

```bash
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/admin/.env.example apps/admin/.env.local
cp apps/api/.env.example apps/api/.env.local
cp apps/worker/.env.example apps/worker/.env.local
```

`.env.local` files are ignored and must never be committed. Deployed
development, staging, and production environments receive their values from the
runtime or secret manager, not from committed environment files. `APP_ENV`
describes the deployment stage without overriding framework-owned `NODE_ENV`.
Only variables prefixed with `NEXT_PUBLIC_` are permitted in browser bundles.

Quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

`pnpm check` is the local CI-equivalent gate. Shared workspace presets enforce
strict TypeScript, unused-code checks, zero-warning ESLint, accessible React
rules, and public-export-only imports between applications and packages.

## Repository structure

- `apps/storefront/src/app` — customer-facing Next.js App Router entrypoints
- `apps/storefront/src/components/layout` — site shell and navigation composition
- `apps/storefront/src/components/sections/home` — modular homepage sections
- `apps/storefront/src/app/shop` and `apps/storefront/src/components/product` — collection discovery and product-detail presentation
- `apps/storefront/src/components/cart` and `apps/storefront/src/components/checkout` — local-only cart and checkout-preview interactions
- `apps/storefront/src/app/account`, `apps/storefront/src/app/api/auth`, `apps/storefront/src/components/auth`, and `apps/storefront/src/lib/auth` — temporary functional account experience and isolated prototype identity boundary
- `apps/storefront/src/config`, `apps/storefront/src/content`, and `apps/storefront/src/data` — typed configuration and fixtures, separated from presentation
- `apps/storefront/public/images` — approved brand and product assets
- `apps/admin` — private merchant Next.js application boundary
- `apps/api` — versioned NestJS HTTP application boundary
- `apps/worker` — standalone NestJS background-processing boundary
- `packages/ui` — shared shadcn/Radix primitives, utilities, and storefront design tokens
- `packages/contracts` — runtime-validated Zod contracts and inferred API types
- `packages/config` — shared, fail-fast environment schemas with explicit application and browser boundaries
- `packages/database`, `packages/auth`, and `packages/observability` — provider-neutral platform boundaries awaiting later adapters
- `packages/eslint-config`, `packages/typescript-config`, and `packages/test-utils` — shared engineering foundations
- `pnpm-workspace.yaml` — workspace membership and dependency-linking policy
- `turbo.json` — repository task graph and cacheable build outputs

## Planning

The phased capability and feature milestone plan is documented in [Threads of Gold: Atomic Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md).

The currently confirmed client inputs and safe prototype assumptions are recorded in [Prototype Requirements](docs/PROTOTYPE_REQUIREMENTS.md).

Requirements engineering resources:

- [WhatsApp client discovery script](docs/requirements/CLIENT_DISCOVERY_WHATSAPP.md)
- [Prototype scope and review plan](docs/requirements/PROTOTYPE_SCOPE.md)
- [Prototype asset inventory](docs/requirements/PROTOTYPE_ASSET_INVENTORY.md)
- [Requirements and decision register](docs/requirements/REQUIREMENTS_REGISTER.md)
