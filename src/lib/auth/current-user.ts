import "server-only";

import { cookies } from "next/headers";

import { prototypeSessionCookie } from "@/lib/auth/http";
import { getPrototypeUserBySessionToken } from "@/lib/auth/store";

export async function getCurrentPrototypeUser() {
  const cookieStore = await cookies();
  return getPrototypeUserBySessionToken(
    cookieStore.get(prototypeSessionCookie)?.value,
  );
}
