"use client";

import { LoaderCircleIcon, ShieldCheckIcon } from "lucide-react";
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
import { Checkbox } from "@threadsofgold/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@threadsofgold/ui/components/field";
import { Input } from "@threadsofgold/ui/components/input";
import { prototypeAuthConfig } from "@/config/auth";
import { parseRegistrationInput } from "@/lib/auth/validation";
import type { AuthErrorResponse } from "@/types/auth";

interface RegistrationFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
}

const initialState: RegistrationFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  consent: false,
};

export function RegistrationForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    AuthErrorResponse["fieldErrors"]
  >({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof RegistrationFormState,
    value: string | boolean,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = parseRegistrationInput(form);
    const nextErrors = { ...parsed.fieldErrors };
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "The passwords do not match.";
    }

    if (!parsed.data || Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const result = await register(parsed.data);
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error.message);
      setFieldErrors(result.error.fieldErrors ?? {});
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Alert className="border-accent/50 bg-accent/8 py-3">
        <ShieldCheckIcon aria-hidden="true" />
        <AlertTitle>Safe prototype registration</AlertTitle>
        <AlertDescription>
          Passwords are hashed on the local server and sessions use an HTTP-only
          cookie. {prototypeAuthConfig.notice}
        </AlertDescription>
      </Alert>

      {formError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to create account</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(fieldErrors?.firstName)}>
            <FieldLabel htmlFor="register-first-name">First name</FieldLabel>
            <Input
              id="register-first-name"
              name="firstName"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              autoComplete="given-name"
              className="h-11"
              aria-invalid={Boolean(fieldErrors?.firstName)}
              aria-describedby={
                fieldErrors?.firstName ? "register-first-name-error" : undefined
              }
              disabled={isSubmitting}
            />
            <FieldError id="register-first-name-error">
              {fieldErrors?.firstName}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(fieldErrors?.lastName)}>
            <FieldLabel htmlFor="register-last-name">Last name</FieldLabel>
            <Input
              id="register-last-name"
              name="lastName"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              autoComplete="family-name"
              className="h-11"
              aria-invalid={Boolean(fieldErrors?.lastName)}
              aria-describedby={
                fieldErrors?.lastName ? "register-last-name-error" : undefined
              }
              disabled={isSubmitting}
            />
            <FieldError id="register-last-name-error">
              {fieldErrors?.lastName}
            </FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(fieldErrors?.email)}>
          <FieldLabel htmlFor="register-email">Email address</FieldLabel>
          <Input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            inputMode="email"
            className="h-11"
            aria-invalid={Boolean(fieldErrors?.email)}
            aria-describedby={
              fieldErrors?.email ? "register-email-error" : undefined
            }
            disabled={isSubmitting}
          />
          <FieldError id="register-email-error">
            {fieldErrors?.email}
          </FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors?.password)}>
          <FieldLabel htmlFor="register-password">Create password</FieldLabel>
          <PasswordField
            id="register-password"
            name="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            autoComplete="new-password"
            aria-invalid={Boolean(fieldErrors?.password)}
            aria-describedby="register-password-description register-password-error"
            disabled={isSubmitting}
          />
          <FieldDescription id="register-password-description">
            Use at least 10 characters. A memorable passphrase works well.
          </FieldDescription>
          <FieldError id="register-password-error">
            {fieldErrors?.password}
          </FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors?.confirmPassword)}>
          <FieldLabel htmlFor="register-confirm-password">
            Confirm password
          </FieldLabel>
          <PasswordField
            id="register-confirm-password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            autoComplete="new-password"
            visibilityLabel="password confirmation"
            aria-invalid={Boolean(fieldErrors?.confirmPassword)}
            aria-describedby={
              fieldErrors?.confirmPassword
                ? "register-confirm-password-error"
                : undefined
            }
            disabled={isSubmitting}
          />
          <FieldError id="register-confirm-password-error">
            {fieldErrors?.confirmPassword}
          </FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors?.consent)}>
          <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
            <Checkbox
              id="register-consent"
              checked={form.consent}
              onCheckedChange={(checked) =>
                updateField("consent", checked === true)
              }
              aria-invalid={Boolean(fieldErrors?.consent)}
              aria-describedby={
                fieldErrors?.consent ? "register-consent-error" : undefined
              }
              disabled={isSubmitting}
            />
            <FieldLabel
              htmlFor="register-consent"
              className="cursor-pointer text-sm leading-6 font-normal"
            >
              I understand this creates a temporary prototype account only. It
              will not place orders, take payments, or create a permanent client
              record.
            </FieldLabel>
          </div>
          <FieldError id="register-consent-error">
            {fieldErrors?.consent}
          </FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-11" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
        ) : null}
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
