const plannedCapabilities = [
  "Catalogue and product governance",
  "Order and fulfillment operations",
  "Promotions and customer support",
  "Staff access and audit history",
] as const;

export default function AdminFoundationPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between border-b border-[var(--admin-border)] pb-6">
        <div>
          <p className="text-xs tracking-[0.28em] text-[var(--admin-gold)] uppercase">
            Threads of Gold
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Merchant workspace
          </h1>
        </div>
        <span className="rounded-full border border-[var(--admin-border)] px-3 py-1 text-xs text-[var(--admin-muted)]">
          Foundation
        </span>
      </header>

      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-sm font-medium text-[var(--admin-gold)]">
            Private operations application
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.03em] sm:text-6xl">
            A controlled home for running the fashion house.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--admin-muted)] sm:text-lg">
            This application shell establishes the merchant boundary.
            Authentication, products, orders, payments, fulfillment, and
            customer data are not connected yet.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-panel)] p-6 sm:p-8">
          <p className="text-xs tracking-[0.22em] text-[var(--admin-muted)] uppercase">
            Planned capabilities
          </p>
          <ul className="mt-6 space-y-5">
            {plannedCapabilities.map((capability, index) => (
              <li
                key={capability}
                className="flex gap-4 border-b border-[var(--admin-border)] pb-5 last:border-0 last:pb-0"
              >
                <span className="text-xs text-[var(--admin-gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6">{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
