# Threads of Gold: Brand and Product Prototype Requirements

Status: approved input is sufficient to begin the first visual prototype
Confirmed from client discovery: 2026-08-13
Scope: brand expression, catalog presentation, product discovery, product detail, and a visual cart
Excluded: live accounts, checkout, payments, orders, fulfillment, delivery, returns, and customer support

## Prototype objective

Create a premium, interactive customer-facing prototype that lets the client see and correct the proposed Threads of Gold brand and product experience before operational commerce rules are implemented.

The prototype is a requirements-validation artifact. Product data, prices, availability, production times, and cart totals remain clearly labelled sample content until separately confirmed.

## Confirmed brand foundation

| Area               | Confirmed direction                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Public brand       | Threads of Gold, also represented as TOG                                                         |
| Tagline            | Express your unique style                                                                        |
| Brand character    | Exclusive, bold, and elegant                                                                     |
| Positioning        | Premium and distinctive fashion that allows each customer to express their personality and style |
| Brand promise      | Individuality, confidence, and self-expression through carefully designed pieces                 |
| Inspiration        | Modern fashion, African influence, distinctive design, and personal expression                   |
| Primary audience   | Women who value premium, stylish, distinctive fashion                                            |
| Secondary audience | Men, through selected menswear pieces                                                            |
| Desired impression | Confident, unique, well put together, and fashion-house premium                                  |
| Public Instagram   | [@threads_of_gold_](https://www.instagram.com/threads_of_gold_/)                                 |

## Approved visual direction

- Modern, sophisticated, editorial, luxurious, clean, and bold.
- High-end fashion-house presentation rather than a generic ecommerce template.
- Product photography and clothing remain the visual focus.
- Generous negative space, restrained copy, strong typography, and deliberate composition.
- Black, cream/ivory, warm neutrals, and restrained gold accents form the proposed core system.
- Gold is an accent, not a large decorative fill.
- Avoid busy layouts, childish styling, excessive colour, generic shop patterns, and visual clutter.
- Mobile-first behavior is required while retaining an editorial desktop composition.
- Motion is subtle, purposeful, and disabled or reduced according to user preference.

## Brand story for prototype copy

Threads of Gold is built around the idea of expressing your unique style. The brand celebrates individuality, confidence, and self-expression through fashion influenced by modern design and African creativity. Each piece is intended to feel distinctive, considered, and personal, giving the wearer space to stand out while remaining true to themselves.

This copy may be edited for length in the interface without changing its meaning.

## Confirmed product model

### Launch categories

- Dresses
- Tops
- Trousers
- Two-piece sets
- Occasion wear
- Menswear

Statement pieces and accessories are future categories and should not dominate the initial navigation.

### Availability model

- All initial products are preorder products.
- A design may be made-to-order or bespoke depending on the piece.
- Some designs may be limited or one-off pieces to preserve exclusivity.
- The prototype must distinguish `Preorder`, `Made to order`, `Bespoke`, and `Limited piece` visually without inventing final operational rules.
- Unconfirmed production times must appear as `Timeline to be confirmed`, not as a delivery promise.

### Product choices

A product may offer:

- Size
- Colour
- Fabric
- Selected style or design variations
- Bespoke adjustment or creation where applicable

The prototype must allow different products to expose different option sets. It must not assume that every product has every option.

## Prototype information model

Each sample product supports:

- Product name
- Editorial subtitle
- Category
- Sample price in GHS
- Image gallery
- Short and long descriptions
- Preorder/made-to-order/bespoke/limited labels
- Selectable size, colour, fabric, and style options where applicable
- Material or fabric notes
- Care information
- Sample production-timeline label
- Related pieces
- Featured/new/signature merchandising labels

All sample prices and unconfirmed product facts must be held in typed content data, not embedded inside components.

## Customer-facing prototype screens

### Required

- Homepage
- Shop/catalog
- Category or collection page
- Product detail page
- Search presentation
- Category, size, colour, and product-type filters
- Visual cart drawer and cart page using local sample data
- About/brand-story section
- Mobile and desktop navigation

### Standard ecommerce behavior applied without client questions

- Responsive layouts and touch targets
- Accessible keyboard navigation and focus
- Product-card and gallery conventions
- Image optimization and responsive crops
- Loading, empty, no-results, and unavailable-option states
- Search, filtering, sorting, breadcrumbs, and related products
- SEO and social-sharing foundations
- Reduced-motion support
- Reusable components and typed content

### Explicitly excluded from this prototype

- Real registration or authentication
- Checkout and Paystack
- Personal information collection
- Real orders, notifications, fulfillment, delivery, cancellation, return, or refund logic
- Merchant order-management screens
- Customer-service or AI-support flows
- Real promotion or discount-wheel issuance
- Final legal, tax, shipping, and policy content

## Supplied assets

- One client-supplied JPEG logo containing the TOG symbol and tagline.
- Six product photographs suitable for demonstrating a menswear/statement capsule.
- Two photographs appear to show colourways of one graphic athletic top.
- Two photographs show separate black statement shirts.
- Two editorial photographs show grouped colourways from the same supplied capsule.
- The confirmed Instagram profile uses the same logo and TOG identity but currently provides no additional public product posts.

See [Prototype Asset Inventory](requirements/PROTOTYPE_ASSET_INVENTORY.md) for the file-level record.

## Content gaps that do not block the first prototype

- Final names, prices, descriptions, fabrics, sizes, colours, and production timelines for the supplied products.
- Women's product photography representing the primary audience.
- A transparent or vector logo suitable for flexible production use.
- Confirmation whether the cyan logo remains unchanged or receives an approved gold/ivory treatment.
- Selection of the homepage hero product or collection.

Use reversible sample data and clearly marked placeholders until these are supplied.

## Prototype design hypothesis

The first design direction will use:

- A black editorial header and restrained gold interaction accents.
- Ivory and warm-neutral content surfaces.
- A high-contrast fashion serif for editorial headings paired with a clean sans serif for commerce information.
- Large image-led compositions, asymmetric editorial sections, and disciplined grid alignment.
- The supplied logo unchanged in the first brand comparison so the client can see the real asset in context.
- The supplied menswear images as a compact `TOG Statement Menswear` presentation.
- Text-only category treatment for women's categories until client-owned photography is supplied; do not substitute other fashion imagery.

The logo colour conflict should be resolved through a visual comparison during review rather than an abstract WhatsApp question.

## First prototype acceptance questions

The client only needs to answer these after seeing the prototype:

1. Does this feel exclusive, bold, elegant, and recognizably Threads of Gold?
2. Does it look like a high-end fashion house rather than a generic clothing shop?
3. Does the presentation represent the intended women-first audience while leaving space for selected menswear?
4. Are the categories and preorder/made-to-order/bespoke labels represented correctly?
5. Should the supplied cyan logo remain unchanged, or should an approved gold/ivory version be developed?
6. Which collection or piece should become the homepage focus?

## Prototype completion gate

The brand/product prototype is accepted when:

- The client approves the visual direction.
- The client approves the brand-story treatment.
- The category structure matches the intended catalog.
- The product page can represent preorder, made-to-order, bespoke, and limited pieces.
- The client understands that all operational commerce behavior remains outside this prototype.
- Requested changes and remaining product-content gaps are recorded for the next iteration.
