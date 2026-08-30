import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";

export const REDIS_TEST_IMAGE =
  "redis:8.2.9-alpine3.22@sha256:30abb90e62f14b737010746def3ba99cc79fe19dcdb3d37b41f21fc62e7da19d";

export interface RedisTestContainerOptions {
  image?: string;
  password?: string;
}

export async function startRedisTestContainer(
  options: RedisTestContainerOptions = {},
): Promise<StartedRedisContainer> {
  return new RedisContainer(options.image ?? REDIS_TEST_IMAGE)
    .withPassword(options.password ?? "integration-test-only")
    .start();
}
