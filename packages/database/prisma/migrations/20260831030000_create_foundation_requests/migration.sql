CREATE TYPE "foundation_request_status" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TABLE "foundation_requests" (
  "id" UUID NOT NULL,
  "idempotency_key" VARCHAR(200) NOT NULL,
  "correlation_id" VARCHAR(36) NOT NULL,
  "status" "foundation_request_status" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "last_error_type" VARCHAR(120),
  "completed_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,

  CONSTRAINT "foundation_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "foundation_requests_idempotency_key_key"
  ON "foundation_requests"("idempotency_key");

CREATE INDEX "foundation_requests_status_created_at_idx"
  ON "foundation_requests"("status", "created_at");
