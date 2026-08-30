import type { Metadata } from "next";
import {
  CircleUserRoundIcon,
  ShoppingBagIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { HeritageDivider } from "@/components/brand/heritage-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@threadsofgold/ui/components/alert";
import { Badge } from "@threadsofgold/ui/components/badge";
import { Button } from "@threadsofgold/ui/components/button";
import { prototypeAuthConfig } from "@/config/auth";
import { getCurrentPrototypeUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your temporary Threads of Gold prototype account.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentPrototypeUser();
  if (!user) redirect("/account/sign-in?next=/account");

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-5 sm:px-8 lg:px-12">
            <div className="flex max-w-3xl flex-col gap-5">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Prototype account</Badge>
                <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Signed in
                </span>
              </div>
              <h1 className="text-balance font-heading text-6xl leading-[0.9] font-medium tracking-[-0.035em] sm:text-7xl lg:text-8xl">
                Welcome, {user.firstName}
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                This is the foundation of the future client account experience—
                personal, considered, and connected to the collection.
              </p>
              <HeritageDivider className="max-w-36" />
            </div>

            <Alert className="max-w-3xl border-accent/50 bg-accent/8 py-3">
              <SparklesIcon aria-hidden="true" />
              <AlertTitle>Temporary account active</AlertTitle>
              <AlertDescription>
                {prototypeAuthConfig.notice} This page does not represent a real
                order history or permanent customer record.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="flex flex-col gap-6 border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <CircleUserRoundIcon className="size-5" aria-hidden="true" />
                  <h2 className="font-heading text-3xl">Account details</h2>
                </div>
                <dl className="grid gap-5 border-t pt-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
                      Name
                    </dt>
                    <dd className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
                      Email
                    </dt>
                    <dd className="text-sm font-medium break-all">
                      {user.email}
                    </dd>
                  </div>
                </dl>
                <div className="mt-auto pt-2">
                  <SignOutButton />
                </div>
              </article>

              <article className="flex flex-col gap-6 bg-primary p-6 text-primary-foreground sm:p-8">
                <div className="flex items-center gap-3">
                  <ShoppingBagIcon className="size-5" aria-hidden="true" />
                  <h2 className="font-heading text-3xl">Your selection</h2>
                </div>
                <p className="text-sm leading-7 text-primary-foreground/70">
                  Your prototype bag remains available in this browser. Future
                  account phases can connect saved pieces and real order
                  history.
                </p>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/cart">View your bag</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Link href="/shop">Explore collection</Link>
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
