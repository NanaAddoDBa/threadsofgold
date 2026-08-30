import type {
  AuthErrorResponse,
  LoginCredentials,
  RegistrationDetails,
} from "@/types/auth";

type FieldErrors = NonNullable<AuthErrorResponse["fieldErrors"]>;

interface ValidationResult<T> {
  data?: T;
  fieldErrors: FieldErrors;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeName(value: unknown): string {
  return readString(value).trim().replace(/\s+/g, " ");
}

export function normalizeEmail(value: unknown): string {
  return readString(value).trim().toLowerCase();
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !emailPattern.test(email)) {
    return "Enter a valid email address.";
  }
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Enter your password.";
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 128) return "Use no more than 128 characters.";
}

function validateName(value: string, label: string): string | undefined {
  if (!value) return `Enter your ${label.toLowerCase()}.`;
  if (value.length < 2 || value.length > 50 || !namePattern.test(value)) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }
}

export function parseLoginInput(
  value: unknown,
): ValidationResult<LoginCredentials> {
  const body = isRecord(value) ? value : {};
  const email = normalizeEmail(body.email);
  const password = readString(body.password);
  const fieldErrors: FieldErrors = {};

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  return { data: { email, password }, fieldErrors };
}

export function parseRegistrationInput(
  value: unknown,
): ValidationResult<RegistrationDetails> {
  const body = isRecord(value) ? value : {};
  const firstName = normalizeName(body.firstName);
  const lastName = normalizeName(body.lastName);
  const email = normalizeEmail(body.email);
  const password = readString(body.password);
  const consent = body.consent === true;
  const fieldErrors: FieldErrors = {};

  const firstNameError = validateName(firstName, "First name");
  const lastNameError = validateName(lastName, "Last name");
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (firstNameError) fieldErrors.firstName = firstNameError;
  if (lastNameError) fieldErrors.lastName = lastNameError;
  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;
  if (!consent) {
    fieldErrors.consent =
      "Confirm that you understand this is a temporary account.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  return {
    data: { firstName, lastName, email, password, consent },
    fieldErrors,
  };
}

export function sanitizeReturnPath(value: unknown): string {
  if (typeof value !== "string") return "/account";
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/api")
  ) {
    return "/account";
  }
  return value;
}
