import * as zod from "zod";

export const GetApiReadiness200 = zod.strictObject({
  service: zod.string(),
  status: zod.string(),
  timestamp: zod.iso.datetime({ offset: true }),
});

export type GetApiReadiness200 = zod.input<typeof GetApiReadiness200>;
export type GetApiReadiness200Output = zod.output<typeof GetApiReadiness200>;
