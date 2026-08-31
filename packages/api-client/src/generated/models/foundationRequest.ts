import * as zod from "zod";

export const foundationRequestAttemptsMin = 0;

export const foundationRequestCorrelationIdRegExp = new RegExp(
  "^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-7][0-9A-HJKMNP-TV-Z]{25})$",
);
export const foundationRequestLastErrorTypeMax = 120;

export const FoundationRequest = zod
  .strictObject({
    attempts: zod.int().min(foundationRequestAttemptsMin),
    completedAt: zod.iso.datetime({ offset: true }).nullable(),
    correlationId: zod
      .string()
      .regex(foundationRequestCorrelationIdRegExp)
      .describe("Normalized UUID or ULID request correlation identifier."),
    createdAt: zod.iso.datetime({ offset: true }),
    id: zod
      .uuid()
      .describe("Synthetic local walking-skeleton request identifier."),
    lastErrorType: zod
      .string()
      .max(foundationRequestLastErrorTypeMax)
      .nullable(),
    status: zod
      .enum(["pending", "processing", "completed", "failed"])
      .describe("Current local walking-skeleton processing state."),
    updatedAt: zod.iso.datetime({ offset: true }),
  })
  .describe(
    "Synthetic, non-customer request used only to prove the local Phase 1 system path.",
  );

export type FoundationRequest = zod.input<typeof FoundationRequest>;
export type FoundationRequestOutput = zod.output<typeof FoundationRequest>;
