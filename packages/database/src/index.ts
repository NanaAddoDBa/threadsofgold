export interface DatabaseHealth {
  readonly status: "available" | "unavailable";
  readonly latencyMs?: number;
}

export interface DatabaseLifecycle {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  health(): Promise<DatabaseHealth>;
}

export interface DatabaseTransactionContext {
  readonly transactionId: string;
}

export { createDatabaseClient, type DatabaseClient } from "./client.js";
export {
  FoundationRequestRepository,
  type CreateFoundationRequestInput,
  type FoundationRequestRecord,
  type FoundationRequestStatus,
} from "./foundation-request-repository.js";
