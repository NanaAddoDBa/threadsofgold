import { z } from "./zod.js";

export const serviceFoundationSchema = z
  .object({
    service: z.literal("threads-of-gold-api").meta({
      description: "Stable service identifier.",
      example: "threads-of-gold-api",
    }),
    status: z.literal("foundation").meta({
      description: "Current engineering-foundation status.",
      example: "foundation",
    }),
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/)
      .meta({
        description:
          "Semantic application version, separate from a release ID.",
        example: "0.1.0",
      }),
  })
  .meta({
    id: "ServiceFoundation",
    description: "Public metadata for the versioned Threads of Gold API.",
  });

export type ServiceFoundation = z.infer<typeof serviceFoundationSchema>;
