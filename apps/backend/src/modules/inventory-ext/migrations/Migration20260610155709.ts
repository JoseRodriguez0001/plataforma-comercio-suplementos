import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260610155709 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "inventory_adjustment" ("id" text not null, "inventory_item_id" text not null, "variant_id" text null, "delta" integer not null, "reason" text check ("reason" in ('restock', 'shrinkage', 'correction', 'other')) not null, "note" text null, "admin_user_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inventory_adjustment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inventory_adjustment_deleted_at" ON "inventory_adjustment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "stock_alert_setting" ("id" text not null, "scope" text check ("scope" in ('global', 'variant')) not null default 'global', "variant_id" text null, "low_stock_threshold" integer not null default 5, "expiry_alert_days" integer not null default 30, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "stock_alert_setting_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_stock_alert_setting_deleted_at" ON "stock_alert_setting" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "inventory_adjustment" cascade;`);

    this.addSql(`drop table if exists "stock_alert_setting" cascade;`);
  }

}
