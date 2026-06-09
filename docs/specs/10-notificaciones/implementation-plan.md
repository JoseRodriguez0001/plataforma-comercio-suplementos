# Plan de implementación — Notificaciones y email transaccional

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
Medusa v2 trae un **Notification Module** con soporte de proveedores (incluido **Resend**) y un patrón claro: **subscribers** escuchan eventos del sistema y envían notificaciones de forma **asíncrona** en el worker. La estrategia es usar ese módulo, configurar **Resend** como proveedor en el MVP detrás de la abstracción nativa (para poder migrar a **SES** sin tocar lógica), y construir las **plantillas en español con branding** y los **subscribers** que mapean cada evento de negocio a su correo. El envío desacoplado garantiza que un fallo de email nunca rompa la compra.

## 2. Primitivas de Medusa usadas
- **Notification Module** + proveedor (Resend / SES).
- **Subscribers** a eventos: `order.placed`, `fulfillment.*`, `order.canceled`, `customer.created`, reseteo de contraseña, alertas de inventario.
- **Worker:** procesamiento asíncrono con reintentos.
- **Event Bus (Redis):** entrega de eventos a los subscribers.

## 3. Extensiones propias
- **Plantillas** de correo (cliente: confirmación, cambios de estado, bienvenida, reseteo; dueño: nueva orden, stock bajo, vencimiento) en **español + branding** responsive.
- **Subscribers** que mapean eventos → notificación con sus datos.
- **Abstracción/config de proveedor** por entorno (Resend en MVP; SES conmutável).
- **Log de envíos** (si se necesita más que lo nativo) para diagnóstico (RF-NOT-11).
- **Verificación de dominio** (SPF/DKIM) en DNS de Cloudflare.

## 4. Desglose de tareas
- [ ] Configurar Notification Module + Resend por entorno (RF-NOT-10).
- [ ] Verificar dominio remitente (SPF/DKIM) en Cloudflare (RF-NOT-12).
- [ ] Plantillas en español con branding, responsive (RF-NOT-9).
- [ ] Subscriber confirmación de orden (RF-NOT-1).
- [ ] Subscribers cambios de estado: enviado/listo/entregado/cancelado (RF-NOT-2).
- [ ] Correo de reseteo (RF-NOT-3 — coord. módulo 08) y bienvenida (RF-NOT-4).
- [ ] Aviso al dueño de nueva orden (RF-NOT-5).
- [ ] Alertas al dueño de stock bajo / vencimiento (RF-NOT-6 — coord. módulo 07).
- [ ] Asegurar envío asíncrono + reintentos (RF-NOT-7,8).
- [ ] Log de envíos (RF-NOT-11).

## 5. Orden de trabajo y dependencias
Transversal: depende de los eventos de 06/07/08. Secuencia: proveedor + dominio verificado → plantilla base con branding → subscribers de cliente (confirmación/estado/cuenta) → avisos/alertas al dueño → reintentos + log.
Habilita los criterios de aceptación de notificación de 04/06/07/08.

## 6. Estrategia de pruebas
- **Integración:** cada evento dispara el correo correcto con los datos correctos (usando entorno de prueba del proveedor).
- **Resiliencia:** simular fallo del proveedor → la compra/acción se completa igual; reintento posterior.
- **Entregabilidad:** prueba de SPF/DKIM y que no caiga en spam.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Correos a spam | Cliente no se entera | Dominio propio + SPF/DKIM; proveedor con buena reputación. |
| Fallo de email bloquea compra | Pérdida de venta | Envío asíncrono desacoplado (worker); nunca en el camino crítico. |
| Plantillas no responsive | Mala imagen | Plantillas probadas en clientes de correo comunes y móvil. |
| Lock-in de proveedor | Costo de cambio | Usar la abstracción del Notification Module (Resend↔SES). |

## 8. Definición de "hecho"
- [ ] RF-NOT "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Correos de cliente (confirmación, estados, cuenta) y de dueño (nueva orden, alertas) funcionando.
- [ ] Envío asíncrono con reintentos; fallo de email no rompe la compra.
- [ ] Plantillas en español con branding, responsive, desde dominio verificado.
- [ ] Proveedor conmutável sin tocar lógica.
