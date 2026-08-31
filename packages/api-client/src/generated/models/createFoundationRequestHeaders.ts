import * as zod from "zod";

export const createFoundationRequestHeadersIdempotencyKeyMax = 200;

export const createFoundationRequestHeadersIdempotencyKeyRegExp = new RegExp(
  "^[A-Za-z0-9._-]+$",
);

export const CreateFoundationRequestHeaders = zod.strictObject({
  "Idempotency-Key": zod
    .string()
    .min(1)
    .max(createFoundationRequestHeadersIdempotencyKeyMax)
    .regex(createFoundationRequestHeadersIdempotencyKeyRegExp),
});

export type CreateFoundationRequestHeaders = zod.input<
  typeof CreateFoundationRequestHeaders
>;
export type CreateFoundationRequestHeadersOutput = zod.output<
  typeof CreateFoundationRequestHeaders
>;
