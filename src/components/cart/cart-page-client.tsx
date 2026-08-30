"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart } from "@/components/cart/cart-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function CartPageClient() {
  const { lines, totalQuantity, clearCart } = useCart();

  return (
    <section className="py-10 sm:py-14 lg:py-16">
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
              <BreadcrumbPage>Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {lines.length === 0 ? (
          <Empty className="min-h-[28rem] border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBagIcon />
              </EmptyMedia>
              <EmptyTitle className="font-heading text-4xl">
                Your selection is empty
              </EmptyTitle>
              <EmptyDescription>
                Explore the preview collection and add a piece to continue the
                local cart journey.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                href="/shop"
                className={buttonVariants({ size: "lg", className: "h-11" })}
              >
                Explore the collection
              </Link>
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3">
                <h1 className="text-balance font-heading text-5xl leading-[0.9] font-medium tracking-[-0.035em] min-[420px]:text-6xl sm:text-7xl">
                  Your selection
                </h1>
                <p className="text-sm text-muted-foreground">
                  {totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"} in
                  this local preview
                </p>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="w-fit text-sm underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Clear selection
              </button>
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-16">
              <div className="flex flex-col gap-8">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
                <Link
                  href="/shop"
                  className="w-fit text-sm underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Continue shopping
                </Link>
              </div>

              <OrderSummary
                lines={lines}
                action={{
                  href: "/checkout",
                  label: "Continue to checkout preview",
                }}
                className="lg:sticky lg:top-32"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
