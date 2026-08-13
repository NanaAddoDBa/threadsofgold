# Threads of Gold Prototype Scope

## Purpose

Build a coded, high-fidelity customer-facing prototype that validates the Threads of Gold brand and product presentation. The prototype shows how customers discover and explore fashion pieces; it does not process real commerce activity.

## Technical level

Use:

- Next.js App Router and TypeScript
- Tailwind CSS semantic design tokens
- Owned shadcn/ui components organized with Atomic Design
- Feature/domain boundaries outside the reusable UI layer
- Typed local brand and product fixtures
- Responsive mobile, tablet, and desktop layouts
- Accessible keyboard, focus, screen-reader, contrast, zoom, and reduced-motion foundations
- A visible prototype label and `noindex` metadata

Do not require NestJS, PostgreSQL, Redis, Cognito, Paystack, SES, n8n, or an LLM for this prototype. Future service boundaries can be represented by deterministic local interfaces.

## Included experience

### Brand

- Premium homepage
- Brand story and tagline
- Editorial category and collection presentation
- Approved black, ivory/cream, neutral, and gold design direction
- Client-supplied logo in context

### Product discovery

- Shop and collection pages
- Search presentation
- Category, size, colour, and product-type filters
- Featured, new, signature, preorder, bespoke, and limited-piece labels
- Responsive product cards
- Empty and no-results states

### Product detail

- Image gallery
- Editorial product story
- Sample GHS price
- Product status and production-timeline placeholder
- Optional size, colour, fabric, and style selectors
- Preorder, made-to-order, bespoke, and limited examples
- Material/care placeholders
- Related pieces

### Visual cart

- Local-only add, remove, quantity, and option updates
- Cart drawer and cart page
- Sample subtotal clearly labelled as prototype data
- No address, delivery, tax, checkout, or payment collection

## Excluded experience

- Live authentication or customer accounts
- Checkout, Paystack, Mobile Money, cards, or payment states
- Orders, fulfillment, delivery, tracking, cancellation, returns, or refunds
- Merchant order operations
- Email, SMS, WhatsApp, or push notifications
- Customer service or AI support
- Real discount codes or wheel prizes
- Final tax, shipping, legal, privacy, or policy rules
- Production infrastructure or customer-data processing

## Prototype milestones

### BP-1: Content and asset baseline

- Confirmed brand brief
- Confirmed product-category and product-type model
- Asset inventory
- Placeholder register

Gate: the available information is sufficient to design without inventing permanent business rules.

### BP-2: Visual direction

- Brand tokens
- Typography and colour proposal
- Core atoms, molecules, and organisms
- Homepage, collection, product, and cart visual direction
- Mobile and desktop examples

Gate: the client confirms that the direction feels like Threads of Gold.

### BP-3: Interactive catalog prototype

- Homepage-to-product journey
- Search and filters
- Product option interactions
- Local visual cart
- All agreed responsive and accessible states

Gate: the client can explore products without explanation and identifies no missing brand/product concept.

### BP-4: Brand/product baseline approval

- Requested changes incorporated
- Approved visual direction
- Approved category and product presentation
- Remaining asset and content gaps recorded

Gate: the prototype becomes the visual baseline for the later production commerce build.

## Review method

1. Send a short screen recording by WhatsApp.
2. Ask the client to open the prototype on her own phone.
3. Ask her to find a category, open a piece, choose available options, and add it to the visual cart.
4. Observe where she hesitates without first explaining the interface.
5. Ask the six acceptance questions in `docs/PROTOTYPE_REQUIREMENTS.md`.
6. Summarize approvals, changes, and placeholders in plain language.
7. Obtain written confirmation in WhatsApp.

Approval validates only the brand and product experience. It does not authorize live payments, customer-data processing, order handling, customer support, or public launch.
