export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

export interface AuthErrorResponse {
  message: string;
  fieldErrors?: Partial<
    Record<
      | "firstName"
      | "lastName"
      | "email"
      | "password"
      | "confirmPassword"
      | "consent",
      string
    >
  >;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationDetails extends LoginCredentials {
  firstName: string;
  lastName: string;
  consent: boolean;
}

export type AuthRequestResult =
  { ok: true; data: AuthResponse } | { ok: false; error: AuthErrorResponse };
