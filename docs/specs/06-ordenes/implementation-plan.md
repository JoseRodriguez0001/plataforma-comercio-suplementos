# Plan de implementación — Órdenes y cumplimiento

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobada

## 1. Enfoque general
Medusa v2 ya implementa el **ciclo de vida completo de la orden**: creación desde `completeCart`, estados de pago y cumplimiento, `Fulfillment`, devoluciones, cancelaciones e historial de cambios, todo gestionable desde el Admin nativo. La estrategia es **usar el modelo y el admin nativos** y añadir solo: (a) los **campos de cumplimiento manual** (transportista, guía, fechas, nota), (b) la **distinción operativa envío vs retiro**, y (c) los **disparadores de notificación** por cambio de estado (módulo 10). No se introducen entidades nuevas.

## 2. Primitivas de Medusa usadas
- **Order Module:** `Order`, `OrderLineItem`, estados de pago/cumplimiento, `OrderChange` (historial), cancelación.
- **Fulfillment Module:** `Fulfillment` y sus estados (preparación → enviado/listo → entregado); opción de retiro como método de cumplimiento sin envío.
- **Payment Module (módulo 05):** estado de pago y reembolsos.
- **Inventory Module (módulo 07):** confirmar consumo al crear la orden; devolver stock al cancelar.
- **Eventos** `order.*` / `fulfillment.*` → subscribers que disparan emails (módulo 10).
- **Admin Dashboard:** pantallas nativas de órdenes + extensión UI para campos de cumplimiento.

## 3. Extensiones propias
- **Campos de cumplimiento manual** sobre el fulfillment: `transportista`, `numero_guia`, `fecha_envio`, `fecha_estimada_entrega`, `nota_entrega` (envío) y `fecha_listo_retiro`, `fecha_retiro` (retiro).
- **Widget de Admin** para capturar esos campos según el método (envío vs retiro).
- **Subscribers de notificación** en cambios clave de estado (confirmación, enviado/listo, cancelado).
- **Consulta de orden para invitado:** endpoint Store que resuelve una orden por identificador + email (sin cuenta).
- **Lista configurable de transportistas** (data sembrada, editable por el dueño).

## 4. Desglose de tareas
- [ ] Verificar creación de orden desde `completeCart` con todos los datos (RF-ORD-1,2).
- [ ] Confirmar consumo de inventario al crear orden; devolución al cancelar (RF-ORD-3,8 — coord. módulo 07).
- [ ] Configurar flujo de estados envío vs retiro (RF-ORD-4,11).
- [ ] Campos de cumplimiento manual + widget de Admin (RF-ORD-6).
- [ ] Sincronizar/mostrar estado de pago (RF-ORD-5 — coord. módulo 05).
- [ ] Cancelación + reembolso desde el admin (RF-ORD-8).
- [ ] Subscribers → emails por cambio de estado (RF-ORD-9 — coord. módulo 10).
- [ ] Consulta de orden: historial (registrado) y por identificador+email (invitado) (RF-ORD-7).
- [ ] Historial/auditoría de estados (RF-ORD-10).
- [ ] Búsqueda/filtrado de órdenes en admin (RF-ORD-13).
- [ ] Lista configurable de transportistas (pendiente input del dueño).

## 5. Orden de trabajo y dependencias
Depende de 04/05 (creación tras pago) y 07 (inventario). Secuencia: creación+inventario → estados envío/retiro → campos de cumplimiento + admin → cancelación/reembolso → notificaciones → consulta de cliente → auditoría/filtros.
Devolución parcial (RF-ORD-12) **fuera del MVP**.

## 6. Estrategia de pruebas
- **Integración:** `completeCart` → orden creada con inventario descontado; cancelación → reembolso + stock devuelto.
- **Unitarias:** transiciones de estado válidas/ inválidas; flujo retiro omite "enviado".
- **E2E:** dueño avanza una orden de envío y una de retiro; cliente registrado ve historial; invitado consulta por identificador+email.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Inconsistencia entre estado de pago y de orden | Operación confusa | Una sola fuente de verdad (Payment Module) + sincronización por eventos. |
| Stock no devuelto al cancelar | Inventario erróneo | Cancelación como workflow transaccional que dispara devolución en Inventory. |
| Consulta de invitado expone datos | Privacidad | Requerir identificador + email coincidentes; enlaces no adivinables. |
| Campos manuales mal usados | Datos pobres | Campos esenciales obligatorios según método; opcionales claros en el widget. |

## 8. Definición de "hecho"
- [ ] RF-ORD "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Orden creada solo tras pago, con inventario descontado.
- [ ] Flujos de envío y de retiro operables por el dueño con sus campos manuales.
- [ ] Cancelación con reembolso y devolución de stock verificada.
- [ ] Emails disparados en cada cambio clave de estado.
- [ ] Cliente (registrado e invitado) consulta su orden.
