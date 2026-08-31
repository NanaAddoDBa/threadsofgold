import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

export const POSTGRESQL_TEST_IMAGE =
  "postgres:17.11-alpine3.24@sha256:18cfe3ef5e6815560c98237d6216d1e5119702fb0f3894c8785dd58b8bbe5d73";

export interface PostgreSqlTestContainerOptions {
  database?: string;
  image?: string;
  password?: string;
  username?: string;
}

export async function startPostgreSqlTestContainer(
  options: PostgreSqlTestContainerOptions = {},
): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer(options.image ?? POSTGRESQL_TEST_IMAGE)
    .withDatabase(options.database ?? "threadsofgold_test")
    .withUsername(options.username ?? "threadsofgold_test")
    .withPassword(options.password ?? "integration-test-only")
    .start();
}
