"use client";

import { useState } from "react";
import Image from "next/image";
import { ExpandIcon } from "lucide-react";

import { Button } from "@threadsofgold/ui/components/button";
import { cn } from "@threadsofgold/ui/lib/utils";
import type { ProductImage } from "@/types/commerce";

interface ProductGalleryProps {
  images: readonly ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[5.5rem_1fr] sm:items-start">
      <div
        className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0"
        role="tablist"
        aria-label={`${productName} gallery`}
      >
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls="active-product-image"
            aria-label={`View image ${index + 1} of ${images.length}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-4/5 w-20 shrink-0 overflow-hidden border bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-full",
              activeIndex === index ? "border-primary" : "border-transparent",
            )}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="88px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div
        id="active-product-image"
        role="tabpanel"
        className="relative order-1 aspect-4/5 overflow-hidden bg-card sm:order-2"
      >
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          className="absolute right-3 bottom-3"
          aria-label="View the active product image full screen"
          onClick={() => {
            document
              .getElementById("active-product-image")
              ?.requestFullscreen?.();
          }}
        >
          <ExpandIcon data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}
