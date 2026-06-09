# Estructura del proyecto

Monorepo **pnpm** con dos aplicaciones. La estructura **interna** de cada app sigue las **convenciones de su framework** (Medusa / Next.js los descubren por ubicación; no se renombran).

## Nivel superior (monorepo)
```
plataforma_suplementos/
├── apps/
│   ├── backend/         # Medusa v2 (API, admin, módulos custom)
│   └── storefront/      # Next.js (la tienda) — se agrega luego
├── packages/            # (futuro) código compartido entre apps
├── docs/                # specs, esquema de BD, esta guía
├── docker-compose.yml   # PostgreSQL + Redis para desarrollo
├── pnpm-workspace.yaml  # define los workspaces y builds permitidos
├── package.json         # scripts raíz (db:up, dev:backend, …)
├── .npmrc               # auto-install-peers
└── .env.example         # documenta TODAS las variables del proyecto
```

> Elección nuestra: el layout de nivel superior y pnpm como gestor.
> Obligatorio (lo impone el framework): la estructura **interna** de cada app.

## Backend (`apps/backend`) — convención Medusa v2
Medusa **descubre por carpeta**: cada pieza va en su ruta o no se carga.
```
apps/backend/
├── medusa-config.ts     # configuración central (BD, CORS, módulos)
├── .env                 # variables locales (NO se versiona)
├── instrumentation.ts   # observabilidad (Sentry, etc.)
├── src/
│   ├── modules/         # módulos custom (supplement, review, …) → models + service
│   ├── workflows/       # lógica de negocio orquestada (con compensación)
│   ├── api/             # endpoints HTTP por carpeta:
│   │   ├── store/       #   API pública (storefront)
│   │   └── admin/       #   API del panel (dueño)
│   ├── links/           # module links (relaciones entre módulos)
│   ├── subscribers/     # reacción a eventos (emails, reindex, …)
│   ├── jobs/            # tareas programadas (cron) del worker
│   ├── admin/           # extensiones del panel (widgets, UI routes)
│   └── migration-scripts/ # migraciones/seed
└── package.json
```
**Flujo de una petición:** API Route → Workflow → Service(s) de módulo(s) → BD.
La lógica de negocio vive en **workflows**, no en endpoints ni servicios.

### Cómo se ubican nuestras extensiones (Paso 2)
Cada módulo custom de [`database/extensiones.md`](database/extensiones.md) se implementa así:
- `src/modules/<nombre>/models/*` → los Data Models (tablas).
- `src/modules/<nombre>/service.ts` → su lógica.
- `src/links/*` → los module links al core (Product, Customer, …).
- `src/workflows/*`, `src/api/*`, `src/subscribers/*`, `src/admin/*` → según necesite.

## Storefront (`apps/storefront`) — convención Next.js (App Router)
Se agrega en el siguiente paso. Estructura prevista:
```
apps/storefront/
└── src/
    ├── app/         # rutas (App Router): catálogo, producto, carrito, checkout, cuenta
    ├── components/  # componentes UI (design system: Tailwind + shadcn/ui)
    └── lib/         # cliente de la Store API de Medusa, utilidades
```

## Procesos (local vs producción)
- **Local:** un solo proceso `medusa develop` (API + admin + worker juntos).
- **Producción (Railway):** dos servicios del mismo código → **web** (API/admin) y **worker** (`MEDUSA_WORKER_MODE`), más Postgres/Redis/Meilisearch.

## Puesta en marcha rápida
```bash
pnpm install            # instalar dependencias
pnpm db:up              # Postgres + Redis (Docker)
pnpm --filter backend exec medusa db:migrate   # migraciones
pnpm dev:backend        # API + admin en http://localhost:9000/app
```
> Si el install falla por memoria, anteponer `NODE_OPTIONS=--max-old-space-size=4096`.

## Estado actual (fundación — Paso 3.0)
- [x] Monorepo pnpm + Docker (Postgres/Redis)
- [x] Medusa v2 (2.15.5) scaffoldeado en `apps/backend`
- [x] Migraciones aplicadas + admin creado + servidor verificado (`/health`, `/app`, login OK)
- [ ] Storefront Next.js (`apps/storefront`)
- [ ] Módulos custom (empezando por catálogo + `supplement`)
- [ ] CI, regiones Panamá, etc.

**Credenciales admin locales:** `admin@local.test` / `supersecret123` (solo dev).
