export function createDeterministicId(namespace: string, sequence = 1): string {
  return `${namespace}-${String(sequence).padStart(4, "0")}`;
}
