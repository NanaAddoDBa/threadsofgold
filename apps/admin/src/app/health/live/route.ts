import { createLivenessResponse } from "@/lib/operations/service-status";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return createLivenessResponse();
}
