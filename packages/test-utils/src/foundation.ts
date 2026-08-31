export function createDeterministicId(namespace: string, sequence = 1): string {
  return `${namespace}-${String(sequence).padStart(4, "0")}`;
}

export function readExplicitTestGate(
  name: string,
  value: string | undefined,
): boolean {
  if (value === undefined || value === "0") {
    return false;
  }

  if (value === "1") {
    return true;
  }

  throw new Error(`${name} must be "1", "0", or unset.`);
}
