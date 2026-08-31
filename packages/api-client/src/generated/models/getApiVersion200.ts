import * as zod from "zod";

export const GetApiVersion200 = zod.strictObject({
  environment: zod.string(),
  release: zod.string(),
  service: zod.string(),
  version: zod.string(),
});

export type GetApiVersion200 = zod.input<typeof GetApiVersion200>;
export type GetApiVersion200Output = zod.output<typeof GetApiVersion200>;
