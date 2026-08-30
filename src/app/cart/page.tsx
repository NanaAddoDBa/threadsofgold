import type { Metadata } from "next";

import { CartPageClient } from "@/components/cart/cart-page-client";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Your Selection",
  description: "Review your local Threads of Gold preview cart.",
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <CartPageClient />
      </main>
      <SiteFooter />
    </>
  );
}
