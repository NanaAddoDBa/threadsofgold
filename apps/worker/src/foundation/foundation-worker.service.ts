import {
  Inject,
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { WorkerEnvironment } from "@threadsofgold/config/worker";
import {
  FOUNDATION_REQUEST_QUEUE_NAME,
  foundationRequestJobSchema,
  type FoundationRequestJob,
} from "@threadsofgold/contracts/foundation-request";
import {
  createDatabaseClient,
  FoundationRequestRepository,
  type DatabaseClient,
} from "@threadsofgold/database";
import {
  getErrorType,
  runWithCorrelationContext,
} from "@threadsofgold/observability";
import { Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import nodemailer, { type Transporter } from "nodemailer";

import { workerObservability } from "../instrumentation.js";
import { WorkerReadinessService } from "../operations/readiness.service.js";

interface ActiveWorkerRuntime {
  readonly database: DatabaseClient;
  readonly mailer: Transporter;
  readonly redis: Redis;
  readonly repository: FoundationRequestRepository;
  readonly worker: Worker<FoundationRequestJob>;
}

@Injectable()
export class FoundationWorkerService implements OnModuleInit, OnModuleDestroy {
  private runtime: ActiveWorkerRuntime | undefined;

  constructor(
    @Inject(ConfigService)
    private readonly configuration: ConfigService<WorkerEnvironment, true>,
    @Inject(WorkerReadinessService)
    private readonly readiness: WorkerReadinessService,
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
      throw new Error("Foundation worker dependencies were not configured.");
    }

    const database = createDatabaseClient(databaseUrl);
    const repository = new FoundationRequestRepository(database);
    const redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });
    const mailer = nodemailer.createTransport({
      host: this.configuration.get("SMTP_HOST", { infer: true }),
      port: this.configuration.get("SMTP_PORT", { infer: true }),
      secure: false,
    });
    let queueWorker: Worker<FoundationRequestJob> | undefined;

    try {
      await repository.connect();
      await redis.connect();
      await mailer.verify();
      queueWorker = new Worker<FoundationRequestJob>(
        FOUNDATION_REQUEST_QUEUE_NAME,
        (job) => this.process(job, repository, mailer),
        { concurrency: 1, connection: redis },
      );
      await queueWorker.waitUntilReady();
    } catch (error) {
      await Promise.allSettled([
        queueWorker?.close() ?? Promise.resolve(),
        mailer.close(),
        redis.quit(),
        repository.disconnect(),
      ]);
      throw error;
    }

    this.runtime = {
      database,
      mailer,
      redis,
      repository,
      worker: queueWorker,
    };
    this.readiness.setProbe(async () => {
      const runtime = this.runtime;

      if (runtime === undefined) {
        return {
          checks: [{ name: "foundation_worker", status: "down" }],
          ready: false,
        };
      }

      const checks = await Promise.all([
        runtime.repository
          .ping()
          .then(() => ({ name: "postgresql", status: "up" as const }))
          .catch(() => ({ name: "postgresql", status: "down" as const })),
        runtime.redis
          .ping()
          .then(() => ({ name: "redis", status: "up" as const }))
          .catch(() => ({ name: "redis", status: "down" as const })),
        runtime.mailer
          .verify()
          .then(() => ({ name: "smtp", status: "up" as const }))
          .catch(() => ({ name: "smtp", status: "down" as const })),
        Promise.resolve({
          name: "queue_worker",
          status: runtime.worker.isRunning()
            ? ("up" as const)
            : ("down" as const),
        }),
      ]);

      return {
        checks,
        ready: checks.every((check) => check.status === "up"),
      };
    });

    workerObservability.logger.info("Foundation queue worker connected", {
      event: "foundation_worker_connected",
      queue: FOUNDATION_REQUEST_QUEUE_NAME,
    });
  }

  async onModuleDestroy(): Promise<void> {
    const runtime = this.runtime;
    this.runtime = undefined;

    if (runtime === undefined) return;

    await runtime.worker.close();
    runtime.mailer.close();
    await runtime.redis.quit();
    await runtime.repository.disconnect();
  }

  private async process(
    job: Job<FoundationRequestJob>,
    repository: FoundationRequestRepository,
    mailer: Transporter,
  ): Promise<void> {
    const payload = foundationRequestJobSchema.parse(job.data);

    return runWithCorrelationContext(
      { correlationId: payload.correlationId },
      async () => {
        const existing = await repository.getById(payload.requestId);

        if (existing === null) {
          throw new Error("Foundation request record was not found.");
        }

        if (existing.status === "completed") {
          workerObservability.logger.info(
            "Foundation request was already completed",
            {
              event: "foundation_request_duplicate_skipped",
              request_id: payload.requestId,
            },
          );
          return;
        }

        const processing = await repository.markProcessing(payload.requestId);

        if (processing.status === "completed") {
          workerObservability.logger.info(
            "Foundation request completed during duplicate processing",
            {
              event: "foundation_request_duplicate_skipped",
              request_id: payload.requestId,
            },
          );
          return;
        }

        try {
          await mailer.sendMail({
            from: "Threads of Gold local foundation <foundation@threadsofgold.invalid>",
            subject: `Threads of Gold foundation request ${payload.requestId}`,
            text: [
              "The local Phase 1 walking-skeleton request completed.",
              `Request: ${payload.requestId}`,
              `Correlation: ${payload.correlationId}`,
              "This message contains no customer, order, or payment data.",
            ].join("\n"),
            to: this.configuration.get("FOUNDATION_NOTIFICATION_TO", {
              infer: true,
            }),
          });
          await repository.markCompleted(payload.requestId);
          workerObservability.logger.info(
            "Foundation request notification captured",
            {
              event: "foundation_request_completed",
              request_id: payload.requestId,
            },
          );
        } catch (error) {
          await repository
            .markFailed(payload.requestId, getErrorType(error))
            .catch(() => undefined);
          workerObservability.logger.error(
            "Foundation request processing failed",
            {
              event: "foundation_request_failed",
              request_id: payload.requestId,
            },
            error,
          );
          throw error;
        }
      },
    );
  }
}
