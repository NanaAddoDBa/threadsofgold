import { randomUUID } from "node:crypto";

import {
  Inject,
  Injectable,
  NotFoundException,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ApiEnvironment } from "@threadsofgold/config/api";
import {
  FOUNDATION_REQUEST_JOB_NAME,
  FOUNDATION_REQUEST_QUEUE_NAME,
  foundationRequestSchema,
  type FoundationRequest,
  type FoundationRequestJob,
} from "@threadsofgold/contracts/foundation-request";
import {
  createDatabaseClient,
  FoundationRequestRepository,
  type DatabaseClient,
  type FoundationRequestRecord,
} from "@threadsofgold/database";
import { getCorrelationContext } from "@threadsofgold/observability";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

import { HealthService } from "../operations/health.service.js";

interface ActiveFoundationRuntime {
  readonly database: DatabaseClient;
  readonly queue: Queue<FoundationRequestJob>;
  readonly redis: Redis;
  readonly repository: FoundationRequestRepository;
}

function toContract(record: FoundationRequestRecord): FoundationRequest {
  return foundationRequestSchema.parse({
    attempts: record.attempts,
    completedAt: record.completedAt?.toISOString() ?? null,
    correlationId: record.correlationId,
    createdAt: record.createdAt.toISOString(),
    id: record.id,
    lastErrorType: record.lastErrorType,
    status: record.status,
    updatedAt: record.updatedAt.toISOString(),
  });
}

@Injectable()
export class FoundationRuntimeService implements OnModuleInit, OnModuleDestroy {
  private runtime: ActiveFoundationRuntime | undefined;

  constructor(
    @Inject(ConfigService)
    private readonly configuration: ConfigService<ApiEnvironment, true>,
    @Inject(HealthService)
    private readonly health: HealthService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (
      !this.configuration.get("FOUNDATION_RUNTIME_ENABLED", { infer: true })
    ) {
      return;
    }

    const databaseUrl = this.configuration.get("DATABASE_URL", { infer: true });
    const redisUrl = this.configuration.get("REDIS_URL", { infer: true });

    if (databaseUrl === undefined || redisUrl === undefined) {
      throw new Error("Foundation runtime dependencies were not configured.");
    }

    const database = createDatabaseClient(databaseUrl);
    const repository = new FoundationRequestRepository(database);
    const redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });
    let queue: Queue<FoundationRequestJob> | undefined;

    try {
      await repository.connect();
      await redis.connect();
      queue = new Queue<FoundationRequestJob>(FOUNDATION_REQUEST_QUEUE_NAME, {
        connection: redis,
      });
      await queue.waitUntilReady();
    } catch (error) {
      await Promise.allSettled([
        queue?.close() ?? Promise.resolve(),
        redis.quit(),
        repository.disconnect(),
      ]);
      throw error;
    }

    this.runtime = { database, queue, redis, repository };
    this.health.setReadinessProbe(async () => {
      const checks = await Promise.all([
        repository
          .ping()
          .then(() => ({ name: "postgresql", status: "up" as const }))
          .catch(() => ({ name: "postgresql", status: "down" as const })),
        redis
          .ping()
          .then(() => ({ name: "redis", status: "up" as const }))
          .catch(() => ({ name: "redis", status: "down" as const })),
      ]);

      return {
        checks,
        ready: checks.every((check) => check.status === "up"),
      };
    });
  }

  async onModuleDestroy(): Promise<void> {
    const runtime = this.runtime;
    this.runtime = undefined;

    if (runtime === undefined) return;

    await Promise.allSettled([
      runtime.queue.close(),
      runtime.redis.quit(),
      runtime.repository.disconnect(),
    ]);
  }

  async createOrGet(idempotencyKey: string): Promise<FoundationRequest> {
    const runtime = this.requireRuntime();
    const correlationId =
      getCorrelationContext()?.correlationId ?? randomUUID();
    const result = await runtime.repository.createOrGet({
      correlationId,
      id: randomUUID(),
      idempotencyKey,
    });

    if (result.record.status !== "completed") {
      await runtime.queue.add(
        FOUNDATION_REQUEST_JOB_NAME,
        {
          correlationId: result.record.correlationId,
          requestId: result.record.id,
        },
        {
          attempts: 3,
          backoff: { delay: 500, type: "exponential" },
          jobId: result.record.id,
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 1000 },
        },
      );
    }

    return toContract(result.record);
  }

  async getById(id: string): Promise<FoundationRequest | null> {
    const record = await this.requireRuntime().repository.getById(id);

    return record === null ? null : toContract(record);
  }

  private requireRuntime(): ActiveFoundationRuntime {
    if (this.runtime === undefined) {
      throw new NotFoundException();
    }

    return this.runtime;
  }
}
