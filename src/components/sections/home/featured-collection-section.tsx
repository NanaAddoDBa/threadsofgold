import { HeritageDivider } from "@/components/brand/heritage-divider";
import { ProductCard } from "@/components/product/product-card";
import { homeContent } from "@/content/home";
import { featuredProducts } from "@/data/products";

export function FeaturedCollectionSection() {
  return (
    <section id="collection" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-12 px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="text-balance font-heading text-5xl leading-none font-medium tracking-[-0.025em] sm:text-6xl">
              {homeContent.collection.title}
            </h2>
            <p className="max-w-lg text-pretty leading-7 text-muted-foreground">
              {homeContent.collection.description}
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground lg:justify-self-end lg:text-right">
            {homeContent.collection.note}
          </p>
        </div>

        <HeritageDivider />

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
