import {
  isFoundationRuntimeEnabled,
  readSyntheticFoundationRequest,
} from "@/lib/foundation/api-client";
import { isFoundationVerifierAuthorized } from "@/lib/foundation/authorization";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  if (
    !isFoundationRuntimeEnabled() ||
    !isFoundationVerifierAuthorized(request)
  ) {
    return Response.json({ status: "not_found" }, { status: 404 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return Response.json({ status: "invalid_request_id" }, { status: 400 });
  }

  try {
    const response = await readSyntheticFoundationRequest(id);

    return Response.json(response.data, {
      headers: {
        "cache-control": "no-store",
        "x-request-id": response.headers.get("x-request-id") ?? "unavailable",
      },
      status: response.status,
    });
  } catch {
    return Response.json({ status: "upstream_unavailable" }, { status: 502 });
  }
}
