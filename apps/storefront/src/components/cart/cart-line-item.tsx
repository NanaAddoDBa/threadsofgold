"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@threadsofgold/ui/components/button";
import { productRoute } from "@/config/routes";
import { formatGhs } from "@/lib/currency";
import { cn } from "@threadsofgold/ui/lib/utils";
import type { CartLine } from "@/types/commerce";

interface CartLineItemProps {
  line: CartLine;
  variant?: "drawer" | "page";
}

export function CartLineItem({ line, variant = "page" }: CartLineItemProps) {
  const { addProduct, decreaseProduct, removeProduct } = useCart();
  const { id, product, selections, quantity } = line;
  const isDrawer = variant === "drawer";

  return (
    <article
      className={cn(
        "flex min-w-0 gap-4",
        !isDrawer &&
          "flex-col border-b pb-8 min-[420px]:flex-row sm:gap-6 sm:pb-10",
      )}
    >
      <Link
        href={productRoute(product.slug)}
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isDrawer
            ? "aspect-4/5 w-24"
            : "aspect-4/5 w-full min-[420px]:w-28 sm:w-40",
        )}
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image.src}
          alt=""
          fill
          sizes={isDrawer ? "96px" : "(min-width: 640px) 160px, 112px"}
          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div
          className={cn(
            "flex min-w-0 gap-3",
            isDrawer ? "flex-col" : "flex-col sm:flex-row sm:justify-between",
          )}
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2
              className={cn(
                "font-heading leading-none font-medium",
                isDrawer ? "text-lg" : "text-2xl wrap-break-word sm:text-3xl",
              )}
            >
              <Link
                href={productRoute(product.slug)}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {product.name}
              </Link>
            </h2>
            {!isDrawer ? (
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {product.subtitle}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Preview price · {formatGhs(product.samplePriceGhs)}
            </p>
            {Object.keys(selections).length > 0 ? (
              <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {Object.entries(selections).map(([label, value]) => (
                  <div key={label} className="flex gap-1">
                    <dt>{label}:</dt>
                    <dd className="text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {!isDrawer ? (
            <p className="font-heading text-2xl font-medium sm:text-right">
              {formatGhs(product.samplePriceGhs * quantity)}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center" aria-label="Quantity">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-r-none"
              aria-label={`Decrease ${product.name} quantity`}
              onClick={() => decreaseProduct(id)}
            >
              <MinusIcon data-icon="inline-start" />
            </Button>
            <span
              className="flex h-7 min-w-10 items-center justify-center border-y px-2 text-center text-sm"
              aria-live="polite"
              aria-label={`${quantity} selected`}
            >
              {quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-l-none"
              aria-label={`Increase ${product.name} quantity`}
              onClick={() => addProduct(product.id, selections)}
              disabled={quantity >= 20}
            >
              <PlusIcon data-icon="inline-start" />
            </Button>
          </div>

          <Button
            type="button"
            variant={isDrawer ? "ghost" : "link"}
            size={isDrawer ? "icon-sm" : "sm"}
            aria-label={`Remove ${product.name}`}
            onClick={() => removeProduct(id)}
          >
            {isDrawer ? <Trash2Icon data-icon="inline-start" /> : "Remove"}
          </Button>
        </div>
      </div>
    </article>
  );
}
