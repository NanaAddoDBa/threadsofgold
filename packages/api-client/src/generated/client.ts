import { ServiceFoundation } from "@threadsofgold/api-client/models";

export type getServiceFoundationResponse200 = {
  data: ServiceFoundation;
  status: 200;
};

export type getServiceFoundationResponseSuccess =
  getServiceFoundationResponse200 & {
    headers: Headers;
  };
export type getServiceFoundationResponse = getServiceFoundationResponseSuccess;

export const getGetServiceFoundationUrl = () => {
  return `/v1`;
};

/**
 * @summary Read the public API foundation metadata
 */
export const getServiceFoundation = async (
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<getServiceFoundationResponse> => {
  const res = await (fetchFn ?? fetch)(getGetServiceFoundationUrl(), {
    ...options,
    method: "GET",
  });

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  const body = [204, 205, 304].includes(res.status) ? null : await res.text();

  const parsedBody = body
    ? contentType.includes("json")
      ? JSON.parse(body)
      : body
    : {};
  const data = contentType.includes("json")
    ? ServiceFoundation.parse(parsedBody)
    : parsedBody;
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as getServiceFoundationResponse;
};
