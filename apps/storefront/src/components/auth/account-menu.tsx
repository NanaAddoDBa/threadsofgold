"use client";

import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@threadsofgold/ui/components/button";

export function AccountMenu() {
  const { user, isLoading } = useAuth();
  const label = user ? `Account for ${user.firstName}` : "Sign in";

  return (
    <Button
      asChild
      variant="ghost"
      size="icon-lg"
      aria-label={isLoading ? "Loading account" : label}
    >
      <Link href={user ? "/account" : "/account/sign-in"}>
        <CircleUserRoundIcon aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </Button>
  );
}
