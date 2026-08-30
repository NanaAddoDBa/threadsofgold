"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
  const { lines, totalQuantity, clearCart } = useCart();
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
            <Badge className="absolute top-0 right-0" aria-hidden="true">
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

            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} variant="drawer" />
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
            <div className="grid gap-2 sm:grid-cols-2">
              <SheetClose asChild>
                <Link
                  href="/shop"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Continue shopping
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/cart" className={buttonVariants({ size: "lg" })}>
                  Review selection
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
