# Plan de implementación — Pagos

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobada

## 1. Enfoque general
Medusa v2 ya define la **interfaz de proveedor de pago** (`AbstractPaymentProvider`) y todo el ciclo `PaymentCollection → PaymentSession → Payment → Refund`. La estrategia es implementar **tres proveedores** que cumplen esa interfaz:
1. **`payment-mock`** (sandbox interno) — para desarrollar y probar el checkout end-to-end **sin credenciales reales** (RF-PAY-13). Es lo que destraba el avance mientras el dueño tramita las cuentas.
2. **`payment-yappy`** — Botón de Pago de Banco General (flujo de aviso al móvil + webhook).
3. **`payment-paguelofacil`** — tarjetas/Sistema Clave (flujo hospedado/redirect + webhook).

El checkout y el storefront **solo hablan con la abstracción de Medusa**: no conocen detalles de cada pasarela (RF-PAY-1/4). Agregar **Stripe** mañana = un cuarto módulo, sin tocar checkout. Cada proveedor recibe credenciales por **variables de entorno** y modo **sandbox/producción** (RF-PAY-12); el go-live es cargar credenciales y activar el proveedor.

## 2. Primitivas de Medusa usadas
- **Payment Module** + `AbstractPaymentProvider`: registro de proveedores y ciclo de pago.
- **Workflows** de pago/`completeCart`: autorizar/capturar y crear orden de forma transaccional (RF-PAY-9).
- **API routes** para endpoints de **webhook** entrantes por proveedor (RF-PAY-6).
- **Eventos + Worker:** procesamiento asíncrono de confirmaciones y conciliación (RF-PAY-8).
- **Inventory Module:** liberar/confirmar reserva según resultado (coord. módulo 07).

## 3. Extensiones propias
- **Contrato común** de proveedor: `initiatePayment`, `authorizePayment`, `capturePayment`, `getPaymentStatus`, `refundPayment`, `cancelPayment`, `getWebhookActionAndData` (mapear payload externo → estado interno).
- **Módulo `payment-mock`:** simula éxito/fallo/cancelación/pendiente para pruebas y CI.
- **Módulo `payment-yappy`:** crear solicitud de pago, generar el aviso al móvil, endpoint de webhook con **verificación de firma**, mapeo de estados, expiración de la solicitud alineada a 15 min.
- **Módulo `payment-paguelofacil`:** crear transacción (hosted/redirect), URL de retorno, endpoint de webhook con verificación, mapeo de estados, base para tokenización (RF-PAY-15, diseñar).
- **Registro de auditoría de pagos:** tabla/log de intentos y eventos (RF-PAY-14).
- **Lógica de idempotencia:** claves de idempotencia por intento + deduplicación de webhooks (RF-PAY-7).
- **Job de conciliación:** consulta estados pendientes contra la pasarela y resuelve confirmaciones tardías; **reembolso automático** si no hay stock (RF-PAY-8 + regla de negocio).

## 4. Desglose de tareas
- [ ] Implementar `payment-mock` y cablear el checkout contra la abstracción (RF-PAY-1,4,13).
- [ ] Endpoints de webhook genéricos + verificación de firma por proveedor (RF-PAY-6).
- [ ] Idempotencia y deduplicación de webhooks (RF-PAY-7).
- [ ] Módulo `payment-yappy`: iniciar pago, webhook, mapeo de estados, expiración 15 min (RF-PAY-2).
- [ ] Módulo `payment-paguelofacil`: transacción hosted/redirect, retorno, webhook, estados (RF-PAY-3).
- [ ] Manejo de resultados en checkout: éxito/fallo/cancelación/pendiente con mensajes (RF-PAY-5).
- [ ] Crear orden solo con pago confirmado (`completeCart`) (RF-PAY-9).
- [ ] Job de conciliación + reembolso automático ante confirmación tardía sin stock (RF-PAY-8).
- [ ] Reembolsos (total/parcial) desde el admin; registro de reembolso manual si la pasarela no lo permite (RF-PAY-10).
- [ ] Configuración por entorno y gestión de secretos (RF-PAY-12).
- [ ] Auditoría/trazabilidad de intentos de pago (RF-PAY-14).
- [ ] Diseño (no activación) de tokenización para recurrentes (RF-PAY-15).

## 5. Orden de trabajo y dependencias
1. `payment-mock` + cableado del checkout (destraba módulo 04 sin credenciales).
2. Infra de webhooks + idempotencia + conciliación.
3. `payment-yappy` (método por defecto) → pruebas en sandbox.
4. `payment-paguelofacil` → pruebas en sandbox.
5. Reembolsos + auditoría.
6. **Go-live:** cargar credenciales reales y activar (depende del trámite del dueño — camino crítico externo).

## 6. Estrategia de pruebas
- **Unitarias:** mapeo de estados de cada pasarela; idempotencia; lógica de reembolso automático.
- **Integración:** flujo `initiate → webhook → completeCart → orden` con `payment-mock` (éxito/fallo/cancelación/pendiente).
- **Sandbox real:** pruebas con sandboxes de Yappy y PagueloFacil cuando haya credenciales de prueba.
- **Pruebas de borde:** webhook duplicado, confirmación tardía con y sin stock, expiración de la solicitud a los 15 min.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Cuentas de comercio no aprobadas a tiempo | No hay pago real en go-live | `payment-mock` permite terminar y probar todo; el dueño tramita en paralelo (camino crítico). |
| Madurez de docs/API de Yappy para Medusa v2 | Esfuerzo de integración mayor | Encapsular en módulo aislado; Tilopay como fallback (una sola integración Yappy+tarjetas). |
| Webhooks no confiables / duplicados | Doble cobro/orden | Idempotencia + verificación de firma + job de conciliación. |
| Confirmación tardía sin stock | Cliente cobrado sin producto | Reembolso automático + expiración de solicitud alineada a la reserva. |
| Manejo de secretos | Riesgo de seguridad | Solo variables de entorno; nada en el repo; rotación documentada. |

## 8. Definición de "hecho"
- [ ] RF-PAY "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Checkout funciona end-to-end con `payment-mock` (sin credenciales).
- [ ] Módulos Yappy y PagueloFacil probados en sandbox.
- [ ] Idempotencia y conciliación verificadas (webhook duplicado / confirmación tardía).
- [ ] Reembolso automático ante confirmación tardía sin stock verificado.
- [ ] Reembolsos operables desde el admin.
- [ ] Procedimiento documentado de "cargar credenciales y activar" para el go-live.
