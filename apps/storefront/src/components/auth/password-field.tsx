"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  visibilityLabel?: string;
}

export function PasswordField({
  className,
  visibilityLabel = "password",
  ...props
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("h-11 pr-11", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        onClick={() => setIsVisible((value) => !value)}
        aria-label={`${isVisible ? "Hide" : "Show"} ${visibilityLabel}`}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}
