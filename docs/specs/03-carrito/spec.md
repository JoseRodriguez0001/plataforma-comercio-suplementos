# Spec — Carrito de compras

- **ID módulo:** `CAR`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 01-Catálogo (productos/variantes/precios), 07-Inventario (disponibilidad), 08-Cuentas (fusión al login)

## 1. Propósito
Permitir que el cliente reúna productos antes de comprar, ajuste cantidades y vea el total claro, tanto siendo **invitado** como **registrado**, conservando su carrito mientras navega. Un carrito confiable y sin fricción es el paso previo directo a la venta.

## 2. Actores involucrados
- **Visitante (invitado):** crea y gestiona un carrito sin cuenta.
- **Cliente registrado:** igual, y su carrito se **fusiona** al iniciar sesión.
- **Sistema:** valida precios/disponibilidad contra el catálogo e inventario; expira carritos abandonados.

## 3. Historias de usuario
- Como **visitante** quiero agregar un producto (y elegir su variante) al carrito sin tener que registrarme.
- Como **cliente** quiero cambiar cantidades o eliminar líneas y ver el total actualizarse al instante.
- Como **cliente** quiero que mi carrito siga ahí si recargo la página o vuelvo más tarde.
- Como **cliente que inicia sesión** quiero que lo que ya tenía como invitado **no se pierda** y se combine con mi cuenta.
- Como **cliente** quiero ver claramente subtotal, impuestos (ITBMS) y costo de envío estimado antes de pagar.
- Como **cliente** quiero que el sistema me avise si un producto del carrito se agotó o cambió de precio.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CAR-1 | Agregar al carrito una **variante** específica con cantidad. | Debe |
| RF-CAR-2 | Ver el carrito con líneas (producto, variante, cantidad, precio unitario, subtotal por línea). | Debe |
| RF-CAR-3 | Modificar cantidad y eliminar líneas; el total se recalcula. | Debe |
| RF-CAR-4 | El carrito **persiste** para el invitado (entre recargas y sesiones del navegador). | Debe |
| RF-CAR-5 | Al **iniciar sesión**, el carrito de invitado se **fusiona** con el del cliente (sin perder líneas). | Debe |
| RF-CAR-6 | El carrito muestra **subtotal, ITBMS estimado y total**; el envío se calcula en checkout (módulo 04). | Debe |
| RF-CAR-7 | Validar **disponibilidad** al agregar y al ir a checkout; impedir cantidades mayores al stock (coord. módulo 07). | Debe |
| RF-CAR-8 | Detectar y avisar **cambios de precio o agotamiento** de ítems ya en el carrito. | Debería |
| RF-CAR-9 | Indicador visible de cantidad de ítems (icono de carrito en el header). | Debe |
| RF-CAR-10 | Soporte de **cupón/descuento** a nivel carrito (aplicar/quitar código). | Debería |
| RF-CAR-11 | **Expiración** y limpieza de carritos abandonados tras N días (libera reservas si aplica). | Debería |

## 5. Reglas de negocio
- La cantidad por línea no puede exceder el stock disponible de la variante.
- El precio de la línea se toma del catálogo vigente; si cambió, se notifica y se actualiza al valor actual.
- Un carrito siempre está asociado a una **región/moneda** (USD en MVP) que determina precios e impuestos.
- La fusión al login: si la misma variante existe en ambos carritos, se suman cantidades respetando el límite de stock.
- ITBMS mostrado en carrito es **estimado**; el definitivo se confirma en checkout según reglas fiscales (pendiente confirmar exención de suplementos).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Cart`, `LineItem`, `ShippingMethod` (en checkout), `Promotion`/`Discount`, asociación a `Region` y `Customer`. Medusa ya modela carrito, líneas, totales, impuestos y promociones.
**Extensiones propias:** ninguna prevista; se usa el modelo de carrito nativo. La lógica de fusión y validación se implementa con workflows.

## 7. Interfaces / puntos de integración
- **Store API (Medusa):** crear carrito, agregar/editar/eliminar líneas, aplicar promociones, recuperar totales.
- **Inventario (módulo 07):** chequeo de disponibilidad.
- **Cuentas (módulo 08):** evento de login dispara la fusión de carrito.
- **Checkout (módulo 04):** consume el carrito para envío/impuestos/pago.
- **Job (worker):** expiración de carritos abandonados.

## 8. Criterios de aceptación
- [ ] (RF-CAR-1/2/3) Un invitado agrega 2 variantes, cambia cantidades y elimina una; los totales son correctos.
- [ ] (RF-CAR-4) Tras recargar el navegador, el carrito del invitado persiste.
- [ ] (RF-CAR-5) Un invitado con ítems inicia sesión y conserva/combina su carrito sin perder nada.
- [ ] (RF-CAR-7) No se puede agregar más cantidad que el stock disponible.
- [ ] (RF-CAR-6) El carrito muestra subtotal, ITBMS estimado y total coherentes.
- [ ] (RF-CAR-8) Si un ítem se agota o cambia de precio, el cliente recibe aviso claro.
- [ ] (RF-CAR-9) El header refleja la cantidad de ítems en tiempo real.

## 9. Fuera de alcance
- Cálculo final de **envío** y selección de método → módulo 04 (checkout).
- Procesamiento de **pago** → módulo 05.
- Listas de deseos / guardar para después (post-MVP).
- Carritos compartibles por enlace (post-MVP).

## 10. Preguntas abiertas
1. ¿Días de **expiración** del carrito abandonado?
7 días (sugerido: 7–14 días).
2. ¿Habrá **cupones/descuentos** en el lanzamiento, o se difiere?
Si, en el descuento y tal vez en otras ocasiones. (define prioridad de RF-CAR-10).
3. ¿Se reserva stock al agregar al carrito o solo al pagar?
 El stock se reserva únicamente al iniciar el checkout con un tiempo límite de 15 minutos (impacta módulo 07).
