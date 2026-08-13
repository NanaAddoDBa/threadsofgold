# Client Discovery Through WhatsApp

## Purpose

Use this script to discover what the client actually needs before finalizing the Threads of Gold prototype and production rules. The client should never need to understand software terminology.

Do not send every question at once. Send one short batch, wait for the answers, summarize what you understood, and ask the client to confirm the summary before moving to the next batch.

## Communication rules

- Ask four to six questions per batch.
- Offer simple choices and allow the client to answer with letters, voice notes, photographs, or examples.
- Use product and customer language instead of words such as schema, authentication, API, variant, RBAC, or infrastructure.
- Show an example when a question could be interpreted in different ways.
- Record uncertain answers as assumptions, not decisions.
- Repeat important decisions in plain language and ask for “Yes, that is correct.”
- Do not request identity documents, bank details, passwords, payment credentials, or verification codes through WhatsApp.
- Do not store private client information in this public GitHub repository.

## Opening message

Copy, personalize, and send:

> Hi [Name], I am preparing the first version of the Threads of Gold online shop. Before I design it, I want to understand how you sell your clothes and how you want customers to experience the shop. I will send a few short questions at a time, using normal business language. You can answer with text, a voice note, photos, or examples from shops you like. I will first make a visual working prototype with sample products so you can see and correct it before we connect real payments or customer information.

## Batch 1: Brand and customers

> 1. What exact name should appear at the top of the website?
>
> 2. In one or two sentences, what makes your fashion brand special?
>
> 3. Who normally buys your clothing? For example: women, men, children, wedding clients, professionals, students, or everyone.
>
> 4. Which three words should describe the website? For example: luxurious, elegant, bold, modern, traditional, minimal, colourful, youthful.
>
> 5. Do you already have a logo, brand colours, product photos, Instagram page, or another shop whose style you like? You can send the public links or non-sensitive images.

After the answer, send a summary such as:

> My understanding is that Threads of Gold serves [customer group] and should feel [three words]. The main brand colours are [colours], and I should use [logo/photo/reference]. Is that correct?

## Batch 2: What she sells

> 1. Which best describes what you sell?
>    A. Clothes already made and ready to deliver
>    B. Clothes made only after the customer orders
>    C. Clothes made to the customer's measurements
>    D. A mixture of these
>
> 2. What types of clothing should be in the first version? For example: dresses, shirts, trousers, two-piece sets, bridal wear, accessories.
>
> 3. Can one design have different sizes, colours, or materials? Please give one real example.
>
> 4. Do you keep a number of each item in stock, or is each design made when someone orders it?
>
> 5. For made-to-order clothing, how long does production normally take?
>
> 6. Does the customer ever need to provide measurements or request alterations?

Confirmation summary:

> I will design the product section to support [ready-made/made-to-order/custom] clothing. A product can have [sizes/colours/materials], and [stock/production time/measurements] will be shown in this way: [summary]. Is that correct?

## Batch 3: How customers should shop

> 1. Should a customer be able to buy without creating an account, or must everyone create an account first?
>    A. Buy without an account, with an option to create one
>    B. Everyone must create an account before buying
>
> 2. Should customers use email, phone number, or either one to sign in?
>
> 3. What should customers be able to see in their account? For example: previous orders, delivery status, saved address, measurements, favourites.
>
> 4. Which payment methods should customers see? For example: MTN Mobile Money, Telecel Cash, ATMoney, Visa, Mastercard, or payment on delivery.
>
> 5. Should customers be able to contact you through WhatsApp from the website before buying?

Explain the recommendation if needed:

> My recommendation is to allow customers to buy without creating an account because it is faster, while still giving them the option to create an account and see their orders. I can also require an account if that is important to your business.

## Batch 4: Delivery, collection, returns, and cancellations

> 1. From which town or area will orders normally be sent?
>
> 2. Where will you deliver in the first version?
>    A. Accra only
>    B. All regions in Ghana
>    C. Ghana and selected countries
>
> 3. Which delivery company or method do you use, and how is the delivery price normally calculated?
>
> 4. Can customers collect their orders from a location? If yes, which general location should be displayed?
>
> 5. How many days should delivery normally take for ready-made clothing and for made-to-order clothing?
>
> 6. When can a customer return, exchange, or cancel an order? Are custom-made or discounted items treated differently?

Do not write final policy text from an uncertain voice note. Summarize the intended rule, identify unanswered cases, and obtain later legal/business approval.

## Batch 5: What happens after an order

> 1. Who should receive a message when a customer pays for an order?
>
> 2. How should that message arrive?
>    A. Email
>    B. WhatsApp or SMS
>    C. Both
>
> 3. Who will update products, prices, photos, and available quantities?
>
> 4. What steps do you normally follow after receiving an order? For example: confirm payment, prepare item, package, send, mark delivered.
>
> 5. Who is allowed to cancel an order or approve a refund?
>
> 6. Which information would be most useful on your shop dashboard every day?

Confirmation summary:

> The shop dashboard will help [roles] manage [products/orders/stock]. After payment, the order should move through [steps], and [person/role] may approve cancellations or refunds. Notifications should go through [channels]. Is that correct?

## Batch 6: Sales, promotions, and discount wheel

> 1. Which promotions do you want to run? For example: percentage discount, money off, free delivery, selected-item sale, or seasonal sale.
>
> 2. Should promotions have a start and end date automatically?
>
> 3. For the new-customer wheel, what prizes should be possible? For example: 5% off, 10% off, free delivery, or no prize.
>
> 4. Should each new customer receive only one spin?
>
> 5. How long should a wheel discount remain valid?
>
> 6. Should customers be able to combine a wheel discount with another sale?

Explain that prize probability, maximum discount exposure, eligibility, and terms require explicit written approval before the wheel becomes real. The prototype may use clearly labelled sample outcomes.

## Batch 7: Customer support and automated assistant

> 1. What questions do customers ask you most often?
>
> 2. Which answers should the website give automatically? For example: delivery areas, production time, size help, care instructions, or return process.
>
> 3. Which questions should always be sent to you or another person?
>
> 4. Should support be in English only, or also another language?
>
> 5. What are your normal support hours and preferred contact method?
>
> 6. Is it acceptable for the website to clearly say that the first answer comes from an automated assistant?

The automated assistant must not promise refunds, change orders, guarantee delivery dates, or disclose private order information without deterministic authorization.

## Batch 8: Business readiness

Use yes/no/status questions. Do not request the underlying documents in WhatsApp.

> To prepare the secure payment and legal parts later, please tell me only whether each item is available. Please do not send bank details, passwords, identity documents, or verification codes here.
>
> 1. Is Threads of Gold operating as an individual business, sole proprietorship, or registered company?
>
> 2. Does the business have a tax identification number?
>
> 3. Is the business currently registered for VAT, not registered, or awaiting advice from an accountant?
>
> 4. Does the business already have an activated Paystack account?
>
> 5. Is the business registered with Ghana's Data Protection Commission?
>
> 6. Is there a business bank or Mobile Money account that will receive shop payments?
>
> 7. Who should approve the final privacy, returns, delivery, promotion, and shop terms?

Any “I do not know” answer becomes an open decision owned by the client, accountant, lawyer, Paystack, or relevant authority. It must not be guessed by engineering.

## Final prototype confirmation message

> Thank you. I will now prepare a working prototype using sample products and test information. It will show the home page, products, product details, cart, account experience, sample checkout, order confirmation, your management area, promotions, and the support experience. It will not take real payments or collect real customer information. After you review it, I will send a short list of what I understood, what you approved, and what still needs a decision before the real shop can launch.

## Evidence handling

For each confirmed answer, add a non-sensitive summary to the requirements register with:

- Requirement or decision ID
- Date confirmed
- Neutral summary
- Status
- Prototype impact
- Production impact

Do not commit WhatsApp exports, screenshots containing personal data, identity records, bank information, phone numbers, home addresses, credentials, or private customer information.
