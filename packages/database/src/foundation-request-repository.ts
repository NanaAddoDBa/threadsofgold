import {
  FoundationRequestStatus as PrismaFoundationRequestStatus,
  Prisma,
  type FoundationRequest,
} from "./generated/prisma/client.js";

import type { DatabaseClient } from "./client.js";

export type FoundationRequestStatus =
  "pending" | "processing" | "completed" | "failed";

export interface FoundationRequestRecord {
  readonly attempts: number;
  readonly completedAt: Date | null;
  readonly correlationId: string;
  readonly createdAt: Date;
  readonly id: string;
  readonly lastErrorType: string | null;
  readonly status: FoundationRequestStatus;
  readonly updatedAt: Date;
}

export interface CreateFoundationRequestInput {
  readonly correlationId: string;
  readonly id: string;
  readonly idempotencyKey: string;
}

export interface CreateFoundationRequestResult {
  readonly created: boolean;
  readonly record: FoundationRequestRecord;
}

function mapStatus(
  status: PrismaFoundationRequestStatus,
): FoundationRequestStatus {
  switch (status) {
    case PrismaFoundationRequestStatus.PENDING:
      return "pending";
    case PrismaFoundationRequestStatus.PROCESSING:
      return "processing";
    case PrismaFoundationRequestStatus.COMPLETED:
      return "completed";
    case PrismaFoundationRequestStatus.FAILED:
      return "failed";
  }
}

function mapRecord(record: FoundationRequest): FoundationRequestRecord {
  return {
    attempts: record.attempts,
    completedAt: record.completedAt,
    correlationId: record.correlationId,
    createdAt: record.createdAt,
    id: record.id,
    lastErrorType: record.lastErrorType,
    status: mapStatus(record.status),
    updatedAt: record.updatedAt,
  };
}

export class FoundationRequestRepository {
  constructor(private readonly database: DatabaseClient) {}

  async connect(): Promise<void> {
    await this.database.$connect();
  }

  async disconnect(): Promise<void> {
    await this.database.$disconnect();
  }

  async ping(): Promise<void> {
    await this.database.$queryRaw`SELECT 1`;
  }

  async createOrGet(
    input: CreateFoundationRequestInput,
  ): Promise<CreateFoundationRequestResult> {
    const existing = await this.database.foundationRequest.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });

    if (existing !== null) {
      return { created: false, record: mapRecord(existing) };
    }

    try {
      const created = await this.database.foundationRequest.create({
        data: input,
      });

      return { created: true, record: mapRecord(created) };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const concurrent = await this.database.foundationRequest.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
        });

        if (concurrent !== null) {
          return { created: false, record: mapRecord(concurrent) };
        }
      }

      throw error;
    }
  }

  async getById(id: string): Promise<FoundationRequestRecord | null> {
    const record = await this.database.foundationRequest.findUnique({
      where: { id },
    });

    return record === null ? null : mapRecord(record);
  }

  async markProcessing(id: string): Promise<FoundationRequestRecord> {
    await this.database.foundationRequest.updateMany({
      data: {
        attempts: { increment: 1 },
        lastErrorType: null,
        status: PrismaFoundationRequestStatus.PROCESSING,
      },
      where: {
        id,
        status: { not: PrismaFoundationRequestStatus.COMPLETED },
      },
    });
    const updated = await this.database.foundationRequest.findUniqueOrThrow({
      where: { id },
    });

    return mapRecord(updated);
  }

  async markCompleted(id: string): Promise<FoundationRequestRecord> {
    const updated = await this.database.foundationRequest.update({
      data: {
        completedAt: new Date(),
        lastErrorType: null,
        status: PrismaFoundationRequestStatus.COMPLETED,
      },
      where: { id },
    });

    return mapRecord(updated);
  }

  async markFailed(
    id: string,
    lastErrorType: string,
  ): Promise<FoundationRequestRecord> {
    await this.database.foundationRequest.updateMany({
      data: {
        lastErrorType: lastErrorType.slice(0, 120),
        status: PrismaFoundationRequestStatus.FAILED,
      },
      where: {
        id,
        status: { not: PrismaFoundationRequestStatus.COMPLETED },
      },
    });
    const updated = await this.database.foundationRequest.findUniqueOrThrow({
      where: { id },
    });

    return mapRecord(updated);
  }
}
