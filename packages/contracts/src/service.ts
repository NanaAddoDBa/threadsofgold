import { z } from "zod";

export const serviceFoundationSchema = z.object({
  service: z.literal("threads-of-gold-api"),
  status: z.literal("foundation"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/u),
});

export type ServiceFoundation = z.infer<typeof serviceFoundationSchema>;
