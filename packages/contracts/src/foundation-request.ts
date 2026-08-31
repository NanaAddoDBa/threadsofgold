import { z } from "./zod.js";

export const FOUNDATION_REQUEST_QUEUE_NAME = "foundation-requests";
export const FOUNDATION_REQUEST_JOB_NAME = "deliver-foundation-notification";

export const correlationIdSchema = z
  .string()
  .regex(
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-7][0-9A-HJKMNP-TV-Z]{25})$/,
    "Use a UUID or ULID correlation identifier.",
  )
  .meta({
    description: "Normalized UUID or ULID request correlation identifier.",
    example: "9f7ddb2e-fda7-493e-84a6-1212e37437bb",
  });

export const foundationRequestIdSchema = z.uuid().meta({
  description: "Synthetic local walking-skeleton request identifier.",
  example: "076e287a-b66f-4a0c-90dc-815320487ef2",
});

export const idempotencyKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(
    /^[A-Za-z0-9._-]+$/,
    "Use letters, numbers, periods, underscores, or hyphens.",
  )
  .meta({
    description: "Retry key for one synthetic local request.",
    example: "44a761f6-b443-4e8d-96d5-c3aa56119ed1",
  });

export const foundationRequestStatusSchema = z
  .enum(["pending", "processing", "completed", "failed"])
  .meta({
    description: "Current local walking-skeleton processing state.",
    example: "completed",
  });

export const foundationRequestSchema = z
  .object({
    attempts: z.int().nonnegative().meta({ example: 1 }),
    completedAt: z.iso.datetime({ offset: true }).nullable().meta({
      example: "2026-08-31T03:00:01.000Z",
    }),
    correlationId: correlationIdSchema,
    createdAt: z.iso.datetime({ offset: true }).meta({
      example: "2026-08-31T03:00:00.000Z",
    }),
    id: foundationRequestIdSchema,
    lastErrorType: z.string().max(120).nullable().meta({
      example: null,
    }),
    status: foundationRequestStatusSchema,
    updatedAt: z.iso.datetime({ offset: true }).meta({
      example: "2026-08-31T03:00:01.000Z",
    }),
  })
  .meta({
    id: "FoundationRequest",
    description:
      "Synthetic, non-customer request used only to prove the local Phase 1 system path.",
  });

export const foundationRequestJobSchema = z.object({
  correlationId: correlationIdSchema,
  requestId: foundationRequestIdSchema,
});

export type FoundationRequest = z.infer<typeof foundationRequestSchema>;
export type FoundationRequestJob = z.infer<typeof foundationRequestJobSchema>;
export type FoundationRequestStatus = z.infer<
  typeof foundationRequestStatusSchema
>;
