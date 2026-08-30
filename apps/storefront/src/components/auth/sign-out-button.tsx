"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@threadsofgold/ui/components/button";

export function SignOutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignOut() {
    setIsSubmitting(true);
    const signedOut = await logout();
    setIsSubmitting(false);
    if (signedOut) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleSignOut}
      disabled={isSubmitting}
    >
      <LogOutIcon aria-hidden="true" />
      {isSubmitting ? "Signing out…" : "Sign out"}
    </Button>
  );
}
