# Plan de implementación — Carrito de compras

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Borrador

## 1. Enfoque general
El **Cart Module de Medusa v2** cubre prácticamente todo de fábrica: carrito, líneas, recálculo de totales, impuestos por región, promociones y asociación a cliente. La estrategia es **usarlo tal cual** y añadir solo: (a) la **lógica de fusión** carrito-invitado ↔ cliente al login, y (b) un **job de expiración**. El front mantiene el `cart_id` del invitado en almacenamiento local/cookie para la persistencia.

## 2. Primitivas de Medusa usadas
- **Cart Module:** `Cart`, `LineItem`, totales, impuestos, asociación a `Region`/`Customer`.
- **Promotion Module:** cupones/descuentos (RF-CAR-10).
- **Workflows:** `addToCart`, `updateLineItem`, `completeCart` (transición a orden en módulo 04).
- **Inventory Module:** verificación de disponibilidad (RF-CAR-7, coord. módulo 07).
- **Eventos + Worker:** expiración de carritos.

## 3. Extensiones propias
- **Workflow de fusión de carrito** disparado al login: combina líneas del carrito de invitado con el del cliente, sumando cantidades con tope de stock (RF-CAR-5).
- **Scheduled job** de expiración/limpieza de carritos abandonados (RF-CAR-11).
- **Persistencia en cliente:** manejo del `cart_id` de invitado (cookie/localStorage) en el storefront.
- **Detección de cambios:** al cargar el carrito, revalidar precios/disponibilidad y señalizar diferencias (RF-CAR-8).

## 4. Desglose de tareas
- [ ] Integrar Cart Module y operaciones CRUD de líneas en el storefront (RF-CAR-1,2,3).
- [ ] Persistencia del carrito de invitado (cookie/localStorage) (RF-CAR-4).
- [ ] Workflow de fusión al login (RF-CAR-5).
- [ ] Mostrar totales: subtotal + ITBMS estimado + total (RF-CAR-6).
- [ ] Validación de disponibilidad al agregar y al avanzar (RF-CAR-7).
- [ ] Revalidación y avisos de precio/stock al abrir el carrito (RF-CAR-8).
- [ ] Indicador de ítems en el header (RF-CAR-9).
- [ ] Aplicar/quitar cupón (RF-CAR-10, si entra en lanzamiento).
- [ ] Job de expiración de carritos (RF-CAR-11).

## 5. Orden de trabajo y dependencias
Requiere módulo 01 (productos/precios) y coordinación con 07 (inventario). Secuencia: CRUD de carrito + totales → persistencia invitado → validación de stock → fusión al login (necesita 08) → avisos de cambios → cupones/expiración.
Habilita: módulo 04 (checkout) consume `completeCart`.

## 6. Estrategia de pruebas
- **Unitarias:** regla de tope de stock por línea; lógica de fusión (suma con límite).
- **Integración:** crear carrito invitado → login → verificar fusión correcta; aplicar cupón y verificar total.
- **E2E:** agregar/editar/eliminar, recargar (persistencia), llegar a checkout.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Pérdida del carrito al iniciar sesión | Frustración/abandono | Workflow de fusión probado con casos de variante repetida y stock límite. |
| Sobreventa por carrito desfasado del stock | Orden incumplible | Revalidar disponibilidad en checkout/pago; definir política de reserva (pregunta abierta). |
| ITBMS estimado ≠ final | Confusión en total | Marcar como "estimado" en carrito; confirmar en checkout; resolver exención fiscal. |

## 8. Definición de "hecho"
- [ ] RF-CAR "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Fusión invitado→cliente verificada sin pérdida de líneas.
- [ ] Persistencia del carrito de invitado entre recargas/sesiones.
- [ ] Bloqueo de cantidades por encima del stock.
- [ ] Totales (subtotal/ITBMS/total) coherentes y el header refleja los ítems.
