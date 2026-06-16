# Operación: apagar/encender local y cómo se despliega

## 0. Lo más importante de entender
- La **tienda en producción vive en Railway** y **NO depende de tu computadora**.
  Aunque apagues tu PC, la tienda sigue **en línea** (Railway la mantiene).
- Tu **entorno local** (Docker + backend + frontend en tu PC) es **solo para
  desarrollar/probar**. Puedes apagarlo cuando no estés trabajando.

URLs de producción:
- Tienda: https://storefront-production-a6b1.up.railway.app
- Admin: https://backend-production-f80d.up.railway.app/app

---

## 1. Apagar el entorno LOCAL (al terminar de trabajar)

1. En cada terminal donde corre el **backend** y el **frontend**: presiona **Ctrl + C**.
   (Si quedaron procesos colgados, se pueden matar por puerto: 9000 backend, 8000 frontend.)
2. Detener Docker (Postgres/Redis/Meilisearch), desde la raíz del proyecto:
   ```powershell
   docker compose stop
   ```

> Esto **no afecta** la tienda en línea. Solo libera recursos de tu PC.

---

## 2. Encender el entorno LOCAL (para volver a desarrollar)

1. Abre **Docker Desktop** (que esté corriendo).
2. Levanta los contenedores, desde la raíz del proyecto:
   ```powershell
   docker compose start
   ```
3. **Backend** (una terminal):
   ```powershell
   cd apps\backend
   $env:NODE_OPTIONS="--max-old-space-size=4096"
   pnpm dev
   ```
   Espera: `Server is ready on port: 9000`. Admin local: http://localhost:9000/app
4. **Frontend** (otra terminal):
   ```powershell
   cd apps\storefront
   pnpm dev
   ```
   Tienda local: http://localhost:8000

---

## 3. Cómo se despliega a producción (Railway)

**No necesitas "desplegar" a mano.** Railway está conectado a la rama `main` de GitHub:

1. Desarrollas y pruebas en **local**.
2. Subes los cambios:
   ```powershell
   git add .
   git commit -m "descripcion del cambio"
   git push
   ```
3. Railway **redespliega solo** los servicios afectados (backend y/o storefront).
   - Si cambiaste el backend, las **migraciones de base de datos corren solas** (paso *predeploy*).
4. En 2–5 min los cambios están en línea.

### Redeploy manual (si hace falta)
- Railway → servicio (**backend** o **storefront**) → pestaña **Deployments** →
  menú **⋮** del último → **Redeploy**.
- Útil para **refrescar caché** (ej. tras cambiar fotos) sin tocar código.

---

## 4. ¿Hace falta apagar Railway?
**No.** Es la tienda en vivo; debe quedarse encendida. Railway cobra por uso
(~$5–10/mes el backend; storefront/imágenes muy poco). No se apaga al cerrar tu PC.

> Si en algún momento quieres pausar producción para ahorrar (no recomendado si
> quieres que la tienda esté accesible), se puede hacer desde Railway — pero la base
> de datos seguiría activa. Consúltalo con el equipo técnico antes.

---

## 5. Variables y secretos (recordatorio)
- Las credenciales de producción (BD, R2, Resend, etc.) viven en las **Variables de
  Railway**, **no** en el código. El `.env` local es aparte y **no se sube** a GitHub.
- Si cambias una variable en Railway, el servicio **redespliega solo**.
