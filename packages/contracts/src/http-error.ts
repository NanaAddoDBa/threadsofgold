import { z } from "./zod.js";

export const httpErrorResponseSchema = z
  .object({
    error: z.string().min(1).meta({ example: "Bad Request" }),
    message: z.string().min(1).meta({
      example: "A valid Idempotency-Key is required.",
    }),
    statusCode: z.int().min(400).max(599).meta({ example: 400 }),
  })
  .meta({
    id: "HttpErrorResponse",
    description: "Safe public HTTP error response.",
  });

export type HttpErrorResponse = z.infer<typeof httpErrorResponseSchema>;
