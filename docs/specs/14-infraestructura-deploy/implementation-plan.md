# Plan de implementación — Infraestructura, entornos y deploy

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
Infraestructura **gestionada (PaaS)** para minimizar operación: Railway aloja Medusa (web + worker), Postgres, Redis y Meilisearch en un solo proyecto; Vercel aloja el storefront con CDN y previews; Cloudflare gestiona dominio/DNS/TLS/WAF y R2 guarda imágenes. Despliegue **GitOps**: cada push a la rama del entorno dispara build (con lint/test) y deploy automático. Las migraciones de Medusa corren en el arranque/deploy. Todo queda **documentado** para que el dueño no dependa de conocimiento implícito.

## 2. Servicios y configuración
- **Railway:** servicio web Medusa, servicio worker Medusa, Postgres, Redis, Meilisearch; variables por entorno; backups de Postgres (15 días, módulo 13).
- **Vercel:** proyecto del storefront; producción + preview por PR; variables por entorno.
- **Cloudflare:** dominio, DNS, TLS, WAF/rate limiting; R2 (bucket de imágenes) con credenciales S3.
- **Resend:** dominio verificado (SPF/DKIM) (módulo 10).
- **Sentry:** proyectos backend/frontend (módulo 13).
- **GitHub Actions:** pipeline de lint/test/build; despliegue por integración nativa de Railway/Vercel.

## 3. Entornos
- **dev:** base/redis/meili propios, credenciales sandbox (pagos mock), datos de prueba.
- **prod:** servicios productivos, credenciales reales, backups, observabilidad.
- (Opcional/post-MVP) **staging** si el negocio lo requiere.

## 4. Desglose de tareas
- [ ] Crear proyecto Railway: Medusa web + worker + Postgres + Redis + Meilisearch (RF-INF-1,2,5).
- [ ] Crear proyecto Vercel del storefront con previews (RF-INF-3).
- [ ] Configurar Cloudflare: dominio, DNS, TLS, WAF (RF-INF-7).
- [ ] Configurar R2 + credenciales S3 para imágenes (RF-INF-4).
- [ ] Configurar Resend + verificación de dominio (RF-INF-6).
- [ ] Variables de entorno por entorno (dev/prod) y gestión de secretos (RF-INF-8).
- [ ] Pipeline CI (lint/test/build) + despliegue automático desde GitHub (RF-INF-9).
- [ ] Migraciones en el deploy (RF-INF-12).
- [ ] Configurar jobs programados en el worker (reservas/conciliación/alertas) (RF-INF-10).
- [ ] Health checks y rollback/redeploy (RF-INF-11,13).
- [ ] Documentación de infraestructura, deploy y **checklist de go-live** (RF-INF-14).
- [ ] (Si aplica) alertas de costo (RF-INF-15).

## 5. Orden de trabajo y dependencias
**Primero del proyecto** (la base sobre la que todo corre). Secuencia: Railway (DB/Redis/Medusa) → repos + CI/CD → Vercel (storefront) → Cloudflare + R2 + Resend → entornos/secretos → jobs → health/rollback → documentación.
Habilita el desarrollo de todos los módulos y el go-live.

## 6. Estrategia de pruebas
- **Deploy:** push dispara build+deploy; verificar que prod no se afecta desde dev.
- **Migraciones:** aplicar en un entorno con datos y verificar integridad.
- **Jobs:** confirmar ejecución programada en el worker.
- **Rollback:** simular fallo y revertir a versión previa.
- **Conectividad:** storefront↔backend↔DB/Redis/Meili/R2 en prod.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Dependencia del desarrollador (titularidad) | Dueño atado | Cuentas/dominio a nombre del dueño; acceso delegado. |
| Migración rompe datos de prod | Incidente | Probar migraciones en dev; backups previos; deploy controlado. |
| Costos inesperados | Sobre-gasto | Servicios pequeños + alertas de costo + revisar uso. |
| Latencia a Panamá | UX lenta | CDN (Vercel/Cloudflare) global; backend en región US cercana. |
| Lock-in de PaaS | Costo de cambio futuro | Apps portables (contenedores/Node estándar); evitar features propietarias. |

## 8. Definición de "hecho"
- [ ] RF-INF "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Todos los servicios en prod, comunicándose, con dominio + HTTPS.
- [ ] dev y prod aislados; CI/CD desplegando desde GitHub.
- [ ] Migraciones y jobs programados funcionando; rollback probado.
- [ ] Infraestructura y procedimiento de go-live documentados.
