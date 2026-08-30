import {
  createDeterministicId,
  readExplicitTestGate,
} from "@threadsofgold/test-utils";
import { describe, expect, it } from "vitest";

describe("test foundation", () => {
  it("creates stable identifiers without randomness", () => {
    expect(createDeterministicId("catalog", 7)).toBe("catalog-0007");
    expect(createDeterministicId("catalog")).toBe("catalog-0001");
  });

  it.each([
    [undefined, false],
    ["0", false],
    ["1", true],
  ] as const)("reads the explicit test gate value %s", (value, expected) => {
    expect(readExplicitTestGate("TOG_TEST_GATE", value)).toBe(expected);
  });

  it("rejects ambiguous test gate values", () => {
    expect(() => readExplicitTestGate("TOG_TEST_GATE", "true")).toThrow(
      'TOG_TEST_GATE must be "1", "0", or unset.',
    );
  });
});
