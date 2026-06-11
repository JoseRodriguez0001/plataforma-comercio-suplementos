import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260611153141 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "payment_attempt_log" drop constraint if exists "payment_attempt_log_idempotency_key_unique";`);
    this.addSql(`create table if not exists "payment_attempt_log" ("id" text not null, "provider" text check ("provider" in ('mock', 'yappy', 'paguelofacil', 'stripe')) not null, "order_id" text null, "payment_collection_id" text null, "idempotency_key" text null, "external_reference" text null, "event_type" text not null, "status" text check ("status" in ('pending', 'success', 'failed', 'canceled', 'refunded')) not null default 'pending', "amount" integer null, "raw_payload" jsonb null, "signature_valid" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "payment_attempt_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_payment_attempt_log_idempotency_key_unique" ON "payment_attempt_log" ("idempotency_key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_payment_attempt_log_deleted_at" ON "payment_attempt_log" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "payment_attempt_log" cascade;`);
  }

}
