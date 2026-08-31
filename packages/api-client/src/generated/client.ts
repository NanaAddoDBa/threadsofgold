import {
  GetApiLiveness200,
  GetApiReadiness200,
  GetApiVersion200,
  ServiceFoundation,
} from "@threadsofgold/api-client/models";
import type {
  FoundationRequest,
  GetApiReadiness503,
  HttpErrorResponse,
} from "@threadsofgold/api-client/models";

export type getApiLivenessResponse200 = {
  data: GetApiLiveness200;
  status: 200;
};

export type getApiLivenessResponseSuccess = getApiLivenessResponse200 & {
  headers: Headers;
};
export type getApiLivenessResponse = getApiLivenessResponseSuccess;

export const getGetApiLivenessUrl = () => {
  return `/health/live`;
};

/**
 * @summary Check whether the API process is alive
 */
export const getApiLiveness = async (
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<getApiLivenessResponse> => {
  const res = await (fetchFn ?? fetch)(getGetApiLivenessUrl(), {
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
    ? GetApiLiveness200.parse(parsedBody)
    : parsedBody;
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as getApiLivenessResponse;
};

export type getApiReadinessResponse200 = {
  data: GetApiReadiness200;
  status: 200;
};

export type getApiReadinessResponse503 = {
  data: GetApiReadiness503;
  status: 503;
};

export type getApiReadinessResponseSuccess = getApiReadinessResponse200 & {
  headers: Headers;
};
export type getApiReadinessResponseError = getApiReadinessResponse503 & {
  headers: Headers;
};

export type getApiReadinessResponse =
  getApiReadinessResponseSuccess | getApiReadinessResponseError;

export const getGetApiReadinessUrl = () => {
  return `/health/ready`;
};

/**
 * @summary Check whether the API can receive traffic
 */
export const getApiReadiness = async (
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<getApiReadinessResponse> => {
  const res = await (fetchFn ?? fetch)(getGetApiReadinessUrl(), {
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
    ? GetApiReadiness200.parse(parsedBody)
    : parsedBody;
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as getApiReadinessResponse;
};

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

export type createFoundationRequestResponse202 = {
  data: FoundationRequest;
  status: 202;
};

export type createFoundationRequestResponse400 = {
  data: HttpErrorResponse;
  status: 400;
};

export type createFoundationRequestResponse404 = {
  data: HttpErrorResponse;
  status: 404;
};

export type createFoundationRequestResponseSuccess =
  createFoundationRequestResponse202 & {
    headers: Headers;
  };
export type createFoundationRequestResponseError = (
  createFoundationRequestResponse400 | createFoundationRequestResponse404
) & {
  headers: Headers;
};

export type createFoundationRequestResponse =
  createFoundationRequestResponseSuccess | createFoundationRequestResponseError;

export const getCreateFoundationRequestUrl = () => {
  return `/v1/foundation/requests`;
};

/**
 * Available only in local and test environments. It carries no customer, order, or payment data.
 * @summary Create an idempotent synthetic walking-skeleton request
 */
export const createFoundationRequest = async (
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<createFoundationRequestResponse> => {
  const res = await (fetchFn ?? fetch)(getCreateFoundationRequestUrl(), {
    ...options,
    method: "POST",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();

  const data: createFoundationRequestResponse["data"] = body
    ? JSON.parse(body)
    : {};
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as createFoundationRequestResponse;
};

export type getFoundationRequestResponse200 = {
  data: FoundationRequest;
  status: 200;
};

export type getFoundationRequestResponse400 = {
  data: HttpErrorResponse;
  status: 400;
};

export type getFoundationRequestResponse404 = {
  data: HttpErrorResponse;
  status: 404;
};

export type getFoundationRequestResponseSuccess =
  getFoundationRequestResponse200 & {
    headers: Headers;
  };
export type getFoundationRequestResponseError = (
  getFoundationRequestResponse400 | getFoundationRequestResponse404
) & {
  headers: Headers;
};

export type getFoundationRequestResponse =
  getFoundationRequestResponseSuccess | getFoundationRequestResponseError;

export const getGetFoundationRequestUrl = (id: string) => {
  return `/v1/foundation/requests/${id}`;
};

/**
 * Available only in local and test environments. It carries no customer, order, or payment data.
 * @summary Read a synthetic walking-skeleton request
 */
export const getFoundationRequest = async (
  id: string,
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<getFoundationRequestResponse> => {
  const res = await (fetchFn ?? fetch)(getGetFoundationRequestUrl(id), {
    ...options,
    method: "GET",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();

  const data: getFoundationRequestResponse["data"] = body
    ? JSON.parse(body)
    : {};
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as getFoundationRequestResponse;
};

export type getApiVersionResponse200 = {
  data: GetApiVersion200;
  status: 200;
};

export type getApiVersionResponseSuccess = getApiVersionResponse200 & {
  headers: Headers;
};
export type getApiVersionResponse = getApiVersionResponseSuccess;

export const getGetApiVersionUrl = () => {
  return `/version`;
};

/**
 * @summary Read the deployed API version
 */
export const getApiVersion = async (
  options?: RequestInit,
  fetchFn?: typeof globalThis.fetch,
): Promise<getApiVersionResponse> => {
  const res = await (fetchFn ?? fetch)(getGetApiVersionUrl(), {
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
    ? GetApiVersion200.parse(parsedBody)
    : parsedBody;
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as getApiVersionResponse;
};
