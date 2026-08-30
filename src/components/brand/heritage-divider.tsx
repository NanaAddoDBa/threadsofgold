import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function HeritageDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-4", className)}
      aria-hidden="true"
    >
      <Separator className="flex-1" />
      <div className="flex items-center gap-1 text-accent">
        <span className="size-2 rotate-45 border" />
        <span className="size-3 rotate-45 border" />
        <span className="size-2 rotate-45 border" />
      </div>
      <Separator className="flex-1" />
    </div>
  );
}
