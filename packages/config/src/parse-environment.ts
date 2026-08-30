import type { z } from "zod";

interface EnvironmentIssue {
  readonly message: string;
  readonly path: PropertyKey[];
}

function formatIssuePath(path: PropertyKey[]): string {
  return path.length > 0 ? path.map(String).join(".") : "configuration";
}

export class EnvironmentValidationError extends Error {
  constructor(applicationName: string, issues: readonly EnvironmentIssue[]) {
    const details = issues
      .map((issue) => `${formatIssuePath(issue.path)}: ${issue.message}`)
      .join("; ");

    super(`Invalid ${applicationName} environment configuration: ${details}`);
    this.name = "EnvironmentValidationError";
  }
}

export function parseEnvironment<TSchema extends z.ZodType>(
  applicationName: string,
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new EnvironmentValidationError(applicationName, result.error.issues);
  }

  return result.data;
}
