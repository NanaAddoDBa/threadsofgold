import { timingSafeEqual } from "node:crypto";

import { storefrontServerEnvironment } from "@/config/environment.server";

const VERIFIER_TOKEN_HEADER = "x-foundation-verifier-token";

export function isFoundationVerifierAuthorized(request: Request): boolean {
  const expected = storefrontServerEnvironment.FOUNDATION_VERIFIER_TOKEN;
  const supplied = request.headers.get(VERIFIER_TOKEN_HEADER);

  if (expected === undefined || supplied === null) return false;

  const expectedBytes = Buffer.from(expected, "utf8");
  const suppliedBytes = Buffer.from(supplied, "utf8");

  return (
    expectedBytes.length === suppliedBytes.length &&
    timingSafeEqual(expectedBytes, suppliedBytes)
  );
}
