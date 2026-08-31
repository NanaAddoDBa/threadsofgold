import { randomUUID } from "node:crypto";

import {
  createSyntheticFoundationRequest,
  isFoundationRuntimeEnabled,
} from "@/lib/foundation/api-client";
import { isFoundationVerifierAuthorized } from "@/lib/foundation/authorization";

export const dynamic = "force-dynamic";

function unavailable(): Response {
  return Response.json({ status: "not_found" }, { status: 404 });
}

export async function POST(request: Request): Promise<Response> {
  if (
    !isFoundationRuntimeEnabled() ||
    !isFoundationVerifierAuthorized(request)
  ) {
    return unavailable();
  }

  try {
    const result = await createSyntheticFoundationRequest(
      request.headers.get("idempotency-key"),
      request.headers.get("x-request-id") ?? randomUUID(),
    );

    if ("error" in result) {
      return Response.json({ status: result.error }, { status: 400 });
    }

    return Response.json(result.response.data, {
      headers: {
        "cache-control": "no-store",
        "x-request-id":
          result.response.headers.get("x-request-id") ?? randomUUID(),
      },
      status: result.response.status,
    });
  } catch {
    return Response.json({ status: "upstream_unavailable" }, { status: 502 });
  }
}
