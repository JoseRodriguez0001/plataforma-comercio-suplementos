import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260611154600 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "fulfillment_detail" ("id" text not null, "method" text check ("method" in ('shipping', 'pickup')) not null, "carrier_id" text null, "tracking_number" text null, "shipped_at" timestamptz null, "estimated_delivery_at" timestamptz null, "delivery_note" text null, "ready_for_pickup_at" timestamptz null, "picked_up_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_detail_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fulfillment_detail_deleted_at" ON "fulfillment_detail" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "shipping_carrier" ("id" text not null, "name" text not null, "is_active" boolean not null default true, "sort_order" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_carrier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shipping_carrier_deleted_at" ON "shipping_carrier" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fulfillment_detail" cascade;`);

    this.addSql(`drop table if exists "shipping_carrier" cascade;`);
  }

}
