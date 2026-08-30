import { type NextRequest, NextResponse } from "next/server";

import {
  authError,
  getAuthClientKey,
  isTrustedAuthRequest,
  setPrototypeSessionCookie,
} from "@/lib/auth/http";
import {
  checkPrototypeRateLimit,
  createPrototypeSession,
  createPrototypeUser,
  EmailAlreadyRegisteredError,
} from "@/lib/auth/store";
import { parseRegistrationInput } from "@/lib/auth/validation";
import type { AuthResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  if (!isTrustedAuthRequest(request)) {
    return authError(403, "This request could not be verified.");
  }

  const rateLimitKey = `register:${getAuthClientKey(request)}`;
  const rateLimit = checkPrototypeRateLimit(rateLimitKey, 5);
  if (!rateLimit.allowed) {
    const response = authError(
      429,
      "Too many registration attempts. Please try again shortly.",
    );
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
    return response;
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = parseRegistrationInput(body);
  if (!parsed.data) {
    return authError(
      400,
      "Please review the highlighted details.",
      parsed.fieldErrors,
    );
  }

  try {
    const user = await createPrototypeUser(parsed.data);
    const sessionToken = createPrototypeSession(user.id);
    const response = NextResponse.json<AuthResponse>(
      {
        user,
        message: "Your temporary prototype account is ready.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
    setPrototypeSessionCookie(response, request, sessionToken);
    return response;
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return authError(409, "An account already uses this email address.", {
        email: "Sign in instead or use a different email address.",
      });
    }
    return authError(500, "We could not create the account. Please try again.");
  }
}
