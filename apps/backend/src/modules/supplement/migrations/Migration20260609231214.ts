import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260609231214 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "brand" drop constraint if exists "brand_slug_unique";`);
    this.addSql(`create table if not exists "brand" ("id" text not null, "name" text not null, "slug" text not null, "logo_url" text null, "description" text null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_brand_slug_unique" ON "brand" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_deleted_at" ON "brand" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "supplement_info" ("id" text not null, "ingredientes" text null, "modo_de_uso" text null, "advertencias" text not null, "tamano_porcion" text null, "porciones_por_envase" integer null, "registro_sanitario" text null, "es_vegano" boolean not null default false, "sin_azucar" boolean not null default false, "sin_gluten" boolean not null default false, "apto_vegetariano" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "supplement_info_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_supplement_info_deleted_at" ON "supplement_info" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "variant_expiry" ("id" text not null, "expiration_date" timestamptz null, "lot_code" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "variant_expiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_variant_expiry_deleted_at" ON "variant_expiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "brand" cascade;`);

    this.addSql(`drop table if exists "supplement_info" cascade;`);

    this.addSql(`drop table if exists "variant_expiry" cascade;`);
  }

}
