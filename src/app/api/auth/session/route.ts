import { NextRequest, NextResponse } from "next/server";

import { prototypeSessionCookie } from "@/lib/auth/http";
import { getPrototypeUserBySessionToken } from "@/lib/auth/store";

export async function GET(request: NextRequest) {
  const user = getPrototypeUserBySessionToken(
    request.cookies.get(prototypeSessionCookie)?.value,
  );

  return NextResponse.json(
    { user, prototype: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
