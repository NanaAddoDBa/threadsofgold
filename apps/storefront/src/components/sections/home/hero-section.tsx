import Image from "next/image";
import Link from "next/link";
import { ArrowDownRightIcon } from "lucide-react";

import { Button } from "@threadsofgold/ui/components/button";
import { homeContent } from "@/content/home";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden border-b">
      <div className="mx-auto grid min-h-[calc(100svh-7.5rem)] w-full max-w-[90rem] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative flex flex-col justify-center gap-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div
            className="absolute top-0 bottom-0 left-0 hidden w-px bg-border xl:block"
            aria-hidden="true"
          />
          <div className="flex max-w-xl flex-col gap-6">
            <h1 className="text-balance font-heading text-6xl leading-[0.88] font-medium tracking-[-0.035em] sm:text-7xl xl:text-8xl">
              {homeContent.hero.title}
            </h1>
            <p className="max-w-md text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {homeContent.hero.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/shop">
                {homeContent.hero.primaryAction}
                <ArrowDownRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <a
              href="#the-house"
              className="text-sm underline underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {homeContent.hero.secondaryAction}
            </a>
          </div>
          <div
            className="flex h-1 w-24 overflow-hidden"
            aria-label="Ghana-inspired red, gold, and green accent"
            role="img"
          >
            <span className="flex-1 bg-heritage-red" />
            <span className="flex-1 bg-accent" />
            <span className="flex-1 bg-heritage-green" />
          </div>
        </div>

        <div className="relative min-h-[30rem] overflow-hidden bg-card lg:min-h-full">
          <Image
            src="/images/products/tog-jersey-lineup.jpeg"
            alt="Four Threads of Gold jerseys in ivory, black, red, and green hanging together"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute right-4 bottom-4 hidden w-[34%] border bg-background p-2 shadow-xl sm:block lg:right-8 lg:bottom-8">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/products/gold-crest-zip-shirt.jpeg"
                alt="Black Threads of Gold zip-front embroidered shirt"
                fill
                sizes="(min-width: 1024px) 20vw, 28vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
