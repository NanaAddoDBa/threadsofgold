import Image from "next/image";

import { homeContent } from "@/content/home";

export function BrandStorySection() {
  return (
    <section id="the-house" className="scroll-mt-28 border-b bg-primary">
      <div className="mx-auto grid w-full max-w-[90rem] lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-5 py-16 text-primary-foreground sm:px-8 lg:px-12 lg:py-24">
          <div className="relative h-24 w-20 overflow-hidden border border-primary-foreground/20 bg-black">
            <Image
              src="/images/brand/threads-of-gold-logo.jpeg"
              alt="Threads of Gold official logo"
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          </div>
          <div className="flex max-w-xl flex-col gap-5">
            <h2 className="text-balance font-heading text-5xl leading-none font-medium tracking-[-0.025em] text-accent sm:text-6xl">
              {homeContent.story.title}
            </h2>
            <p className="text-pretty text-base leading-7 text-primary-foreground/75 sm:text-lg">
              {homeContent.story.description}
            </p>
          </div>
          <ul className="flex flex-col gap-3 border-t border-primary-foreground/20 pt-6 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
            {homeContent.story.principles.map((principle) => (
              <li key={principle} className="flex items-center gap-3">
                <span
                  className="size-1.5 rotate-45 bg-accent"
                  aria-hidden="true"
                />
                {principle}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[30rem] bg-card lg:min-h-[44rem]">
          <Image
            src="/images/products/ghana-capsule-duo.jpeg"
            alt="Two Threads of Gold statement tops in red, gold, and green on a clothing rail"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
