import Link from "next/link";

import { HeritageDivider } from "@/components/brand/heritage-divider";

interface AuthPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateHref: string;
  children: React.ReactNode;
}

export function AuthPageShell({
  eyebrow,
  title,
  description,
  alternatePrompt,
  alternateLabel,
  alternateHref,
  children,
}: AuthPageShellProps) {
  return (
    <section className="min-h-[calc(100dvh-7rem)]">
      <div className="mx-auto grid w-full max-w-[90rem] lg:min-h-[46rem] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-primary px-12 py-16 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 opacity-[0.06]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(45deg, currentColor 1px, transparent 1px), linear-gradient(-45deg, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative flex max-w-md flex-col gap-6">
            <p className="text-xs tracking-[0.2em] text-primary-foreground/65 uppercase">
              The Threads of Gold circle
            </p>
            <p className="font-heading text-6xl leading-[0.92] font-medium tracking-[-0.025em]">
              Your style, considered personally.
            </p>
          </div>
          <div className="relative flex max-w-md flex-col gap-5">
            <div className="h-px w-20 bg-accent" />
            <p className="text-sm leading-7 text-primary-foreground/70">
              Save your place in the collection and preview the personal account
              experience designed for future Threads of Gold clients.
            </p>
          </div>
        </div>

        <div className="flex items-center px-5 py-14 sm:px-8 sm:py-18 lg:px-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {eyebrow}
              </p>
              <h1 className="text-balance font-heading text-5xl leading-[0.95] font-medium tracking-[-0.025em] sm:text-6xl">
                {title}
              </h1>
              <p className="max-w-lg text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {description}
              </p>
              <HeritageDivider className="max-w-28" />
            </div>

            {children}

            <p className="border-t pt-6 text-center text-sm text-muted-foreground">
              {alternatePrompt}{" "}
              <Link
                href={alternateHref}
                className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {alternateLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
