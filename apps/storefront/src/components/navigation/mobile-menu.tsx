"use client";

import { AtSignIcon, CircleUserRoundIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function MobileMenu() {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open navigation">
          <MenuIcon data-icon="inline-start" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>{siteConfig.tagline}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-col px-4">
          {siteConfig.navigation.map((item, index) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className="flex items-center justify-between border-b py-5 font-heading text-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>{item.label}</span>
                <span className="font-sans text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href={user ? "/account" : "/account/sign-in"}
              className="flex items-center justify-between border-b py-5 font-heading text-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="inline-flex items-center gap-3">
                <CircleUserRoundIcon className="size-5" aria-hidden="true" />
                {user ? "My Account" : "Sign In"}
              </span>
              <span className="font-sans text-xs text-muted-foreground">
                {String(siteConfig.navigation.length + 1).padStart(2, "0")}
              </span>
            </Link>
          </SheetClose>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <AtSignIcon className="size-4" aria-hidden="true" />
            {siteConfig.instagramHandle}
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
