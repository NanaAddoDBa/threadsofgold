import * as zod from "zod";

export const httpErrorResponseStatusCodeMin = 400;
export const httpErrorResponseStatusCodeMax = 599;

export const HttpErrorResponse = zod
  .strictObject({
    error: zod.string().min(1),
    message: zod.string().min(1),
    statusCode: zod
      .int()
      .min(httpErrorResponseStatusCodeMin)
      .max(httpErrorResponseStatusCodeMax),
  })
  .describe("Safe public HTTP error response.");

export type HttpErrorResponse = zod.input<typeof HttpErrorResponse>;
export type HttpErrorResponseOutput = zod.output<typeof HttpErrorResponse>;
