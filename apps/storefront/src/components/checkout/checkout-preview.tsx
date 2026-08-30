"use client";

import { CheckIcon, MapPinIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { OrderSummary } from "@/components/cart/order-summary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@threadsofgold/ui/components/breadcrumb";
import { Button, buttonVariants } from "@threadsofgold/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@threadsofgold/ui/components/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@threadsofgold/ui/components/field";
import { Input } from "@threadsofgold/ui/components/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@threadsofgold/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@threadsofgold/ui/components/select";
import { Separator } from "@threadsofgold/ui/components/separator";
import { deliveryMethods, ghanaRegions } from "@/data/ghana";
import { formatGhs } from "@/lib/currency";
import type { CartLine } from "@/types/commerce";

export function CheckoutPreview() {
  const { lines, totalQuantity, addProduct, clearCart } = useCart();
  const [completedLines, setCompletedLines] = useState<readonly CartLine[]>([]);
  const isComplete = completedLines.length > 0;
  const completedTotal = completedLines.reduce(
    (total, line) => total + line.product.samplePriceGhs * line.quantity,
    0,
  );
  const completedQuantity = completedLines.reduce(
    (total, line) => total + line.quantity,
    0,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (lines.length === 0) {
      return;
    }

    setCompletedLines(lines);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartAgain() {
    completedLines.forEach((line) => {
      for (let item = 0; item < line.quantity; item += 1) {
        addProduct(line.product.id, line.selections);
      }
    });
    setCompletedLines([]);
  }

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
              <BreadcrumbLink asChild>
                <Link href="/cart">Cart</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isComplete ? (
          <div className="mx-auto flex min-h-[32rem] w-full max-w-3xl items-center">
            <div className="flex w-full flex-col items-center gap-6 border border-accent bg-card px-6 py-14 text-center sm:px-12">
              <span className="flex size-12 items-center justify-center rounded-full border border-accent text-accent">
                <CheckIcon aria-hidden="true" />
              </span>
              <div className="flex max-w-xl flex-col gap-3">
                <h1 className="font-heading text-6xl leading-[0.9] font-medium tracking-[-0.035em] sm:text-7xl">
                  Preview complete
                </h1>
                <p className="text-pretty leading-7 text-muted-foreground">
                  You completed the local checkout journey for{" "}
                  {completedQuantity} preview{" "}
                  {completedQuantity === 1 ? "piece" : "pieces"}, totalling{" "}
                  {formatGhs(completedTotal)}. No order was created, no details
                  were saved, and no payment was taken.
                </p>
              </div>
              <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className={buttonVariants({
                    size: "lg",
                    className: "h-11 flex-1",
                  })}
                >
                  Return to the collection
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 flex-1"
                  onClick={handleStartAgain}
                >
                  Start again
                </Button>
              </div>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <Empty className="min-h-[28rem] border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBagIcon />
              </EmptyMedia>
              <EmptyTitle className="font-heading text-4xl">
                Nothing to preview yet
              </EmptyTitle>
              <EmptyDescription>
                Add a piece to your local cart before opening the checkout
                preview.
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
            <div className="flex max-w-3xl flex-col gap-4">
              <h1 className="font-heading text-6xl leading-[0.9] font-medium tracking-[-0.035em] sm:text-7xl">
                Checkout preview
              </h1>
              <p className="text-pretty leading-7 text-muted-foreground">
                Try the future delivery journey using temporary local form data.
                No order will be created and no payment will be taken.
              </p>
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
              <form
                id="checkout-preview-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 border bg-card p-5 sm:p-8"
              >
                <FieldSet>
                  <FieldLegend className="font-heading text-3xl font-medium">
                    1. Contact
                  </FieldLegend>
                  <FieldDescription>
                    Used only in this screen and discarded when you leave or
                    complete the preview.
                  </FieldDescription>
                  <FieldGroup className="grid gap-5 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="checkout-email">
                        Email address
                      </FieldLabel>
                      <Input
                        id="checkout-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-11"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-name">Full name</FieldLabel>
                      <Input
                        id="checkout-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="h-11"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-phone">
                        Phone number
                      </FieldLabel>
                      <Input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+233 24 000 0000"
                        className="h-11"
                        required
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Separator />

                <FieldSet>
                  <FieldLegend className="font-heading text-3xl font-medium">
                    2. Delivery address
                  </FieldLegend>
                  <FieldGroup className="grid gap-5 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="checkout-region">Region</FieldLabel>
                      <Select name="region" required>
                        <SelectTrigger
                          id="checkout-region"
                          className="h-11 w-full"
                        >
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ghanaRegions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-city">
                        City or town
                      </FieldLabel>
                      <Input
                        id="checkout-city"
                        name="city"
                        autoComplete="address-level2"
                        placeholder="Accra"
                        className="h-11"
                        required
                      />
                    </Field>
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="checkout-address">
                        Address
                      </FieldLabel>
                      <Input
                        id="checkout-address"
                        name="address"
                        autoComplete="street-address"
                        placeholder="House number, street name, area"
                        className="h-11"
                        required
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Separator />

                <FieldSet>
                  <FieldLegend className="font-heading text-3xl font-medium">
                    3. Delivery method
                  </FieldLegend>
                  <FieldDescription>
                    These choices demonstrate the interface only; the business
                    will confirm real delivery options and fees before launch.
                  </FieldDescription>
                  <RadioGroup
                    name="delivery-method"
                    defaultValue={deliveryMethods[0].id}
                    required
                  >
                    {deliveryMethods.map((method) => (
                      <FieldLabel key={method.id} htmlFor={method.id}>
                        <Field orientation="horizontal">
                          <RadioGroupItem id={method.id} value={method.id} />
                          <FieldContent>
                            <FieldTitle>{method.label}</FieldTitle>
                            <FieldDescription>
                              {method.description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                </FieldSet>

                <div className="flex items-start gap-3 border-t pt-5 text-sm text-muted-foreground lg:hidden">
                  <MapPinIcon
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <p>
                    {totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"}.
                    Delivery details remain illustrative until confirmed by
                    Threads of Gold.
                  </p>
                </div>
              </form>

              <OrderSummary
                lines={lines}
                action={{
                  formId: "checkout-preview-form",
                  label: "Complete preview",
                }}
                showLines
                className="lg:sticky lg:top-32"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
