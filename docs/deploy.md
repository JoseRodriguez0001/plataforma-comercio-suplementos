# Guía de despliegue — NATURZEN

Arquitectura de producción:

- **Backend (Medusa)** → Railway (servicio Node + Postgres + Redis administrados)
- **Storefront (Next.js)** → **Cloudflare Pages** (gratis, apto comercial)
- **Imágenes de producto** → Cloudflare R2 (S3-compatible)
- **Búsqueda** → **diferida** (sin Meilisearch en v1; fallback básico por BD)
- **DNS** → Cloudflare
- **Correos** → Resend (ya configurado)

> Stack elegido: todo en Cloudflare (Pages + R2 + DNS = gratis) salvo el backend en
> Railway (~$5–10/mes).

> El código ya soporta todo esto; el despliegue es sobre todo crear cuentas, cargar
> variables de entorno y conectar el repo.

---

## 1. Backend en Railway

1. Crea proyecto en https://railway.app → **New Project → Deploy from GitHub repo** (selecciona el repo).
2. Configura el servicio del backend:
   - **Root directory:** `apps/backend`
   - **Build command:** `pnpm install && pnpm build`
   - **Pre-deploy command:** `pnpm predeploy` (corre las migraciones de la BD)
   - **Start command:** `pnpm start`
3. Agrega **Postgres** y **Redis** al proyecto (Railway → *New → Database*). Railway crea las URLs internas.
4. Variables de entorno del backend (ver lista abajo).
5. Tras el primer deploy, crea el admin y siembra datos (pestaña *Shell* del servicio o `railway run`):
   ```
   npx medusa user -e tu@correo.com -p TuClaveSegura
   pnpm seed            # productos/región Panamá (opcional si ya migraste datos)
   ```

### Variables de entorno del backend (Railway)
```
DATABASE_URL=<la que da Railway Postgres>
REDIS_URL=<la que da Railway Redis>
JWT_SECRET=<secreto largo aleatorio>
COOKIE_SECRET=<secreto largo aleatorio>
STORE_CORS=https://<tu-storefront>.vercel.app
ADMIN_CORS=https://<tu-backend>.up.railway.app
AUTH_CORS=https://<tu-storefront>.vercel.app,https://<tu-backend>.up.railway.app
MEDUSA_WORKER_MODE=shared
MEDUSA_BACKEND_URL=https://<tu-backend>.up.railway.app

# Correos (Resend)
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...        # remitente verificado en producción
OWNER_EMAIL=...
STORE_NAME=NATURZEN
STOREFRONT_URL=https://<tu-storefront>.vercel.app

# Imágenes (Cloudflare R2) — ver sección 3
S3_FILE_URL=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=auto
S3_BUCKET=...
S3_ENDPOINT=...

# Búsqueda (si despliegas Meilisearch)
MEILISEARCH_HOST=...
MEILISEARCH_API_KEY=...

# Pagos (cuando tengas credenciales)
YAPPY_MERCHANT_ID=...
YAPPY_SECRET=...
PAGUELOFACIL_CCLW=...
PAGUELOFACIL_API_KEY=...
PAYMENT_MODE=production
```

> **Worker mode:** para empezar, `shared` (un solo servicio) está bien. A escala se
> separa en `server` + `worker` (dos servicios) según docs de Medusa.

---

## 2. Storefront en Cloudflare Pages

> ⚠️ **Nota técnica:** el storefront usa Next.js App Router con *server actions* y
> runtime Node. Cloudflare Pages no corre Next.js "tal cual": se usa el adaptador
> **`@opennextjs/cloudflare`** (OpenNext), que sí soporta App Router + server actions.
> Es el paso que se configura al desplegar (lo hacemos juntos).

Pasos:
1. Instalar el adaptador en `apps/storefront`:
   ```
   pnpm add -D @opennextjs/cloudflare wrangler
   ```
   y agregar `open-next.config.ts` + scripts de build/deploy de Cloudflare.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → selecciona el repo.
   - **Root directory:** `apps/storefront`
   - **Build command:** `pnpm build && pnpm exec opennextjs-cloudflare build`
   - **Output:** según OpenNext (`.open-next/`)
3. Variables de entorno (Pages → Settings → Environment variables):
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<tu-backend>.up.railway.app
   NEXT_PUBLIC_BASE_URL=https://<tu-dominio-o-pages-url>
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key del backend>
   NEXT_PUBLIC_DEFAULT_REGION=pa
   ```
4. El **publishable key** se obtiene en el admin (Settings → Publishable API Keys).
5. Deploy. Cloudflare te da una URL `*.pages.dev`; úsala en los CORS del backend.

> **Alternativa más simple (si OpenNext da problemas):** desplegar el storefront como
> servicio Node en **Railway** (igual que el backend). Cuesta un poco más pero es
> directo y apto comercial. Lo dejamos como plan B.

> `next.config.js` ya permite imágenes de `localhost` y de S3/R2 (vía `S3_HOSTNAME`).
> Define `S3_HOSTNAME`/`S3_PATHNAME` si las imágenes vienen de R2 con dominio propio.

---

## 3. Imágenes en Cloudflare R2

1. Cloudflare → **R2** → *Create bucket* (ej. `naturzen-media`).
2. Crea un **API Token R2** (Access Key ID + Secret).
3. Activa acceso público al bucket (o un dominio R2 público) para servir las imágenes.
4. Variables en el backend (Railway):
   ```
   S3_BUCKET=naturzen-media
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=...
   S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
   S3_FILE_URL=https://<dominio-publico-del-bucket>
   S3_REGION=auto
   ```
5. `medusa-config.ts` ya activa R2 automáticamente cuando existen `S3_BUCKET` y
   `S3_ACCESS_KEY_ID` (si no, usa almacenamiento local). **Las imágenes que subas en el
   admin irán a R2** y persistirán entre redeploys.

> ⚠️ Las fotos subidas en local (`localhost:9000/static/...`) **no migran solas**.
> En producción hay que volver a subirlas (o migrarlas al bucket) una vez con R2 activo.

---

## 4. Búsqueda — DIFERIDA en v1

Decisión: lanzamos **sin Meilisearch** para ahorrar compute. El endpoint
`/store/search` tiene un **fallback automático**: si `MEILISEARCH_HOST` no está
definido, busca por título directamente en la BD. El buscador del storefront sigue
funcionando (búsqueda básica), solo que sin facetas/relevancia avanzada.

**Para activar Meilisearch más adelante:**
- Self-host en Railway: servicio con imagen `getmeili/meilisearch:v1.10`,
  `MEILI_MASTER_KEY=<clave>`, volumen para persistencia.
- Define `MEILISEARCH_HOST` y `MEILISEARCH_API_KEY` en el backend → el fallback se
  desactiva solo y se usa Meilisearch. Reindexa (subscribers de producto / script).

---

## 5. Checklist de salida a producción

- [ ] Backend desplegado en Railway con Postgres + Redis.
- [ ] Migraciones aplicadas (`predeploy`).
- [ ] Usuario admin creado.
- [ ] Productos/región cargados (seed o migración de datos).
- [ ] R2 activo y fotos de producto subidas.
- [ ] Storefront en Cloudflare Pages apuntando al backend (publishable key + CORS correctos).
- [ ] Búsqueda: fallback por BD activo (Meilisearch diferido).
- [ ] Resend con **dominio verificado** y remitente propio.
- [ ] Credenciales de Yappy/PagueloFácil en `PAYMENT_MODE=production`.
- [ ] Dominio definitivo conectado (DNS en Cloudflare).
- [ ] Probar una compra real de extremo a extremo.
