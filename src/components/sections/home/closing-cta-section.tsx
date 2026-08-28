import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { homeContent } from "@/content/home";

export function ClosingCtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-12">
        <h2 className="max-w-3xl text-balance font-heading text-5xl leading-[0.95] font-medium tracking-[-0.03em] sm:text-7xl">
          {homeContent.closing.title}
        </h2>
        <div className="flex max-w-lg flex-col items-start gap-6">
          <p className="text-pretty leading-7 text-muted-foreground">
            {homeContent.closing.description}
          </p>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/shop">
                Explore the collection
                <ArrowUpRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Follow {siteConfig.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
