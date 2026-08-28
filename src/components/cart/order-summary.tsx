import { InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatGhs } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/types/commerce";

interface OrderSummaryProps {
  lines: readonly CartLine[];
  action: { href: string; label: string } | { formId: string; label: string };
  showLines?: boolean;
  className?: string;
}

export function OrderSummary({
  lines,
  action,
  showLines = false,
  className,
}: OrderSummaryProps) {
  const subtotal = lines.reduce(
    (total, line) => total + line.product.samplePriceGhs * line.quantity,
    0,
  );

  return (
    <aside
      aria-labelledby="order-summary-title"
      className={cn("flex flex-col gap-6 border bg-card p-5 sm:p-6", className)}
    >
      <h2
        id="order-summary-title"
        className="font-heading text-3xl font-medium"
      >
        Order summary
      </h2>

      {showLines ? (
        <div className="flex flex-col gap-5">
          {lines.map(({ id, product, selections, quantity }) => (
            <article key={id} className="flex gap-3">
              <div className="relative aspect-4/5 w-16 shrink-0 overflow-hidden bg-muted">
                <Image
                  src={product.image.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="font-heading text-lg leading-none font-medium">
                  {product.name}
                </h3>
                <dl className="text-xs leading-5 text-muted-foreground">
                  {Object.entries(selections).map(([label, value]) => (
                    <div key={label} className="flex gap-1">
                      <dt>{label}:</dt>
                      <dd className="text-foreground">{value}</dd>
                    </div>
                  ))}
                  <div className="flex gap-1">
                    <dt>Quantity:</dt>
                    <dd className="text-foreground">{quantity}</dd>
                  </div>
                </dl>
              </div>
              <p className="shrink-0 text-sm">
                {formatGhs(product.samplePriceGhs * quantity)}
              </p>
            </article>
          ))}
          <Separator />
        </div>
      ) : null}

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Sample subtotal</dt>
          <dd>{formatGhs(subtotal)}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="max-w-40 text-right">Confirmed before launch</dd>
        </div>
      </dl>

      <Separator />

      <div className="flex items-end justify-between gap-4">
        <span className="font-heading text-2xl">Sample total</span>
        <strong className="font-heading text-3xl font-medium">
          {formatGhs(subtotal)}
        </strong>
      </div>

      {"href" in action ? (
        <Link
          href={action.href}
          className={buttonVariants({ size: "lg", className: "h-11" })}
        >
          {action.label}
        </Link>
      ) : (
        <Button type="submit" form={action.formId} size="lg" className="h-11">
          {action.label}
        </Button>
      )}

      <Alert>
        <InfoIcon />
        <AlertTitle>Local prototype only</AlertTitle>
        <AlertDescription>
          No order will be created and no payment will be taken. Delivery,
          taxes, and final prices are not calculated.
        </AlertDescription>
      </Alert>
    </aside>
  );
}
