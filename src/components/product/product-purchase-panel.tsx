"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon, InfoIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Product, ProductSelection } from "@/types/commerce";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedValueIds, setSelectedValueIds] = useState<ProductSelection>(
    () =>
      Object.fromEntries(
        product.options.flatMap((option) => {
          const firstValue = option.values[0];
          return firstValue ? [[option.id, firstValue.id]] : [];
        }),
      ),
  );
  const [addedMessage, setAddedMessage] = useState("");
  const { addProduct } = useCart();

  return (
    <div className="flex flex-col gap-7">
      {product.options.map((option) => (
        <fieldset key={option.id} className="flex flex-col gap-3">
          <legend className="text-sm font-medium">
            Choose {option.label.toLowerCase()}
          </legend>
          <ToggleGroup
            type="single"
            value={selectedValueIds[option.id]}
            onValueChange={(value) => {
              const selectedValue = option.values.find(
                (candidate) => candidate.id === value,
              );

              if (selectedValue) {
                setSelectedValueIds((currentSelections) => ({
                  ...currentSelections,
                  [option.id]: selectedValue.id,
                }));
                setAddedMessage("");
              }
            }}
            aria-label={`Choose ${option.label.toLowerCase()}`}
            className="grid w-full grid-cols-2 gap-3 rounded-none sm:grid-cols-4"
          >
            {option.values.map((value) => (
              <ToggleGroupItem
                key={value.id}
                value={value.id}
                aria-label={`${option.label} ${value.label}`}
                className="h-12 rounded-none border bg-background px-3 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {value.swatch ? (
                  <span
                    className="size-3 rounded-full border border-current"
                    style={{ backgroundColor: value.swatch }}
                    aria-hidden="true"
                  />
                ) : null}
                {value.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>
      ))}

      <div className="flex flex-col gap-3 border-t pt-5">
        <h2 className="font-heading text-2xl font-medium">Made for you</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {product.productionNote}
        </p>
        <p className="text-xs font-medium tracking-[0.08em] uppercase">
          {product.timelineLabel}
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        className="h-12 w-full rounded-none"
        aria-label={`Add ${product.name} with selected options to the preview cart`}
        onClick={() => {
          const selections = Object.fromEntries(
            product.options.flatMap((option) => {
              const selectedValue = option.values.find(
                (value) => value.id === selectedValueIds[option.id],
              );

              return selectedValue ? [[option.label, selectedValue.label]] : [];
            }),
          );

          addProduct(product.id, selections);
          setAddedMessage("Added with your selected options.");
        }}
      >
        Add to preview cart
        <ArrowRightIcon data-icon="inline-end" />
      </Button>

      <p className="min-h-5 text-sm text-heritage-green" aria-live="polite">
        {addedMessage ? (
          <span className="inline-flex items-center gap-2">
            <CheckIcon className="size-4" aria-hidden="true" />
            {addedMessage}
          </span>
        ) : null}
      </p>

      <div className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          Final price, production time, and fulfilment details will be confirmed
          before launch. Your selected options are visual prototype data only.
        </p>
      </div>
    </div>
  );
}
