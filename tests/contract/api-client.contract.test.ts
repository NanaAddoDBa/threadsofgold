import { createFoundationRequest } from "@threadsofgold/api-client";
import { describe, expect, it } from "vitest";

describe("generated foundation API client", () => {
  it("returns declared error responses without applying the success schema", async () => {
    const response = await createFoundationRequest(undefined, async () =>
      Response.json(
        {
          error: "Not Found",
          message: "Not Found",
          statusCode: 404,
        },
        { status: 404 },
      ),
    );

    expect(response).toMatchObject({
      data: { error: "Not Found", statusCode: 404 },
      status: 404,
    });
  });
});
