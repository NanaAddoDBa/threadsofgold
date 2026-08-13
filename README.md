# threadsofgold

Production-grade ecommerce platform for Threads of Gold, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, a dedicated backend, automation, and Terraform.

## Current implementation

The first customer-facing vertical slice is a high-fidelity homepage prototype with:

- A responsive editorial hero and mobile navigation
- Centralized typed brand, content, navigation, and product fixtures
- A reusable product-card and homepage-section system
- A local-only preview cart with quantity, removal, subtotal, and persistence
- Radix-based shadcn/ui buttons, badges, sheets, empty states, and separators
- Responsive image optimization using only client-supplied Threads of Gold assets
- Accessible focus, labels, dialog structure, reduced motion, and `noindex` foundations

This slice does not create customer accounts, orders, checkouts, or payments.

## Local development

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Frontend structure

- `src/app` — Next.js App Router entrypoints and semantic theme tokens
- `src/components/ui` — owned shadcn/ui primitives
- `src/components/layout` — site shell and navigation composition
- `src/components/sections/home` — modular homepage sections
- `src/components/product` and `src/components/cart` — commerce-domain presentation and local interactions
- `src/config`, `src/content`, and `src/data` — typed configuration and fixtures, separated from presentation
- `public/images` — approved brand and product assets

## Planning

The phased capability and feature milestone plan is documented in [Threads of Gold: Atomic Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md).

The currently confirmed client inputs and safe prototype assumptions are recorded in [Prototype Requirements](docs/PROTOTYPE_REQUIREMENTS.md).

Requirements engineering resources:

- [WhatsApp client discovery script](docs/requirements/CLIENT_DISCOVERY_WHATSAPP.md)
- [Prototype scope and review plan](docs/requirements/PROTOTYPE_SCOPE.md)
- [Prototype asset inventory](docs/requirements/PROTOTYPE_ASSET_INVENTORY.md)
- [Requirements and decision register](docs/requirements/REQUIREMENTS_REGISTER.md)
