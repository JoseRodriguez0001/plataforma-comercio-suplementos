# Spec — Infraestructura, entornos y deploy

- **ID módulo:** `INF`
- **Estado:** Aprobado
- **MVP:** Sí
- **Depende de:** 13-NFR; soporta a todos los módulos

## 1. Propósito
Definir **dónde y cómo se ejecuta y despliega** la plataforma: hosting del backend (Medusa), del storefront (Next.js), base de datos, caché, almacenamiento de imágenes, búsqueda, dominios, entornos y el pipeline de despliegue. Objetivo: infraestructura **barata, simple de operar y reproducible**, alineada al criterio de bajo costo y mantenibilidad.

## 2. Actores involucrados
- **Desarrollador/Operación:** configura y mantiene la infraestructura y el pipeline.
- **Dueño:** titular de las cuentas de servicios y dominio (a definir titularidad).
- **Sistema:** procesos web y worker, jobs programados.

## 3. Historias de usuario
- Como **desarrollador** quiero **desplegar desde GitHub** de forma automática y reproducible.
- Como **desarrollador** quiero **entornos separados** (dev/prod) para no romper producción.
- Como **dueño** quiero costos de infraestructura **bajos y predecibles**.
- Como **negocio** quiero un **dominio propio** con HTTPS y correo del dominio.
- Como **operación** quiero poder **revertir** un despliegue problemático rápido.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-INF-1 | **Backend Medusa** (web + worker) desplegado en **Railway**. | Debe |
| RF-INF-2 | **PostgreSQL** y **Redis** gestionados (Railway). | Debe |
| RF-INF-3 | **Storefront Next.js** desplegado en **Vercel** (CDN global). | Debe |
| RF-INF-4 | **Almacenamiento de imágenes** en **Cloudflare R2** (S3-compatible). | Debe |
| RF-INF-5 | **Búsqueda Meilisearch** desplegada (Railway) (coord. módulo 02). | Debe |
| RF-INF-6 | **Email** vía Resend (coord. módulo 10). | Debe |
| RF-INF-7 | **DNS, CDN y TLS** gestionados con **Cloudflare** + dominio propio. | Debe |
| RF-INF-8 | **Entornos separados** dev/prod con variables y datos propios (coord. RF-NFR-6). | Debe |
| RF-INF-9 | **CI/CD**: despliegue automático desde GitHub por entorno; build con lint/test. | Debe |
| RF-INF-10 | **Jobs programados** (worker): expiración de reservas, conciliación de pagos, alertas. | Debe |
| RF-INF-11 | **Rollback** / redeploy de versión anterior ante fallo. | Debería |
| RF-INF-12 | **Gestión de migraciones** de base de datos en el deploy. | Debe |
| RF-INF-13 | **Monitoreo de salud** (health checks) de los servicios. | Debería |
| RF-INF-14 | **Infra documentada** (servicios, variables, procedimiento de deploy y de go-live). | Debe |
| RF-INF-15 | **Costos estimados y alertas** de gasto donde la plataforma lo permita. | Podría |

## 5. Reglas de negocio
- El **código vive en GitHub**; los despliegues se originan desde allí (nada de subir a mano).
- **dev y prod** están aislados: distinta DB, Redis, credenciales y datos.
- Las **migraciones** se aplican de forma controlada en cada deploy; no romper datos de prod.
- Los **secretos** se gestionan por entorno en cada plataforma (coord. RF-NFR-3).
- La arquitectura prioriza **costo bajo**: sin servidores sobredimensionados; escalar cuando las ventas lo pidan.
- **Titularidad recomendada:** las cuentas de servicios y el dominio a nombre del **dueño** (evita dependencia del desarrollador) — a confirmar.

## 6. Entidades de datos involucradas
No aplica. Artefactos: definición de servicios, variables de entorno por entorno, pipeline CI/CD, documentación de operación.

## 7. Topología (resumen)
- **Vercel:** storefront Next.js (prod + previews).
- **Railway (proyecto):** Medusa web, Medusa worker, PostgreSQL, Redis, Meilisearch.
- **Cloudflare:** DNS, CDN, TLS, WAF, dominio.
- **Cloudflare R2:** imágenes de producto.
- **Resend:** email transaccional.
- **Sentry:** errores (coord. módulo 13).
- **GitHub + CI:** repos y despliegue.

## 8. Criterios de aceptación
- [ ] (RF-INF-1..7) Todos los servicios desplegados y comunicándose en prod.
- [ ] (RF-INF-8) Entorno dev independiente de prod verificado.
- [ ] (RF-INF-9) Un push a la rama correspondiente despliega automáticamente tras pasar build/lint/test.
- [ ] (RF-INF-10) Los jobs programados se ejecutan en el worker (reservas/conciliación/alertas).
- [ ] (RF-INF-12) Las migraciones se aplican en el deploy sin pérdida de datos.
- [ ] (RF-INF-11) Se puede revertir a la versión anterior ante un fallo.
- [ ] (RF-INF-14) Documentación de infraestructura y procedimiento de deploy disponible.

## 9. Fuera de alcance
- **Migración a AWS / Kubernetes** u orquestación avanzada (post-MVP, solo si la escala lo exige).
- **Multi-región** de infraestructura (post-MVP; coord. módulo 15).
- Auto-scaling avanzado y balanceadores dedicados (post-MVP).
- IaC formal (Terraform) — recomendado a futuro; MVP usa config de plataforma + documentación.

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Titularidad:** cuentas de servicios y dominio **a nombre del dueño** (evita dependencia del desarrollador).
2. **Entornos:** **dev + prod** en el MVP; staging post-MVP si hace falta.
3. **Región:** objetivo **US East (Virginia)** en Railway (mejor latencia a Panamá); confirmar el identificador exacto de región al configurar.

**Pendientes:**
- **Elegir el dominio** del negocio (se define luego).
- Confirmar nombre exacto de la región US East en Railway al momento del setup.
