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

Quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

## Repository structure

- `apps/storefront/src/app` — Next.js App Router entrypoints and semantic theme tokens
- `apps/storefront/src/components/ui` — owned shadcn/ui primitives
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
