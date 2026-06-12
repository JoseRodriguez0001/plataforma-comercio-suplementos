import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260612152547 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customer_consent" ("id" text not null, "customer_id" text not null, "consent_type" text check ("consent_type" in ('privacy_policy', 'marketing', 'cookies')) not null, "granted" boolean not null default false, "policy_version" text null, "granted_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_consent_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_consent_deleted_at" ON "customer_consent" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_consent" cascade;`);
  }

}
