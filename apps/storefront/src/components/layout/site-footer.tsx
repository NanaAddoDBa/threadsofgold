import Link from "next/link";

import { storefrontRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12 lg:py-16">
        <div className="flex max-w-xl flex-col gap-4">
          <p className="font-heading text-3xl tracking-[0.06em]">
            THREADS OF GOLD
          </p>
          <p className="max-w-sm text-sm leading-6 text-primary-foreground/70">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end">
          <Link
            href={storefrontRoutes.account.signIn}
            className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Client account
          </Link>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {siteConfig.instagramHandle}
          </a>
          <p className="text-primary-foreground/60">
            Prototype only · No payments or orders
          </p>
          <p className="text-primary-foreground/60">Accra, Ghana</p>
        </div>
      </div>
    </footer>
  );
}
