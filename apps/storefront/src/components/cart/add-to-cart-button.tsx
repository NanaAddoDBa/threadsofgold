"use client";

import { PlusIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@threadsofgold/ui/components/button";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
}

export function AddToCartButton({
  productId,
  productName,
}: AddToCartButtonProps) {
  const { addProduct } = useCart();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Add ${productName} to the preview cart`}
      onClick={() => addProduct(productId)}
    >
      <PlusIcon data-icon="inline-start" />
      Add to preview
    </Button>
  );
}
