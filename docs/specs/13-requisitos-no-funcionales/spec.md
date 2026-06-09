# Spec — Requisitos no funcionales (seguridad, rendimiento, datos)

- **ID módulo:** `NFR`
- **Estado:** Aprobado
- **MVP:** Sí
- **Depende de:** transversal a todos los módulos

## 1. Propósito
Definir las **cualidades del sistema** (no funcionalidades concretas) que hacen la tienda **segura, rápida, disponible y conforme a la ley**: seguridad y protección de datos (Ley 81 Panamá), rendimiento, disponibilidad/respaldo, observabilidad y mantenibilidad. Son requisitos verificables que aplican a todos los módulos.

## 2. Actores involucrados
- **Todos los actores** se benefician (clientes, dueño, sistema), pero estos requisitos los implementa y verifica el **desarrollador/operación**.

## 3. Historias de usuario
- Como **cliente** quiero que mis datos personales y de pago estén **seguros**.
- Como **cliente** quiero que la tienda **cargue rápido** aunque esté en datos móviles.
- Como **dueño** quiero que la tienda esté **disponible** y que los datos tengan **respaldo** ante fallos.
- Como **dueño** quiero **cumplir la ley** de protección de datos de Panamá.
- Como **desarrollador** quiero **observabilidad** (logs/errores) para diagnosticar problemas rápido.

## 4. Requisitos (no funcionales)
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-NFR-1 | **HTTPS/TLS** en todo el tráfico (storefront, admin, API). | Debe |
| RF-NFR-2 | **Sin PCI en alcance propio**: no se almacenan datos de tarjeta; tokenización en la pasarela (SAQ-A). | Debe |
| RF-NFR-3 | **Secretos fuera del repo**: solo variables de entorno; rotación documentada. | Debe |
| RF-NFR-4 | **Protección de datos (Ley 81 Panamá):** consentimiento, finalidad, acceso/borrado, minimización. | Debe |
| RF-NFR-5 | **Backups automáticos** de PostgreSQL con retención definida y restauración probada. | Debe |
| RF-NFR-6 | **Entornos separados** (desarrollo / producción) con datos y credenciales distintos. | Debe |
| RF-NFR-7 | **Rendimiento**: Core Web Vitals en verde en móvil; API con tiempos de respuesta razonables. | Debe |
| RF-NFR-8 | **Disponibilidad** objetivo razonable para el MVP; degradación elegante ante fallos parciales. | Debería |
| RF-NFR-9 | **Observabilidad**: logs estructurados, captura de errores (ej. Sentry) y trazas de pagos. | Debe |
| RF-NFR-10 | **Protección básica de abuso**: rate limiting en endpoints sensibles (login, pago, webhooks). | Debería |
| RF-NFR-11 | **Validación y sanitización** de entradas; protección XSS/CSRF/inyección (base del framework + revisión). | Debe |
| RF-NFR-12 | **Política de contraseñas** y almacenamiento hasheado (coord. módulo 08). | Debe |
| RF-NFR-13 | **Mantenibilidad**: código en GitHub, CI básica, dependencias actualizadas, documentación. | Debe |
| RF-NFR-14 | **Escalabilidad preparada**: regiones/moneda y arquitectura sin reescritura para crecer (coord. módulo 15). | Debería |
| RF-NFR-15 | **Cumplimiento de cookies/tracking** (aviso de cookies si se usa analítica) (coord. módulo 16). | Debería |
| RF-NFR-16 | **Endurecimiento del admin (cuenta del dueño):** 2FA y bloqueo por intentos fallidos de login. | Debe |

## 5. Reglas / criterios
- **Ningún secreto** (claves de pago, DB, email) se versiona; viven en el entorno de la plataforma.
- **Datos de tarjeta jamás** tocan ni se guardan en el sistema (flujo hospedado/tokenizado).
- Los **backups** se prueban restaurando al menos una vez antes del go-live (un backup no probado no cuenta).
- **Producción y desarrollo** nunca comparten base de datos ni credenciales.
- Datos personales: recolectar **solo lo necesario**; permitir acceso/borrado (coord. módulos 08/10).
- Toda dependencia con vulnerabilidad crítica conocida se actualiza antes del go-live.

## 6. Entidades de datos involucradas
No aplica. Afecta configuración de infraestructura, políticas y prácticas de código (transversal).

## 7. Interfaces / puntos de integración
- **Plataformas (Railway/Vercel):** TLS, variables de entorno, backups gestionados de Postgres.
- **Cloudflare:** TLS, WAF/rate limiting básico, DNS.
- **Sentry (o similar):** captura de errores.
- **GitHub Actions (u otro):** CI (lint/test/build) — coord. módulo 14.
- **Módulos 05/08/10/16:** pagos, auth, datos personales, cookies.

## 8. Criterios de aceptación
- [ ] (RF-NFR-1) Todo el tráfico fuerza HTTPS; sin contenido mixto.
- [ ] (RF-NFR-2/11/12) Revisión de seguridad: sin datos de tarjeta almacenados; entradas validadas; contraseñas hasheadas.
- [ ] (RF-NFR-3/6) Secretos solo en entorno; entornos dev/prod separados verificados.
- [ ] (RF-NFR-5) Backup automático configurado y **restauración probada** documentada.
- [ ] (RF-NFR-7) Core Web Vitals en verde en móvil (home/ficha) (coord. módulo 11).
- [ ] (RF-NFR-9) Errores capturados en la herramienta de observabilidad; trazas de pago disponibles.
- [ ] (RF-NFR-4) Mecanismos de consentimiento y borrado de datos personales operativos.

## 9. Fuera de alcance
- Certificación PCI formal (no aplica: SAQ-A por delegar el pago).
- Auditoría de seguridad externa / pentest formal (recomendado post-lanzamiento).
- Alta disponibilidad multi-región / DR avanzado (post-MVP; ver módulo 15).
- ISO/SOC2 u otros marcos formales (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Backups:** **diarios con retención de 15 días** (subir a 30 si el plan lo permite sin costo extra).
2. **Observabilidad:** **Sentry** (free tier).
3. **Cookies:** se manejará aviso de cookies según la analítica (coord. módulo 16).
4. **Refuerzo de seguridad:** se agrega **2FA + bloqueo por intentos** para el admin (RF-NFR-16) tras revisión de riesgo de sabotaje. La defensa de ataques de red/DDoS/bots se cubre con **Cloudflare** delante.

**Pendientes:**
- Confirmar **método de 2FA** del admin (app TOTP recomendada).
- Pentest/auditoría externa: planificar **post-lanzamiento**.
