# Spec — Inventario

- **ID módulo:** `INV`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 01-Catálogo (variantes), 03-Carrito, 04-Checkout, 06-Órdenes

## 1. Propósito
Llevar el **stock real** de cada variante y garantizar que no se venda lo que no hay (evitar sobreventa), mediante reservas temporales durante el checkout y descuentos definitivos al confirmar la orden. Es la base de la confiabilidad operativa: lo que el cliente ve disponible es lo que efectivamente se puede entregar.

## 2. Actores involucrados
- **Dueño / Administrador:** define y ajusta el stock por variante; recibe alertas de stock bajo.
- **Sistema:** reserva (15 min), libera, consume y devuelve stock según el flujo de compra; calcula disponibilidad mostrada.
- **Cliente:** ve disponibilidad (no manipula inventario directamente).

## 3. Historias de usuario
- Como **dueño** quiero fijar la cantidad disponible de cada variante y actualizarla cuando reabastezco.
- Como **dueño** quiero que el sistema **descuente solo cuando hay una venta real** y devuelva stock si se cancela.
- Como **dueño** quiero recibir **alerta cuando un producto tenga stock bajo** para reabastecer a tiempo.
- Como **cliente** quiero ver "disponible" o "agotado" de forma confiable y no poder comprar más de lo que hay.
- Como **negocio** quiero **evitar sobreventa** incluso con varios clientes comprando lo mismo a la vez.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-INV-1 | Gestionar **stock por variante** (cantidad disponible), editable desde el admin. | Debe |
| RF-INV-2 | **Reservar stock al iniciar el checkout** con expiración de **15 minutos**. | Debe |
| RF-INV-3 | **Liberar la reserva** automáticamente al expirar (15 min) o al cancelarse/fallar el pago. | Debe |
| RF-INV-4 | **Consumir** (descontar definitivamente) el stock al **crear la orden** (pago confirmado). | Debe |
| RF-INV-5 | **Devolver stock** al cancelar/reembolsar una orden (coord. módulo 06). | Debe |
| RF-INV-6 | Calcular **disponibilidad** = stock − reservas activas; exponerla a catálogo/carrito. | Debe |
| RF-INV-7 | **Prevenir sobreventa** ante concurrencia (operaciones atómicas sobre el stock). | Debe |
| RF-INV-8 | Marcar/mostrar **"agotado"** cuando la disponibilidad llega a 0 (coord. módulos 01/02/03). | Debe |
| RF-INV-9 | **Alerta de stock bajo** al dueño según umbral configurable por variante o global. | Debería |
| RF-INV-10 | **Ajuste manual** de stock con motivo (reabastecimiento, merma, corrección) y traza. | Debería |
| RF-INV-11 | Soporte de **una ubicación de stock** en MVP, con modelo preparado para múltiples (futuro multi-local). | Debe |
| RF-INV-12 | Permitir variantes **sin gestión de stock** (ej. servicios/productos siempre disponibles), opcional. | Podría |
| RF-INV-13 | **Alerta de vencimiento (nivel simple):** fecha de vencimiento por variante + aviso al dueño cuando falten N días. | Debería |

## 5. Reglas de negocio
- **Disponibilidad para vender = stock físico − reservas activas no expiradas.**
- La reserva se crea **al iniciar el checkout**, no al agregar al carrito (decisión módulo 03), y vence a los **15 minutos**.
- El stock se **descuenta de verdad solo al crear la orden**; antes solo hay reservas.
- Cancelar/reembolsar una orden **devuelve** el stock al disponible.
- Las operaciones de reserva/consumo deben ser **atómicas** para que dos clientes no compren la última unidad.
- "Agotado" se determina por disponibilidad 0; un producto agotado no es comprable pero sigue visible (decisión módulo 01/02).
- En MVP hay **una sola ubicación** (el local); el modelo no debe impedir agregar más en el futuro.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `InventoryItem`, `InventoryLevel` (stock por ubicación), `ReservationItem` (reservas), `StockLocation`. Medusa ya modela inventario multi-ubicación, reservas y niveles, vinculado a las variantes.
**Extensiones propias:** umbral de **stock bajo** por variante/global y la lógica de **alerta**; expiración de reservas a 15 min (job de liberación, compartido con módulo 04); registro de **ajustes manuales con motivo** (RF-INV-10).

## 7. Interfaces / puntos de integración
- **Inventory Module (Medusa):** niveles, reservas, consumo, devolución.
- **Módulo 04 (Checkout):** crear reserva al iniciar; el job de liberación libera vencidas.
- **Módulo 06 (Órdenes):** consumir al crear orden; devolver al cancelar.
- **Módulos 01/02/03:** consultar disponibilidad para mostrar/validar.
- **Módulo 10 (Notificaciones):** enviar alerta de stock bajo al dueño.
- **Worker (jobs):** liberación de reservas vencidas; evaluación de umbrales de stock bajo.

## 8. Criterios de aceptación
- [ ] (RF-INV-1) El dueño edita el stock de una variante y se refleja en disponibilidad.
- [ ] (RF-INV-2/3) Iniciar checkout crea una reserva; si pasan 15 min sin pago, se libera y el stock vuelve a estar disponible.
- [ ] (RF-INV-4/5) Pagar crea la orden y descuenta stock; cancelar la orden lo devuelve.
- [ ] (RF-INV-7) Con stock = 1 y dos checkouts simultáneos, **solo uno** puede completar la compra; el otro recibe "agotado".
- [ ] (RF-INV-6/8) La disponibilidad mostrada es correcta y un producto en 0 aparece "agotado" y no comprable.
- [ ] (RF-INV-9) Al cruzar el umbral, el dueño recibe alerta de stock bajo.
- [ ] (RF-INV-10) Un ajuste manual queda registrado con su motivo.

## 9. Fuera de alcance
- **Multi-ubicación / multi-bodega** operativa (solo se deja el modelo preparado; MVP usa una ubicación).
- **Trazabilidad por lote y FEFO** (consumo por orden de vencimiento) → post-MVP. El MVP cubre solo la **alerta de vencimiento simple** (RF-INV-13).
- Órdenes de compra a proveedores / reabastecimiento automatizado (post-MVP).
- Backorders / preventa de productos sin stock (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Umbral de stock bajo:** valor **global por defecto + override por variante**. (Definir el valor global — sugerido 5 — con el dueño.)
2. **Vencimiento:** se incluye **alerta simple** (RF-INV-13): fecha de vencimiento por variante + aviso N días antes (esfuerzo bajo, asume un lote por variante). **Trazabilidad por lote/FEFO → post-MVP.**
3. **Backorder:** **no** se permite vender sin stock.

**Pendientes (input del negocio):**
- Valor del **umbral global** de stock bajo y los **días de aviso** de vencimiento (ej. 60/30).
