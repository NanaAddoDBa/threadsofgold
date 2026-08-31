import * as zod from "zod";

export const GetApiReadiness503 = zod.strictObject({
  service: zod.string(),
  status: zod.string(),
  timestamp: zod.iso.datetime({ offset: true }),
});

export type GetApiReadiness503 = zod.input<typeof GetApiReadiness503>;
export type GetApiReadiness503Output = zod.output<typeof GetApiReadiness503>;
