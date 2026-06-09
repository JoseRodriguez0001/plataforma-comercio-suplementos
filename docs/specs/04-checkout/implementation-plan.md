# Plan de implementación — Checkout

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobada

## 1. Enfoque general
Medusa v2 ya implementa el flujo de checkout: dirección → opciones de envío (por **service zones**) → sesión de pago → `completeCart` que crea la orden. Se aprovecha íntegro y se configura para Panamá: **zonas de envío por provincia**, una `ShippingOption` de **retiro en local** con precio 0, y la **reserva de stock de 15 minutos** apoyada en el Inventory Module + un job de liberación. El storefront implementa el checkout multipaso (Next.js) sobre la Store API.

## 2. Primitivas de Medusa usadas
- **Fulfillment Module:** `FulfillmentSet`, `ServiceZone`, `ShippingOption` para zonas de Panamá y opción de retiro.
- **Cart + Tax + Promotion Modules:** dirección, cálculo de ITBMS por región, cupones, totales.
- **Payment Module:** `PaymentCollection`/`PaymentSession` (proveedores del módulo 05).
- **Inventory Module:** reservas de stock con expiración (15 min).
- **Workflow `completeCart`:** valida, cobra y crea la orden de forma transaccional.
- **Worker (job):** liberación de reservas vencidas.

## 3. Extensiones propias
- **Configuración de zonas de envío** Panamá (provincias agrupadas) + tarifas (data + admin).
- **Shipping option "Retiro en local"** (precio 0, sin dirección de envío, con datos de contacto y horario).
- **Política de reserva 15 min:** crear reserva al iniciar checkout; **scheduled job** que libera reservas vencidas y devuelve el stock.
- **Revalidación pre-cobro** (precios/stock) integrada en el flujo `completeCart` (RF-CHK-10).
- **Storefront multipaso** responsive con desglose de totales en cada paso.

## 4. Desglose de tareas
- [ ] Configurar región Panamá (USD) e impuestos ITBMS (parametrizable) (RF-CHK-5).
- [ ] Modelar zonas de envío por provincia + tarifas (RF-CHK-3,4).
- [ ] Crear opción "Retiro en local" con horario/dirección (RF-CHK-3,13).
- [ ] Formulario de dirección válido para Panamá (provincia/distrito/corregimiento/referencia) (RF-CHK-2).
- [ ] Checkout para invitado (email) y precarga para registrado (RF-CHK-1).
- [ ] Integrar aplicación de cupón en el total (RF-CHK-6).
- [ ] Reserva de stock 15 min + job de liberación (RF-CHK-7).
- [ ] Revalidación de stock/precio antes de cobrar (RF-CHK-10).
- [ ] Integrar sesión de pago y manejo de éxito/fallo/cancelación (RF-CHK-8, depende módulo 05).
- [ ] `completeCart` → orden + página de confirmación con número (RF-CHK-9).
- [ ] Oferta de crear cuenta post-compra al invitado (RF-CHK-11).
- [ ] UI responsive multipaso con desglose de totales (RF-CHK-12).

## 5. Orden de trabajo y dependencias
Depende de 03 (carrito) y 07 (inventario/reservas); se integra con 05 (pagos) y 06 (órdenes). Secuencia: región/impuestos → zonas de envío + retiro → formulario/flujo multipaso → reserva 15 min → revalidación → integración de pago → creación de orden/confirmación → oferta de cuenta.
**Bloqueante crítico:** la integración de pago real (05) depende de las cuentas de comercio del dueño; el flujo se construye contra la interfaz de pago y se prueba con un proveedor de prueba mientras llegan las credenciales.

## 6. Estrategia de pruebas
- **Integración:** flujo completo carrito→orden con envío por zona y con retiro en local; verificación de totales (incl. ITBMS y cupón).
- **Unitarias:** cálculo de envío por zona; expiración de reserva; revalidación pre-cobro.
- **E2E:** checkout invitado y registrado, pago exitoso/fallido/cancelado, expiración de reserva a los 15 min.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Credenciales de pago no listas a tiempo | Bloquea checkout real | Construir contra interfaz + proveedor de prueba; cablear credenciales al final. |
| Sobreventa si la reserva falla | Orden incumplible | Reserva atómica en Inventory + revalidación pre-cobro + job de liberación idempotente. |
| Zonas/tarifas de envío indefinidas | No se puede cobrar envío | Resolver pregunta abierta con el dueño antes de implementar tarifas. |
| ITBMS mal configurado | Cobro incorrecto | Parametrizar impuesto; validar con caso real; confirmar exención. |

## 8. Definición de "hecho"
- [ ] RF-CHK "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Checkout invitado y registrado funcionando end-to-end.
- [ ] Envío por zona y retiro en local con costos correctos.
- [ ] Reserva de 15 min con liberación automática verificada.
- [ ] Pago exitoso crea orden + confirmación; fallo/cancelación no crea orden.
- [ ] Revalidación pre-cobro evita sobreventa/precio desfasado.
- [ ] Flujo usable en móvil.
