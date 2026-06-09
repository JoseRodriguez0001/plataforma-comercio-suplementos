# Spec — Órdenes y cumplimiento

- **ID módulo:** `ORD`
- **Estado:** En revisión
- **MVP:** Sí
- **Depende de:** 04-Checkout, 05-Pagos, 07-Inventario, 10-Notificaciones

## 1. Propósito
Gestionar la **orden desde que se paga hasta que se entrega** (o se cancela/reembolsa): registrar la compra, llevar su estado, permitir al dueño prepararla y marcarla como enviada/entregada o lista para retiro, y darle al cliente visibilidad de su pedido. Es donde el negocio "opera" cada venta.

## 2. Actores involucrados
- **Cliente (invitado o registrado):** consulta el estado y detalle de su orden; el registrado la ve en su historial.
- **Dueño / Administrador:** ve, prepara, cumple (envía/entrega), cancela y reembolsa órdenes desde el panel.
- **Sistema:** crea la orden tras el pago confirmado, confirma la baja de inventario, dispara notificaciones y registra el historial de estados.

## 3. Historias de usuario
- Como **cliente** quiero recibir un **número de orden** y un correo de confirmación al comprar.
- Como **cliente** quiero **ver el estado** de mi pedido (pagado → en preparación → enviado/listo para retiro → entregado).
- Como **dueño** quiero ver todas las órdenes con su estado de pago y de cumplimiento en un solo lugar.
- Como **dueño** quiero marcar una orden como **preparada y enviada** (con datos de envío) o **lista para retiro**.
- Como **dueño** quiero **cancelar** una orden y **reembolsar** cuando corresponda, devolviendo el stock.
- Como **dueño** quiero ver el **detalle completo** de la orden (ítems, cliente, dirección/retiro, montos, pago).

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-ORD-1 | Crear la orden **solo tras pago confirmado** (desde `completeCart`), con número único. | Debe |
| RF-ORD-2 | La orden registra: ítems/variantes, cantidades, precios, descuentos, ITBMS, envío, total, datos del cliente y método de entrega. | Debe |
| RF-ORD-3 | **Confirmar la baja de inventario** al crear la orden (convertir la reserva en consumo). | Debe |
| RF-ORD-4 | **Estados de cumplimiento**: pendiente → en preparación → enviado / listo para retiro → entregado. | Debe |
| RF-ORD-5 | **Estado de pago** visible y sincronizado con módulo 05 (pagado, reembolsado, etc.). | Debe |
| RF-ORD-6 | El dueño puede **avanzar el estado** y registrar **datos de cumplimiento manuales**. Envío: transportista y fecha de envío (Debe); guía/tracking, fecha estimada de entrega y nota de entrega (Debería). Retiro: fecha "listo para retiro" (Debe), fecha/registro de retiro (Debería). | Debe |
| RF-ORD-7 | El cliente puede **consultar su orden** (registrado: historial; invitado: vía enlace/identificador + email). | Debe |
| RF-ORD-8 | **Cancelación** de orden con **reembolso** (coord. módulo 05) y **devolución de stock** (módulo 07). | Debe |
| RF-ORD-9 | **Notificaciones** automáticas en cambios clave de estado (confirmación, enviado/listo, cancelado) (módulo 10). | Debe |
| RF-ORD-10 | **Historial/auditoría** de cambios de estado de cada orden. | Debería |
| RF-ORD-11 | Diferenciar el flujo de **envío a domicilio** vs **retiro en local** en la operación y los avisos. | Debe |
| RF-ORD-12 | **Devoluciones parciales** (algunos ítems) con reembolso proporcional. | Podría |
| RF-ORD-13 | Búsqueda/filtrado de órdenes en el admin (por estado, fecha, cliente). | Debería |

## 5. Reglas de negocio
- No existe orden sin pago confirmado (regla compartida con módulos 04/05).
- Al crear la orden, la **reserva de stock se convierte en consumo definitivo**; si la orden se cancela, el stock se devuelve.
- Los **estados avanzan en orden lógico**; no se puede marcar "entregado" sin haber pasado por preparación/envío (salvo retiro en local que omite "enviado").
- **Retiro en local:** el flujo es preparación → "listo para retiro" → entregado (al momento del retiro); no usa datos de envío.
- Un **reembolso** total marca la orden como reembolsada y devuelve stock; uno parcial ajusta montos e ítems.
- Los montos de la orden son **inmutables** una vez creada (salvo ajustes por reembolso/devolución registrados explícitamente).
- **Cancelación:** solo el **dueño** cancela órdenes desde el admin; el cliente la **solicita por contacto** (no hay auto-cancelación por el cliente en MVP).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Order`, `OrderLineItem`, `Fulfillment`, `FulfillmentStatus`, `PaymentStatus`, `Return`, `OrderChange`/historial, asociación a `Customer`/`Address`. Medusa modela el ciclo completo de orden, cumplimiento, devoluciones y cambios.
**Extensiones propias:** datos de cumplimiento manual sobre el `Fulfillment`/orden — **transportista, número de guía, fecha de envío, fecha estimada de entrega, nota de entrega** (envío) y **fecha "listo para retiro", fecha/registro de retiro** (retiro). Se modelan como campos simples (texto/lista/fecha) sobre el fulfillment nativo; sin integraciones externas. La distinción envío vs retiro se resuelve con los estados nativos.

## 7. Interfaces / puntos de integración
- **Workflow `completeCart` (módulo 04):** crea la orden tras el pago.
- **Módulo 05 (Pagos):** estado de pago, reembolsos.
- **Módulo 07 (Inventario):** confirmar consumo / devolver stock.
- **Módulo 10 (Notificaciones):** emails en cambios de estado.
- **Admin API/Dashboard:** gestión de órdenes por el dueño.
- **Store API:** consulta de orden por el cliente (historial / enlace de invitado).

## 8. Criterios de aceptación
- [ ] (RF-ORD-1/2) Un pago confirmado crea una orden con número y todos los datos correctos.
- [ ] (RF-ORD-3) El inventario se descuenta al crear la orden (la reserva pasa a consumo).
- [ ] (RF-ORD-4/6/11) El dueño avanza una orden de envío (preparación→enviado→entregado) y una de retiro (preparación→listo→entregado).
- [ ] (RF-ORD-7) Un cliente registrado ve su historial; un invitado consulta su orden con su identificador+email.
- [ ] (RF-ORD-8) Cancelar una orden la reembolsa y devuelve el stock.
- [ ] (RF-ORD-9) Cada cambio clave dispara el email correspondiente.
- [ ] (RF-ORD-5) El estado de pago de la orden coincide con el real de la pasarela.

## 9. Fuera de alcance
- Integración con couriers/seguimiento en tiempo real (post-MVP; en MVP el envío se gestiona manualmente con nota/guía).
- Facturación electrónica DGI (post-MVP).
- Reglas avanzadas de devolución/garantía y RMA (post-MVP; MVP cubre cancelación/reembolso básico y, si entra, devolución parcial).
- Cambios de ítems/upsell sobre orden ya creada (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Devolución parcial (RF-ORD-12):** se **difiere a post-MVP**. El MVP cubre cancelación + reembolso total.
2. **Datos de cumplimiento manual** (ver RF-ORD-6 y §6): envío → transportista + fecha de envío (esenciales), guía/tracking + fecha estimada + nota (opcionales); retiro → fecha "listo para retiro" (esencial) + fecha/registro de retiro (opcional). Todo manual, sin integración con courier.
3. **Cancelación:** solo el **dueño** cancela; el cliente solicita por contacto (ver regla de negocio).

**Pendientes (input del negocio):**
- Lista de **transportistas** que usa el dueño (para precargar el campo como opciones).
