import type { Metadata } from "next";

import { CheckoutPreview } from "@/components/checkout/checkout-preview";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Checkout Preview",
  description:
    "Try the local Threads of Gold checkout journey without creating an order or payment.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <CheckoutPreview />
      </main>
      <SiteFooter />
    </>
  );
}
