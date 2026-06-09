# Plataforma Suplementos

Tienda online de suplementos para Panamá. Monorepo **Medusa v2** (backend headless de commerce) + **Next.js** (storefront), con PostgreSQL y Redis.

> Documentación del proyecto en [`docs/`](docs/): especificaciones por módulo ([`docs/specs/`](docs/specs/)), esquema de base de datos ([`docs/database/`](docs/database/)) y estructura del código ([`docs/estructura-proyecto.md`](docs/estructura-proyecto.md)).

## Stack
- **Backend:** Medusa v2 (TypeScript) — `apps/backend`
- **Storefront:** Next.js (App Router) — `apps/storefront`
- **BD / caché:** PostgreSQL + Redis (Docker en local)
- **Infra (prod):** Railway (backend) · Vercel (storefront) · Cloudflare R2 (imágenes) · Resend (email)

## Requisitos
- Node.js >= 20 (probado con 22)
- pnpm >= 9 (probado con 11)
- Docker Desktop (para Postgres + Redis en local)

## Puesta en marcha (local)
```bash
# 1. Instalar dependencias del monorepo
pnpm install

# 2. Levantar PostgreSQL + Redis
pnpm db:up

# 3. Configurar entorno
#    Copiar .env.example a apps/backend/.env y apps/storefront/.env.local y completar

# 4. Migraciones + admin (backend)
pnpm --filter backend medusa db:migrate
pnpm --filter backend medusa user -e admin@local.test -p supersecret

# 5. Arrancar
pnpm dev:backend      # API + admin en http://localhost:9000
pnpm dev:storefront   # tienda en http://localhost:8000
```

## Estructura
```
apps/
  backend/      # Medusa v2 (API, admin, módulos custom)
  storefront/   # Next.js (la tienda)
docs/           # specs, esquema de BD, estructura
docker-compose.yml  # Postgres + Redis (dev)
```
Detalle en [`docs/estructura-proyecto.md`](docs/estructura-proyecto.md).

## Scripts útiles (raíz)
| Script | Acción |
|---|---|
| `pnpm db:up` / `pnpm db:down` | Levantar / apagar Postgres+Redis |
| `pnpm dev:backend` | Arranca Medusa (API + admin) |
| `pnpm dev:storefront` | Arranca el storefront Next.js |
