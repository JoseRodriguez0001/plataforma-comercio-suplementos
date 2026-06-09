# Spec — Checkout (direcciones, envío e impuestos)

- **ID módulo:** `CHK`
- **Estado:** Aprobada 
- **MVP:** Sí
- **Depende de:** 03-Carrito, 05-Pagos, 06-Órdenes, 07-Inventario (reserva), 08-Cuentas

## 1. Propósito
Convertir un carrito en una orden confirmada guiando al cliente por dirección, método de entrega (envío por zona/provincia **o** retiro en local), confirmación de impuestos y pago. Es el embudo crítico: debe ser claro, rápido y confiable, tanto para invitados como registrados.

## 2. Actores involucrados
- **Visitante (invitado):** completa el checkout sin cuenta (se le ofrece registrarse al final).
- **Cliente registrado:** usa direcciones guardadas y datos precargados.
- **Sistema:** reserva stock por 15 min, calcula envío e ITBMS, orquesta el pago (módulo 05) y crea la orden (módulo 06).
- **Pasarela de pago:** confirma el cobro (detalle en módulo 05).

## 3. Historias de usuario
- Como **invitado** quiero comprar ingresando solo correo y datos de envío, sin crear cuenta obligatoriamente.
- Como **cliente** quiero elegir entre **envío a domicilio** (según mi provincia/zona) o **retiro en el local**.
- Como **cliente** quiero ver el **costo de envío** según mi zona antes de pagar.
- Como **cliente** quiero ver el desglose final: subtotal, descuento (cupón), ITBMS y envío, con el **total exacto**.
- Como **cliente** quiero pagar de forma segura con Yappy o tarjeta (PagueloFacil).
- Como **cliente** quiero recibir confirmación inmediata de que mi orden fue creada.
- Como **invitado** quiero que al final se me ofrezca **crear una cuenta** con un clic para futuras compras.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CHK-1 | Checkout disponible para **invitado** (email + datos) y registrado (datos precargados). | Debe |
| RF-CHK-2 | Captura de **dirección de envío** con campos válidos para Panamá (provincia, distrito/corregimiento, referencia). | Debe |
| RF-CHK-3 | Selección de **método de entrega**: envío a domicilio (tarifa por **zona/provincia**) o **retiro en local** (sin costo). | Debe |
| RF-CHK-4 | Cálculo del **costo de envío** según zona/provincia seleccionada. | Debe |
| RF-CHK-5 | Cálculo y muestra del **ITBMS** y del **total final** (subtotal − descuento + ITBMS + envío). | Debe |
| RF-CHK-6 | Aplicar **cupón/descuento** y reflejarlo en el total. | Debe |
| RF-CHK-7 | Al entrar al checkout/iniciar pago, **reservar stock por 15 minutos**; liberar si expira o se cancela (coord. módulo 07). | Debe |
| RF-CHK-8 | Integración con **pago** (Yappy / PagueloFacil) y manejo de éxito/fallo/cancelación (módulo 05). | Debe |
| RF-CHK-9 | Al pago exitoso, **crear la orden** y mostrar página de confirmación con número de orden (módulo 06). | Debe |
| RF-CHK-10 | Revalidar disponibilidad y precios **antes** de cobrar; abortar con mensaje claro si algo cambió. | Debe |
| RF-CHK-11 | Ofrecer **crear cuenta** al invitado tras la compra (registro de un clic con su email). | Debería |
| RF-CHK-12 | Checkout **responsive** y con pasos claros (envío → entrega → pago → confirmación). | Debe |
| RF-CHK-13 | Para **retiro en local**: mostrar dirección/horario del local e instrucciones de retiro. | Debería |

## 5. Reglas de negocio
- **Zonas de envío:** las provincias/zonas de Panamá se agrupan en tarifas configurables por el admin (ej. Ciudad de Panamá, Interior, etc.). Definición de zonas exactas = pregunta abierta.
- **Retiro en local:** costo de envío = 0; no requiere dirección de envío pero sí datos de contacto.
- **Reserva de stock:** se crea al iniciar el checkout y vence a los **15 minutos**; si vence sin pago confirmado, se libera y el cliente debe reintentar.
- **ITBMS:** se aplica según configuración fiscal (pendiente confirmar si suplementos están exentos). El cálculo final manda sobre el estimado del carrito.
- **No se crea orden sin pago confirmado** (salvo métodos manuales futuros); el carrito solo se convierte en orden tras éxito del pago.
- **Total exacto:** el cliente siempre ve el total final antes de autorizar el pago.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Cart` (con `ShippingAddress`, `ShippingMethod`), `ShippingOption`, `ServiceZone`/`FulfillmentSet` (zonas y métodos de envío), `Region` (impuestos/moneda), `Promotion`, `PaymentCollection`/`PaymentSession`, `Order` (resultado). Medusa modela zonas de envío, opciones, impuestos y la transición carrito→orden.
**Extensiones propias:** configuración de zonas de envío de Panamá y la opción "retiro en local" como `ShippingOption` de costo 0; reglas de reserva de 15 min (vía Inventory + job de liberación).

## 7. Interfaces / puntos de integración
- **Store API (Medusa):** establecer dirección, listar/seleccionar opciones de envío, aplicar promociones, crear sesión de pago, completar carrito.
- **Módulo 05 (Pagos):** crear/confirmar pago con el proveedor elegido; manejar redirect/webhook.
- **Módulo 06 (Órdenes):** `completeCart` → creación de orden y confirmación.
- **Módulo 07 (Inventario):** reservar/liberar stock (15 min).
- **Módulo 10 (Email):** disparar confirmación de orden.

## 8. Criterios de aceptación
- [ ] (RF-CHK-1) Un invitado completa una compra de principio a fin sin crear cuenta.
- [ ] (RF-CHK-3/4) El cliente elige envío por su provincia y ve el costo correcto, o elige retiro en local con costo 0.
- [ ] (RF-CHK-5/6) El total final refleja subtotal − cupón + ITBMS + envío correctamente.
- [ ] (RF-CHK-7) Al iniciar checkout se reserva stock; si pasan 15 min sin pagar, la reserva se libera.
- [ ] (RF-CHK-8/9) Un pago exitoso crea la orden y muestra confirmación con número; un pago fallido/cancelado no crea orden y permite reintentar.
- [ ] (RF-CHK-10) Si un ítem se agotó/cambió de precio durante el checkout, se aborta el cobro con mensaje claro.
- [ ] (RF-CHK-11) Tras comprar como invitado, se ofrece crear cuenta con el email usado.
- [ ] (RF-CHK-12) El flujo es usable y claro en móvil.

## 9. Fuera de alcance
- Implementación interna de cada pasarela → módulo 05.
- Ciclo de vida posterior de la orden (preparación, envío, devoluciones) → módulo 06.
- Cálculo de envío por peso/dimensiones o integración con courier en tiempo real (post-MVP; MVP usa tarifa por zona).
- Facturación electrónica DGI (post-MVP).

## 10. Preguntas abiertas
1. **Zonas de envío y tarifas exactas:** ¿cómo agrupa el dueño las provincias y qué cobra por cada una? → requiere input del negocio.
2. **Dirección y horario del local** para la opción de retiro.
3. **ITBMS sobre suplementos:** ¿aplica o exento? → confirmar con el contador.
4. ¿Se exige teléfono de contacto obligatorio para coordinar entrega? Sí, es obligatorio.
