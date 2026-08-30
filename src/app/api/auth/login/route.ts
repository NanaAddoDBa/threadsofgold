import { NextRequest, NextResponse } from "next/server";

import {
  authError,
  getAuthClientKey,
  isTrustedAuthRequest,
  setPrototypeSessionCookie,
} from "@/lib/auth/http";
import {
  checkPrototypeRateLimit,
  clearPrototypeRateLimit,
  createPrototypeSession,
  verifyPrototypeCredentials,
} from "@/lib/auth/store";
import { parseLoginInput } from "@/lib/auth/validation";
import type { AuthResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  if (!isTrustedAuthRequest(request)) {
    return authError(403, "This request could not be verified.");
  }

  const rateLimitKey = `login:${getAuthClientKey(request)}`;
  const rateLimit = checkPrototypeRateLimit(rateLimitKey, 10);
  if (!rateLimit.allowed) {
    const response = authError(
      429,
      "Too many sign-in attempts. Please try again shortly.",
    );
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
    return response;
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = parseLoginInput(body);
  if (!parsed.data) {
    return authError(
      400,
      "Please review the highlighted details.",
      parsed.fieldErrors,
    );
  }

  const user = await verifyPrototypeCredentials(
    parsed.data.email,
    parsed.data.password,
  );
  if (!user) {
    return authError(401, "The email address or password is incorrect.");
  }

  clearPrototypeRateLimit(rateLimitKey);
  const sessionToken = createPrototypeSession(user.id);
  const response = NextResponse.json<AuthResponse>(
    { user, message: `Welcome back, ${user.firstName}.` },
    { headers: { "Cache-Control": "no-store" } },
  );
  setPrototypeSessionCookie(response, request, sessionToken);
  return response;
}
