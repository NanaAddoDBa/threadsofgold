# Threads of Gold Sitemap and Navigation Contract

Status: accepted engineering baseline
Roadmap item: P3.02
Decision date: 2026-08-31
Scope: storefront, customer account, checkout handoff, support, policy, and merchant page inventory

## Purpose

This contract defines how customers and staff find pages, how stable URLs are
formed, and how catalogue search behaves. It separates routes that exist in the
current prototype from the production page inventory so navigation can evolve
without broken links or accidental exposure of unfinished features.

The contract does not approve product facts, payment activation, customer-data
processing, order handling, or live infrastructure. AWS execution is deferred;
none of the decisions below require an AWS account.

## Experience principles

- Keep the clothing, photography, and editorial story visually dominant.
- Use a shallow, predictable information architecture suitable for mobile
  customers and slower connections.
- Make the complete collection reachable within one action from every public
  page.
- Keep search, account, and cart available as utility actions rather than
  competing with the primary editorial navigation.
- Do not publish links to unfinished, unauthorized, empty, or staff-only pages.
- Preserve a usable browser history and shareable URLs for catalogue discovery.
- Use ordinary ecommerce language; implementation or provider terminology must
  not appear in customer navigation.

## Sitemap

```text
Storefront
|-- Home
|   |-- Featured collection
|   `-- The House brand-story section
|-- Shop
|   |-- Search and filters
|   |-- Curated collection
|   `-- Product detail
|-- Cart
|   `-- Hosted checkout handoff
|       |-- Payment return
|       `-- Order confirmation
|-- Account
|   |-- Sign in, register, verify, and recover
|   |-- Profile and addresses
|   |-- Orders and order detail
|   `-- Privacy requests and communication preferences
|-- Support
|   |-- Help centre and contact
|   |-- Size and care guidance
|   `-- Authenticated order support
`-- Policies
    |-- Privacy
    |-- Terms
    |-- Delivery
    |-- Returns and cancellations
    `-- Promotion terms

Merchant application (separate authenticated application)
|-- Overview
|-- Products and collections
|-- Inventory
|-- Orders and refunds
|-- Promotions and wheel configuration
|-- Customers and support
|-- Content
`-- Settings and audit activity
```

## Navigation model

### Public header

The current prototype exposes only implemented destinations:

1. `Shop` — complete product-discovery surface.
2. `The House` — brand story on the homepage.
3. Account utility — account home for an authenticated prototype user,
   otherwise sign in.
4. Cart utility — opens the cart drawer and links to the cart page.
5. Instagram — the confirmed external brand account.

The production header may add `Women`, `Occasion`, and `Menswear` only when each
destination has confirmed, published products. These entries resolve to
curated collections or predefined shop filters; they must not create a second
catalogue hierarchy.

Desktop displays the primary links inline. Mobile uses the same ordered source
inside a drawer, followed by account and Instagram actions. Menu labels,
destinations, and ordering must come from typed configuration rather than being
duplicated by viewport.

### Utility behavior

- The logo always returns to the homepage.
- Search opens or focuses product discovery and retains the current query in the
  URL.
- Account labels communicate whether the customer is signed in without exposing
  private information in the page URL.
- Cart exposes the current quantity with a text alternative and remains usable
  by keyboard and touch.
- The initial currency is GHS. A currency selector is not shown until the
  business supports another settlement or display currency.

### Breadcrumbs

Breadcrumbs appear on shop descendants, cart, checkout handoff, account
descendants, support articles, and policy pages. The final item is text, not a
self-link. Product breadcrumbs follow:

```text
Shop > Primary collection or category > Product
```

Breadcrumbs support orientation; they do not replace the primary navigation.

### Footer

The production footer groups links under `Shop`, `The House`, `Help`, and
`Policies`, followed by confirmed social links and business information. Public
contact, address, legal-name, and policy links stay unpublished until their
content is approved. Staff administration is never linked from the storefront
footer.

## URL contract

### General rules

- Use lowercase, human-readable, kebab-case paths.
- Use plural nouns for resource collections and stable slugs for public detail
  pages.
- Do not expose database identifiers, sequential customer or order identifiers,
  email addresses, names, tokens, secrets, or other personal data in URLs.
- SEO canonical metadata omits default filter values, tracking parameters,
  fragments, and trailing slashes. In-page navigation may use an approved stable
  fragment such as `#the-house`.
- Changed product or collection slugs require a permanent redirect from the old
  URL; published URLs must not silently become unrelated content.
- Unknown or unpublished public resources return `404`; authenticated resources
  use an authorization-safe response that does not reveal another customer's
  data.
- Preview-only routes remain `noindex`. Production canonical and sitemap entries
  include only published, customer-safe pages.

### Catalogue query parameters

`/shop` is the canonical search and filter surface. The table below defines the
production query contract:

| Parameter     | Shape                           | Meaning                                       |
| ------------- | ------------------------------- | --------------------------------------------- |
| `q`           | one normalized string           | Product and collection search                 |
| `category`    | repeated kebab-case values      | Dresses, tops, trousers, sets, occasion, etc. |
| `size`        | repeated normalized values      | Available size options                        |
| `colour`      | repeated stable colour slugs    | Available colour families                     |
| `productType` | repeated stable values          | Preorder, made-to-order, bespoke, or limited  |
| `sort`        | one allowlisted value           | Featured, newest, price, or name ordering     |
| `page`        | positive integer greater than 1 | Paginated result page                         |

Repeated filters use repeated parameters, for example:

```text
/shop?category=tops&colour=gold&colour=black&size=m&sort=newest
```

The current prototype accepts one optional `category` value and supports only
`tops` and `menswear`, matching its client-supplied product set. Its text query,
category control, and sort control otherwise remain local React state; their
state is not yet shareable or restored by browser history. P5 implements the
server-backed catalogue and the complete production query contract.

The production application normalizes parameter order for canonical links,
removes empty or unknown values, resets `page` when the search or filter set
changes, and restores discovery state through browser back and forward.

### Page-route inventory

| Experience                      | Canonical route                          | Current status        | Owning roadmap phase |
| ------------------------------- | ---------------------------------------- | --------------------- | -------------------- |
| Home                            | `/`                                      | Prototype implemented | P3                   |
| Shop, search, filters, and sort | `/shop`                                  | Prototype implemented | P3/P5                |
| Curated collection              | `/collections/[slug]`                    | Planned               | P5                   |
| Product detail                  | `/shop/[slug]`                           | Prototype implemented | P3/P5                |
| Cart                            | `/cart`                                  | Local prototype       | P6                   |
| Checkout handoff                | `/checkout`                              | Preview only          | P7                   |
| Payment return                  | `/checkout/return`                       | Planned               | P7                   |
| Order confirmation              | `/orders/confirmation/[publicReference]` | Planned               | P7/P8                |
| Sign in                         | `/account/sign-in`                       | Temporary prototype   | P4                   |
| Registration                    | `/account/register`                      | Temporary prototype   | P4                   |
| Verification                    | `/account/verify`                        | Planned               | P4                   |
| Recovery                        | `/account/recover`                       | Planned               | P4                   |
| Account overview                | `/account`                               | Temporary prototype   | P4                   |
| Customer orders                 | `/account/orders`                        | Planned               | P8                   |
| Customer order detail           | `/account/orders/[publicReference]`      | Planned               | P8                   |
| Addresses                       | `/account/addresses`                     | Planned               | P4                   |
| Profile and preferences         | `/account/profile`                       | Planned               | P4                   |
| Privacy requests                | `/account/privacy`                       | Planned               | P4                   |
| Help centre                     | `/support`                               | Planned               | P10                  |
| Support article                 | `/support/[slug]`                        | Planned               | P10                  |
| Authenticated order support     | `/account/support/[publicReference]`     | Planned               | P10                  |
| Brand story                     | `/#the-house`                            | Prototype implemented | P3                   |
| Privacy policy                  | `/policies/privacy`                      | Awaiting approval     | P0/P3                |
| Terms                           | `/policies/terms`                        | Awaiting approval     | P0/P3                |
| Delivery policy                 | `/policies/delivery`                     | Awaiting approval     | P0/P3/P6             |
| Returns and cancellations       | `/policies/returns`                      | Awaiting approval     | P0/P3/P8             |
| Promotion terms                 | `/policies/promotions`                   | Awaiting approval     | P0/P3/P9             |

The merchant application uses a separate authenticated origin in production.
Its internal paths are `/`, `/products`, `/collections`, `/inventory`,
`/orders`, `/promotions`, `/customers`, `/support`, `/content`, `/settings`, and
`/audit`. Route visibility never substitutes for server-side authorization.

## Search behavior

### Prototype behavior

- Search operates only over the typed local product preview data.
- Matching is case-insensitive across product name, subtitle, category, and
  product type.
- Category and sort controls combine with the text query.
- The result count is announced through a polite live region.
- Reset clears the query, filters, and sort without reloading the page.
- No-result state explains recovery and provides a one-action reset.

The existing prototype does not claim production indexing, ranking, spelling
correction, stock awareness, analytics, or persistence.

### Production behavior

- Search is executed by the catalogue service over published and currently
  customer-visible records only.
- Input is trimmed, Unicode-normalized, length-limited, and treated as data,
  never as executable query syntax.
- The server validates every filter and sort value and returns deterministic
  pagination.
- Ranking starts with exact name, collection, category, and prefix relevance;
  popularity or personalization is introduced only with measured evidence and
  appropriate consent.
- Availability may annotate or filter results but must not hide preorder or
  made-to-order products whose publication rules allow purchase.
- Empty, loading, error, offline, and partial-result states are distinct.
- Search failures preserve the query and offer retry; they never fall back to
  invented or unlabelled product data.
- Search analytics exclude raw personal data and honor the approved analytics
  and consent policy.

## Page-state contract

Every planned page records and implements the applicable states before release:

- loading and progressive image loading;
- empty or no-results;
- validation error;
- service error with a safe retry;
- offline or interrupted connection;
- unauthorized or expired session;
- unpublished, unavailable, or sold-out product;
- maintenance without exposing internal details.

Focus moves to the page heading or error summary after a meaningful navigation
or failed submission. Status is not communicated through colour alone, touch
targets meet the project accessibility baseline, and reduced-motion preferences
are respected.

## Implementation boundary

The implemented prototype routes, supported category paths, parser, and primary
navigation are centralized in `apps/storefront/src/config/routes.ts`.
Components consume this source instead of duplicating path strings. Planned
routes and query behaviors remain in this document until their owning roadmap
slice implements them; adding a page to this inventory must not create a public
link prematurely.

P3.02 is complete when this definition, the typed configuration for currently
implemented routes, and the existing home-to-shop-to-product-to-cart navigation
pass formatting, linting, type checking, build, unit tests, and focused desktop
and mobile browser journeys. Each planned route, filter, history behavior, and
page state requires its own implementation and automated evidence in its owning
slice. The P3.02 status does not claim those future behaviors, complete P3.01,
or complete any later page implementation.
