# 00 — Visión, alcance y actores

## 1. Visión
Tienda online profesional para un negocio real de venta de suplementos en Panamá. Objetivo: estar **en producción** (no prototipo), con un dueño que pueda gestionar el catálogo, inventario y órdenes **sin tocar código**, y una arquitectura que permita **expansión internacional** sin reescritura.

## 2. Alcance del MVP (3 semanas)
Incluye: catálogo con categorías/imágenes/descripción, carrito, checkout, pagos locales (Yappy + PagueloFacil), órdenes, autenticación de clientes con historial, panel de administración, inventario, emails transaccionales, diseño responsive y profesional, despliegue en producción.

**Fuera del MVP (diseñar los "ganchos" pero no implementar):** multi-idioma/multi-moneda, multi-región internacional, programa de fidelidad, suscripciones recurrentes, facturación electrónica DGI, analítica avanzada.

## 3. Actores

### Actores humanos
| Actor | Descripción | Capacidades clave |
|-------|-------------|-------------------|
| **Visitante (cliente anónimo)** | Usuario sin cuenta. | Navegar catálogo, buscar, ver fichas, agregar al carrito, (¿checkout como invitado? → pregunta abierta global). |
| **Cliente registrado** | Usuario con cuenta. | Todo lo del visitante + direcciones guardadas, historial de pedidos, repetir compra, gestionar perfil. |
| **Dueño / Administrador** | Dueño del negocio. | Gestión total: productos, categorías, precios, inventario, órdenes, cumplimiento, reportes básicos. Sin tocar código. |
| **Operador / Staff** | *(Post-MVP)* Empleado con permisos limitados. | Gestión de órdenes/inventario, sin acceso a configuración sensible. |

### Actores de sistema / externos
| Actor | Descripción | Rol |
|-------|-------------|-----|
| **Sistema (worker / jobs)** | Procesos automáticos en background. | Envío de emails, expiración de carritos, sincronización de estados de pago, alertas de stock bajo. |
| **Pasarela de pago** | Yappy (Banco General) y PagueloFacil. | Procesan el cobro y confirman vía redirect/webhook. Ver [`05-pagos`](05-pagos/spec.md). |
| **Proveedor de email** | Resend o Amazon SES. | Entrega de correos transaccionales. |
| **Courier / mensajería** | *(Post-MVP)* Empresa de envíos. | Entrega física de pedidos. En MVP el envío se gestiona manualmente desde el admin. |

## 4. Glosario
- **SKU:** identificador único de una variante vendible.
- **Variante:** versión concreta de un producto (ej. "Proteína Whey — Chocolate — 2 lb").
- **Fulfillment / cumplimiento:** proceso de preparar y enviar una orden pagada.
- **Sales channel / región:** segmentación de Medusa por canal de venta y zona geográfica (moneda, impuestos). Base para la expansión internacional.
- **ITBMS:** Impuesto a la Transferencia de Bienes Muebles y Servicios de Panamá (equivalente al IVA).
- **PaymentProvider:** interfaz de Medusa que abstrae cada pasarela de pago.

## 5. Requisitos no funcionales (resumen — detalle en módulo 13)
- **Seguridad / PCI:** la plataforma **nunca** almacena datos de tarjeta; la tokenización vive en la pasarela. Datos sensibles cifrados, secretos fuera del repo.
- **Protección de datos:** cumplir Ley 81 de Panamá (protección de datos personales).
- **Rendimiento:** storefront con SSR/CDN, carga rápida en móvil (mayoría del tráfico en Panamá es móvil).
- **Disponibilidad y respaldo:** backups automáticos de PostgreSQL; entornos separados (dev/prod).
- **Accesibilidad y responsive:** mobile-first.
- **Observabilidad:** logs estructurados y trazabilidad de errores de pago.
- **Escalabilidad internacional:** uso de regiones/monedas de Medusa desde el día 1 aunque solo se active Panamá (PAB/USD).

## 6. Decisiones de stack (aprobadas)
Ver memoria de proyecto. Resumen: **Medusa v2** (commerce) · **Next.js** (storefront) · **PostgreSQL + Redis** · **Yappy + PagueloFacil** (pagos, abstraídos) · **Railway + Vercel + Cloudflare R2 + Resend** (infra).

## 7. Decisiones globales y preguntas abiertas
**Resueltas (2026-06-07):**
1. **Checkout:** se permite **comprar como invitado** y se ofrece crear cuenta al final (cuenta opcional). Afecta módulos 03/04/08.
2. **Envíos:** **por zona/provincia** + opción de **retiro en local**. Afecta módulos 04/06.

**Pendientes:**
3. **Moneda:** Panamá usa USD/PAB a la par. ¿Mostrar precios en USD? (asumido sí).
4. **ITBMS:** ¿los suplementos aplican ITBMS o están exentos como ciertos alimentos/medicinas? → **confirmar con el contador del dueño.**
