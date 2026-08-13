import Image from "next/image";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatGhs } from "@/lib/currency";
import type { ProductPreview } from "@/types/commerce";

interface ProductCardProps {
  product: ProductPreview;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden bg-card">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 46vw, 100vw"
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.015]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Badge variant="outline">{product.status}</Badge>
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-2xl leading-none font-medium">
            {product.name}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {product.subtitle}
          </p>
        </div>
        <p className="text-sm">
          Preview price · {formatGhs(product.samplePriceGhs)}
        </p>
        <div className="mt-auto pt-1">
          <AddToCartButton productId={product.id} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
