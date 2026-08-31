import {
  correlationIdSchema,
  foundationRequestJobSchema,
} from "@threadsofgold/contracts/foundation-request";
import { describe, expect, it } from "vitest";

describe("foundation request correlation contract", () => {
  it("accepts every correlation identifier normalized by observability", () => {
    const uuid = "9f7ddb2e-fda7-493e-84a6-1212e37437bb";
    const ulid = "01ARZ3NDEKTSV4RRFFQ69G5FAV";

    expect(correlationIdSchema.parse(uuid)).toBe(uuid);
    expect(correlationIdSchema.parse(ulid)).toBe(ulid);
    expect(
      foundationRequestJobSchema.parse({
        correlationId: ulid,
        requestId: "076e287a-b66f-4a0c-90dc-815320487ef2",
      }),
    ).toMatchObject({ correlationId: ulid });
  });

  it("rejects correlation identifiers outside the shared UUID/ULID boundary", () => {
    expect(() => correlationIdSchema.parse("customer@example.com")).toThrow();
  });
});
