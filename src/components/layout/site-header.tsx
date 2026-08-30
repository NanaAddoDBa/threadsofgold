import { AtSignIcon } from "lucide-react";
import Link from "next/link";

import { AccountMenu } from "@/components/auth/account-menu";
import { CartSheet } from "@/components/cart/cart-sheet";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { siteConfig } from "@/config/site";
import { homeContent } from "@/content/home";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <p className="bg-primary px-4 py-2 text-center text-[0.7rem] tracking-[0.12em] text-primary-foreground uppercase">
        {homeContent.previewNotice}
      </p>
      <div className="mx-auto flex h-18 w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-1 lg:hidden">
          <MobileMenu />
        </div>

        <Link
          href="/"
          className="font-heading text-xl leading-none font-medium tracking-[0.08em] sm:text-2xl"
          aria-label="Threads of Gold home"
        >
          THREADS OF GOLD
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm underline-offset-8 transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm underline-offset-8 transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <AtSignIcon className="size-4" aria-hidden="true" />
            Instagram
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <AccountMenu />
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
