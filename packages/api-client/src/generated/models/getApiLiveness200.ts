import * as zod from "zod";

export const GetApiLiveness200 = zod.strictObject({
  service: zod.string(),
  status: zod.string(),
  timestamp: zod.iso.datetime({ offset: true }),
});

export type GetApiLiveness200 = zod.input<typeof GetApiLiveness200>;
export type GetApiLiveness200Output = zod.output<typeof GetApiLiveness200>;
