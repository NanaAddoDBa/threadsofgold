import { type NextRequest, NextResponse } from "next/server";

import {
  authError,
  clearPrototypeSessionCookie,
  isTrustedAuthRequest,
  prototypeSessionCookie,
} from "@/lib/auth/http";
import { deletePrototypeSession } from "@/lib/auth/store";

export async function POST(request: NextRequest) {
  if (!isTrustedAuthRequest(request)) {
    return authError(403, "This request could not be verified.");
  }

  deletePrototypeSession(request.cookies.get(prototypeSessionCookie)?.value);
  const response = NextResponse.json(
    { message: "You have been signed out." },
    { headers: { "Cache-Control": "no-store" } },
  );
  clearPrototypeSessionCookie(response);
  return response;
}
