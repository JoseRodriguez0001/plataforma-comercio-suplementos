# Plan de implementación — Requisitos no funcionales

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
Los NFR se logran **mayormente por configuración de plataforma + buenas prácticas**, no por código de negocio. Railway/Vercel/Cloudflare aportan TLS, variables de entorno y backups gestionados; Medusa/Next.js aportan protecciones base (validación, auth); se suman observabilidad (Sentry), CI en GitHub y una **revisión de seguridad** previa al go-live. Se documenta una **checklist de go-live** que verifica cada RF-NFR.

## 2. Tecnologías / servicios usados
- **TLS:** Vercel + Railway + Cloudflare (certificados gestionados).
- **Secretos:** variables de entorno de cada plataforma; nunca en repo.
- **Backups:** Postgres gestionado (Railway) con snapshots automáticos.
- **Observabilidad:** Sentry (errores) + logs estructurados de Medusa.
- **CI:** GitHub Actions (lint, test, build) — coord. módulo 14.
- **Rate limiting / WAF:** Cloudflare + límites en endpoints sensibles.

## 3. Prácticas / configuraciones
- Separación **dev/prod** (proyectos/bases distintas).
- Política de **contraseñas** y hashing (vía Auth de Medusa).
- **Validación** de entradas y protección XSS/CSRF (base del framework + revisión).
- **Consentimiento y borrado** de datos personales (coord. módulos 08/10).
- **Restauración de backup** probada antes del go-live.
- **Actualización** de dependencias con vulnerabilidades críticas.

## 4. Desglose de tareas
- [ ] Forzar HTTPS en storefront/admin/API (RF-NFR-1).
- [ ] Revisión: cero almacenamiento de tarjeta; SAQ-A (RF-NFR-2).
- [ ] Gestión de secretos por entorno + doc de rotación (RF-NFR-3).
- [ ] Medidas Ley 81: consentimiento, acceso/borrado, minimización (RF-NFR-4).
- [ ] Backups automáticos + prueba de restauración documentada (RF-NFR-5).
- [ ] Entornos dev/prod separados (RF-NFR-6).
- [ ] Optimización de rendimiento / Core Web Vitals (RF-NFR-7 — coord. 11/12).
- [ ] Sentry + logs + trazas de pago (RF-NFR-9).
- [ ] Rate limiting en login/pago/webhooks (RF-NFR-10).
- [ ] **2FA + bloqueo por intentos para el admin** (RF-NFR-16 — coord. módulo 09).
- [ ] Revisión de validación/sanitización (RF-NFR-11).
- [ ] CI en GitHub + actualización de dependencias (RF-NFR-13).
- [ ] Aviso de cookies si aplica (RF-NFR-15 — coord. 16).
- [ ] **Checklist de go-live** que agrupa la verificación de todos los NFR.

## 5. Orden de trabajo y dependencias
Transversal y continuo. Base temprana: entornos separados + secretos + TLS + CI. Durante el desarrollo: observabilidad, rate limiting, Ley 81. Antes del go-live: backups probados, revisión de seguridad y rendimiento, checklist.

## 6. Estrategia de pruebas
- **Seguridad:** revisión manual + escáner de dependencias; pruebas de rate limiting.
- **Backups:** ejercicio real de restauración.
- **Rendimiento:** Lighthouse/Core Web Vitals; pruebas de carga básicas en endpoints clave.
- **Privacidad:** prueba de flujo de consentimiento y borrado de datos.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Backup no restaurable | Pérdida de datos | Probar restauración antes del go-live; no confiar en backups no verificados. |
| Fuga de secretos | Compromiso grave | Solo en entorno; revisión de que nada se filtró al repo; rotación. |
| Incumplimiento Ley 81 | Riesgo legal | Consentimiento + borrado + minimización desde el diseño. |
| Mala performance móvil | Pérdida de ventas | SSR/CDN + imágenes optimizadas + medición continua. |

## 8. Definición de "hecho"
- [ ] RF-NFR "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Checklist de go-live de NFR completada.
- [ ] Backup probado mediante restauración real.
- [ ] Revisión de seguridad sin hallazgos críticos.
- [ ] Observabilidad activa (errores y trazas de pago).
- [ ] Core Web Vitals en verde en móvil.
