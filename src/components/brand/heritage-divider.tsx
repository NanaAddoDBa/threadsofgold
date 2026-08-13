import { Separator } from "@/components/ui/separator";

export function HeritageDivider() {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
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
