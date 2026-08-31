import * as zod from "zod";

export const serviceFoundationVersionRegExp = new RegExp(
  "^\\d+\\.\\d+\\.\\d+$",
);

export const ServiceFoundation = zod
  .strictObject({
    service: zod
      .enum(["threads-of-gold-api"])
      .describe("Stable service identifier."),
    status: zod
      .enum(["foundation"])
      .describe("Current engineering-foundation status."),
    version: zod
      .string()
      .regex(serviceFoundationVersionRegExp)
      .describe("Semantic application version, separate from a release ID."),
  })
  .describe("Public metadata for the versioned Threads of Gold API.");

export type ServiceFoundation = zod.input<typeof ServiceFoundation>;
export type ServiceFoundationOutput = zod.output<typeof ServiceFoundation>;
