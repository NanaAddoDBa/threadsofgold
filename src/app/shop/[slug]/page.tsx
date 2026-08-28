import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInformation } from "@/components/product/product-information";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getProductBySlug, products } from "@/data/products";
import { formatGhs } from "@/lib/currency";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Piece not found" };
  }

  return {
    title: product.name,
    description: product.subtitle,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="py-8 sm:py-10 lg:py-14">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-5 sm:px-8 lg:px-12">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/shop">Shop</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/shop?category=${product.category.toLowerCase()}`}
                    >
                      {product.category}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
              <div className="lg:sticky lg:top-36 lg:self-start">
                <ProductGallery
                  images={product.gallery}
                  productName={product.name}
                />
              </div>

              <div className="flex flex-col gap-8 lg:py-4">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-balance font-heading text-5xl leading-[0.92] font-medium tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                      {product.name}
                    </h1>
                    <p className="max-w-xl text-pretty leading-7 text-muted-foreground">
                      {product.subtitle}
                    </p>
                  </div>
                  <Badge variant="outline">{product.status}</Badge>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Preview price
                    </span>
                    <strong className="font-heading text-4xl font-medium">
                      {formatGhs(product.samplePriceGhs)}
                    </strong>
                  </div>
                </div>

                <ProductPurchasePanel product={product} />

                <ProductInformation sections={product.information} />

                <Button asChild variant="outline" size="lg">
                  <Link href="/shop">Back to collection</Link>
                </Button>
              </div>
            </div>

            <ul className="grid border-y md:grid-cols-3">
              {product.details.map((detail) => (
                <li
                  key={detail}
                  className="flex min-h-20 items-center gap-3 border-b px-4 py-5 text-sm last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
                >
                  <span
                    className="size-2 rotate-45 border border-accent"
                    aria-hidden="true"
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t bg-secondary py-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-5 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-4xl font-medium tracking-[-0.025em] sm:text-5xl">
                  Continue exploring
                </h2>
                <p className="text-sm text-muted-foreground">
                  More pieces from the current preview collection.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-sm underline underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                View all pieces
              </Link>
            </div>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
