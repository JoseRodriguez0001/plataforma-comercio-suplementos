# Plan de implementación — Analítica y métricas de negocio

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
MVP con **base mínima**: integrar una **analítica web ligera y respetuosa de privacidad** (Plausible/Umami recomendado, sin el peso legal de cookies de GA) en el storefront, y exponer **métricas de negocio básicas** a partir de datos reales de órdenes (apoyándose en lo que ofrezca el admin nativo de Medusa, o una vista simple si falta). Lo avanzado (embudos, eventos e-commerce, reportes, píxeles) se planifica post-MVP sobre esta base.

## 2. Tecnologías / servicios
- **Analítica web:** Plausible o Umami (o GA si se decide integrar Ads).
- **Métricas de negocio:** consultas de agregación sobre `Order` (Medusa) + dashboard admin (módulo 09).
- **Search Console:** verificación del sitio (módulo 11).
- **Consentimiento de cookies:** banner si la herramienta lo requiere (módulo 13).

## 3. Alcance MVP vs post-MVP
- **MVP:** analítica web + métricas básicas en admin + Search Console + cookies si aplica.
- **Post-MVP:** embudos/abandono, eventos e-commerce, reportes exportables, dashboards avanzados, píxeles de Ads.

## 4. Desglose de tareas
- [ ] Elegir e integrar analítica web en el storefront (RF-ANL-1).
- [ ] Aviso/consentimiento de cookies si la herramienta lo requiere (RF-ANL-3 — coord. 13).
- [ ] Métricas básicas en admin: ventas, n.º órdenes, ticket promedio, top productos (RF-ANL-2 — coord. 09).
- [ ] Conectar Google Search Console (RF-ANL-4 — coord. 11).

### Post-MVP
- [ ] Eventos de e-commerce y embudo/abandono (RF-ANL-5,7).
- [ ] Reportes exportables y dashboard de KPIs (RF-ANL-6,8).
- [ ] Píxeles de marketing (RF-ANL-9).

## 5. Orden de trabajo y dependencias
Se integra hacia el final del MVP (requiere storefront y datos de órdenes). Secuencia: analítica web + cookies → métricas básicas (con 09) → Search Console.

## 6. Estrategia de pruebas
- **Analítica web:** verificar registro de visitas/fuentes en producción.
- **Métricas:** contrastar cifras del dashboard con datos reales de órdenes.
- **Privacidad:** confirmar consentimiento de cookies si aplica.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Cookies sin consentimiento | Riesgo legal (Ley 81) | Preferir analítica sin cookies; banner si se usa GA. |
| Métricas inexactas | Decisiones erradas | Basar en datos reales de órdenes; contrastar. |
| Sobre-alcance en MVP | Retraso | Limitar a base mínima; lo avanzado post-MVP. |

## 8. Definición de "hecho" (base MVP)
- [ ] Analítica web activa en producción.
- [ ] Métricas básicas visibles para el dueño.
- [ ] Search Console conectado.
- [ ] Consentimiento de cookies conforme si aplica.
