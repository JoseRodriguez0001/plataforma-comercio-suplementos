# Spec — Analítica y métricas de negocio

- **ID módulo:** `ANL`
- **Estado:** Aprobado
- **MVP:** Parcial — **base mínima en MVP**, analítica avanzada post-MVP
- **Depende de:** 06-Órdenes, 09-Admin, 11-SEO, 13-NFR (cookies)

## 1. Propósito
Darle al dueño **visibilidad de cómo va el negocio** (ventas, productos top, tráfico) y al equipo datos para mejorar la tienda. En el MVP se incluye una **base mínima** (analítica web + métricas básicas en el admin); los reportes avanzados y embudos se dejan post-MVP.

## 2. Actores involucrados
- **Dueño:** consulta ventas, productos más vendidos, órdenes y tráfico.
- **Sistema:** registra eventos y agrega métricas.
- **Desarrollador/Marketing (futuro):** analiza embudos y conversión.

## 3. Historias de usuario
- Como **dueño** quiero ver **ventas del período** y **productos más vendidos**.
- Como **dueño** quiero saber **cuánta gente visita** la tienda y de dónde llega.
- Como **dueño** quiero ver **órdenes por estado** y alertas (stock) en un vistazo (coord. módulo 09).
- Como **negocio (futuro)** quiero medir **conversión y abandono de carrito** para mejorar ventas.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-ANL-1 | **Analítica web** (visitas, fuentes de tráfico, páginas top) con herramienta respetuosa de privacidad. | Debe (base) |
| RF-ANL-2 | **Métricas básicas en el admin**: ventas del período, n.º de órdenes, ticket promedio, productos top. | Debería (base) |
| RF-ANL-3 | **Aviso/consentimiento de cookies** si la analítica lo requiere (coord. módulo 13/Ley 81). | Debe (si aplica) |
| RF-ANL-4 | **Integración con Google Search Console** (rendimiento en buscador) (coord. módulo 11). | Debería |
| RF-ANL-5 | **Embudo de conversión** y **abandono de carrito**. | Post-MVP |
| RF-ANL-6 | **Reportes exportables** (ventas, inventario, clientes). | Post-MVP |
| RF-ANL-7 | **Eventos de e-commerce** (ver producto, agregar al carrito, compra) para análisis fino. | Post-MVP |
| RF-ANL-8 | **Dashboard de KPIs** del negocio más completo. | Post-MVP |
| RF-ANL-9 | **Integración con píxeles de marketing** (Meta/Google Ads) para campañas. | Post-MVP |

## 5. Reglas de negocio
- La analítica del MVP debe ser **respetuosa de la privacidad** y cumplir Ley 81 (consentimiento si usa cookies de seguimiento).
- Preferir herramientas **sin/ligeras en cookies** (ej. Plausible/Umami) para minimizar fricción legal; si se usa Google Analytics, requiere aviso de cookies.
- Las métricas de negocio (ventas, top productos) salen de **datos reales de órdenes** (módulo 06), no estimaciones.
- No recolectar datos personales innecesarios para análisis (minimización).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** datos de `Order`, `LineItem`, `Customer` como fuente de métricas de negocio.
**Externas/propias:** herramienta de analítica web (Plausible/Umami/GA); vistas/consultas de agregación para el dashboard básico (coord. módulo 09).

## 7. Interfaces / puntos de integración
- **Analítica web** embebida en el storefront (script).
- **Admin (módulo 09):** dashboard de métricas básicas.
- **Search Console (módulo 11):** rendimiento SEO.
- **Consentimiento de cookies (módulo 13):** si la herramienta lo requiere.

## 8. Criterios de aceptación
- [ ] (RF-ANL-1) La analítica web registra visitas y fuentes de tráfico en producción.
- [ ] (RF-ANL-2) El admin muestra ventas del período, n.º de órdenes, ticket promedio y productos top.
- [ ] (RF-ANL-3) Si la herramienta usa cookies de seguimiento, hay aviso/consentimiento conforme a Ley 81.
- [ ] (RF-ANL-4) El sitio está conectado a Search Console.

## 9. Fuera de alcance (MVP)
- Embudos, abandono de carrito, eventos de e-commerce detallados, reportes exportables, dashboards avanzados y píxeles de marketing → **post-MVP**.

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Herramienta de analítica web:** se decide **más adelante** según el estado del negocio (Plausible/Umami por privacidad, o GA si se integra con Ads). Recomendación por defecto: empezar con una opción sin fricción de cookies.
2. **Dashboard de métricas:** usar lo **nativo** y **agregar vistas propias solo si se necesita** (coord. módulo 09).

**Pendientes:**
- **Campañas de Ads** (Meta/Google): aún no definidas; si se confirman, conviene GA + píxeles.
