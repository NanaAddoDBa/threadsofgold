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
