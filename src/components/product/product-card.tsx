import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatGhs } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { ProductPreview } from "@/types/commerce";

interface ProductCardProps {
  product: ProductPreview;
  presentation?: "open" | "framed";
}

export function ProductCard({
  product,
  presentation = "open",
}: ProductCardProps) {
  const productHref = `/shop/${product.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col",
        presentation === "open" ? "gap-4" : "border bg-card",
      )}
    >
      <Link
        href={productHref}
        className="relative block aspect-4/5 overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 46vw, 100vw"
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.015]"
        />
      </Link>
      <div
        className={cn(
          "flex flex-1 flex-col gap-3",
          presentation === "framed" && "p-4 sm:p-5",
        )}
      >
        <Badge variant="outline">{product.status}</Badge>
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-2xl leading-none font-medium tracking-[-0.015em]">
            <Link
              href={productHref}
              className="underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring group-hover:underline"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {product.subtitle}
          </p>
        </div>
        <p className="text-sm">
          Preview price · {formatGhs(product.samplePriceGhs)}
        </p>
        <div className="mt-auto pt-1">
          {presentation === "open" ? (
            <AddToCartButton
              productId={product.id}
              productName={product.name}
            />
          ) : (
            <Link
              href={productHref}
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring group-hover:underline"
            >
              View details
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
