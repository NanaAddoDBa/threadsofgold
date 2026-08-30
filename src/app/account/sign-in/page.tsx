import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentPrototypeUser } from "@/lib/auth/current-user";
import { sanitizeReturnPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the temporary Threads of Gold prototype account.",
};

interface SignInPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const user = await getCurrentPrototypeUser();
  if (user) redirect("/account");

  const { next } = await searchParams;
  const returnTo = sanitizeReturnPath(next);
  const registerHref = `/account/register?next=${encodeURIComponent(returnTo)}`;

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <AuthPageShell
          eyebrow="Welcome back"
          title="Sign in to your account"
          description="Return to your personal Threads of Gold space and continue exploring the collection."
          alternatePrompt="New to Threads of Gold?"
          alternateLabel="Create an account"
          alternateHref={registerHref}
        >
          <LoginForm returnTo={returnTo} />
        </AuthPageShell>
      </main>
      <SiteFooter />
    </>
  );
}
