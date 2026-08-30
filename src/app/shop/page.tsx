import type { Metadata } from "next";

import { HeritageDivider } from "@/components/brand/heritage-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCatalogue } from "@/components/product/product-catalogue";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Discover the Threads of Gold preview collection of distinctive Ghanaian fashion pieces.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams;
  const initialCategory =
    category === "tops" || category === "menswear" ? category : "all";

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-5 sm:px-8 lg:px-12">
            <div className="flex max-w-3xl flex-col gap-5">
              <h1 className="text-balance font-heading text-6xl leading-[0.9] font-medium tracking-[-0.035em] sm:text-7xl lg:text-8xl">
                The Collection
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Distinctive pieces made for individual expression. Explore the
                current preview collection by name, category, or production
                style.
              </p>
              <div
                className="flex h-1 w-24 overflow-hidden"
                aria-label="Ghana-inspired red, gold, and green accent"
                role="img"
              >
                <span className="flex-1 bg-heritage-red" />
                <span className="flex-1 bg-accent" />
                <span className="flex-1 bg-heritage-green" />
              </div>
            </div>

            <ProductCatalogue
              products={products}
              initialCategory={initialCategory}
            />

            <div className="pt-6">
              <HeritageDivider />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
