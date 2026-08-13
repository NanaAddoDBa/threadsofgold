"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatGhs } from "@/lib/currency";

export function CartSheet() {
  const {
    lines,
    totalQuantity,
    addProduct,
    decreaseProduct,
    removeProduct,
    clearCart,
  } = useCart();
  const subtotal = lines.reduce(
    (total, line) => total + line.product.samplePriceGhs * line.quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open preview cart">
          <ShoppingBagIcon data-icon="inline-start" />
          {totalQuantity > 0 ? (
            <Badge className="absolute -top-1 -right-1" aria-hidden="true">
              {totalQuantity}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="data-[side=right]:w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Preview cart</SheetTitle>
          <SheetDescription>
            Local prototype items only. No checkout, order, or payment will be
            created.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBagIcon />
              </EmptyMedia>
              <EmptyTitle>Your preview cart is empty</EmptyTitle>
              <EmptyDescription>
                Add a statement piece to see how the future cart experience can
                feel.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"}
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </div>

            {lines.map(({ product, quantity }) => (
              <article key={product.id} className="flex gap-4">
                <div className="relative aspect-4/5 w-24 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={product.image.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-heading text-lg leading-none">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Preview price · {formatGhs(product.samplePriceGhs)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-2"
                      aria-label="Quantity"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Decrease ${product.name} quantity`}
                        onClick={() => decreaseProduct(product.id)}
                      >
                        <MinusIcon data-icon="inline-start" />
                      </Button>
                      <span
                        className="min-w-5 text-center text-sm"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => addProduct(product.id)}
                      >
                        <PlusIcon data-icon="inline-start" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {lines.length > 0 ? (
          <SheetFooter>
            <Separator />
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Sample subtotal
                </span>
                <strong className="font-heading text-2xl font-medium">
                  {formatGhs(subtotal)}
                </strong>
              </div>
              <span className="max-w-40 text-right text-xs text-muted-foreground">
                Illustrative only. Delivery and taxes are not calculated.
              </span>
            </div>
            <SheetClose asChild>
              <Button size="lg">Continue exploring</Button>
            </SheetClose>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
