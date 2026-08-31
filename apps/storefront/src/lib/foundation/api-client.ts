import {
  createFoundationRequest,
  getFoundationRequest,
} from "@threadsofgold/api-client";
import {
  CreateFoundationRequestHeaders,
  FoundationRequest,
  HttpErrorResponse,
} from "@threadsofgold/api-client/models";

import { storefrontServerEnvironment } from "@/config/environment.server";

function createInternalFetch(): typeof globalThis.fetch {
  const origin = storefrontServerEnvironment.INTERNAL_API_URL;

  if (
    !storefrontServerEnvironment.FOUNDATION_RUNTIME_ENABLED ||
    origin === undefined
  ) {
    throw new Error("The local foundation runtime is unavailable.");
  }

  return (input, init) => {
    const target =
      typeof input === "string" ? new URL(input, `${origin}/`) : input;

    return fetch(target, { ...init, cache: "no-store" });
  };
}

export function isFoundationRuntimeEnabled(): boolean {
  return storefrontServerEnvironment.FOUNDATION_RUNTIME_ENABLED;
}

export async function createSyntheticFoundationRequest(
  idempotencyKey: string | null,
  correlationId: string,
) {
  const headers = CreateFoundationRequestHeaders.safeParse({
    "Idempotency-Key": idempotencyKey,
  });

  if (!headers.success) {
    return { error: "invalid_idempotency_key" as const };
  }

  const response = await createFoundationRequest(
    {
      headers: {
        "Idempotency-Key": headers.data["Idempotency-Key"],
        "x-request-id": correlationId,
      },
    },
    createInternalFetch(),
  );

  return {
    response:
      response.status === 202
        ? { ...response, data: FoundationRequest.parse(response.data) }
        : { ...response, data: HttpErrorResponse.parse(response.data) },
  };
}

export async function readSyntheticFoundationRequest(id: string) {
  const response = await getFoundationRequest(
    id,
    undefined,
    createInternalFetch(),
  );

  return response.status === 200
    ? { ...response, data: FoundationRequest.parse(response.data) }
    : { ...response, data: HttpErrorResponse.parse(response.data) };
}
