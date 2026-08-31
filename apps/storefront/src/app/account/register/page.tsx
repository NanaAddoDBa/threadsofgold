import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegistrationForm } from "@/components/auth/registration-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { accountRouteWithReturnTo, storefrontRoutes } from "@/config/routes";
import { getCurrentPrototypeUser } from "@/lib/auth/current-user";
import { sanitizeReturnPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a temporary Threads of Gold prototype account.",
};

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const user = await getCurrentPrototypeUser();
  if (user) redirect(storefrontRoutes.account.home);

  const { next } = await searchParams;
  const returnTo = sanitizeReturnPath(next);
  const signInHref = accountRouteWithReturnTo(
    storefrontRoutes.account.signIn,
    returnTo,
  );

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <AuthPageShell
          eyebrow="Join the circle"
          title="Create your account"
          description="Preview a more personal way to discover distinctive pieces and return to your selection."
          alternatePrompt="Already have an account?"
          alternateLabel="Sign in"
          alternateHref={signInHref}
        >
          <RegistrationForm returnTo={returnTo} />
        </AuthPageShell>
      </main>
      <SiteFooter />
    </>
  );
}
