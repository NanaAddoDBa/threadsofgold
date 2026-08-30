import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import type { AuthErrorResponse } from "@/types/auth";

export const prototypeSessionCookie = "tog_prototype_session";

export function isTrustedAuthRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestHost =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host");
    const requestProtocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      request.nextUrl.protocol.replace(":", "");

    return (
      Boolean(requestHost) &&
      originUrl.host === requestHost &&
      originUrl.protocol === `${requestProtocol}:`
    );
  } catch {
    return false;
  }
}

export function getAuthClientKey(request: NextRequest): string {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local-client";
}

export function setPrototypeSessionCookie(
  response: NextResponse,
  request: NextRequest,
  token: string,
): void {
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  response.cookies.set(prototypeSessionCookie, token, {
    httpOnly: true,
    sameSite: "strict",
    secure:
      request.nextUrl.protocol === "https:" || forwardedProtocol === "https",
    path: "/",
    maxAge: 2 * 60 * 60,
  });
}

export function clearPrototypeSessionCookie(response: NextResponse): void {
  response.cookies.set(prototypeSessionCookie, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function authError(
  status: number,
  message: string,
  fieldErrors?: AuthErrorResponse["fieldErrors"],
): NextResponse<AuthErrorResponse> {
  return NextResponse.json(
    { message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
