"use client";

import { KeyRoundIcon, LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PasswordField } from "@/components/auth/password-field";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@threadsofgold/ui/components/alert";
import { Button } from "@threadsofgold/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@threadsofgold/ui/components/field";
import { Input } from "@threadsofgold/ui/components/input";
import { prototypeAuthConfig } from "@/config/auth";
import { parseLoginInput } from "@/lib/auth/validation";
import type { AuthErrorResponse } from "@/types/auth";

export function LoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    AuthErrorResponse["fieldErrors"]
  >({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = parseLoginInput({ email, password });
    if (!parsed.data) {
      setFieldErrors(parsed.fieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const result = await login(parsed.data);
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error.message);
      setFieldErrors(result.error.fieldErrors ?? {});
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  function useDemoAccount() {
    setEmail(prototypeAuthConfig.demoEmail);
    setPassword(prototypeAuthConfig.demoPassword);
    setFieldErrors({});
    setFormError("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Alert className="border-accent/50 bg-accent/8 py-3">
        <KeyRoundIcon aria-hidden="true" />
        <AlertTitle>Temporary prototype account</AlertTitle>
        <AlertDescription>
          {prototypeAuthConfig.notice} No details are sent to the client or used
          for real orders.
        </AlertDescription>
      </Alert>

      {formError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors?.email)}>
          <FieldLabel htmlFor="login-email">Email address</FieldLabel>
          <Input
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            className="h-11"
            aria-invalid={Boolean(fieldErrors?.email)}
            aria-describedby={
              fieldErrors?.email ? "login-email-error" : undefined
            }
            disabled={isSubmitting}
          />
          <FieldError id="login-email-error">{fieldErrors?.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors?.password)}>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <PasswordField
            id="login-password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(fieldErrors?.password)}
            aria-describedby={
              fieldErrors?.password ? "login-password-error" : undefined
            }
            disabled={isSubmitting}
          />
          <FieldError id="login-password-error">
            {fieldErrors?.password}
          </FieldError>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          className="h-11"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
          ) : null}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11"
          onClick={useDemoAccount}
          disabled={isSubmitting}
        >
          Use preview account
        </Button>
        <FieldDescription className="text-center">
          Preview: {prototypeAuthConfig.demoEmail}
        </FieldDescription>
      </div>
    </form>
  );
}
