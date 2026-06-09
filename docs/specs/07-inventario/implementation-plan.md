# Plan de implementación — Inventario

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobada

## 1. Enfoque general
El **Inventory Module de Medusa v2** ya provee inventario por variante, **multi-ubicación**, **reservas** y niveles, con operaciones atómicas y vínculo a las variantes/ventas. La estrategia es **apoyarse en él de lleno**: configurar una ubicación de stock, usar sus reservas para la ventana de 15 min, su consumo al crear orden y su devolución al cancelar. Se construye a medida solo: la **expiración de reservas (job)**, las **alertas de stock bajo** y el **registro de ajustes manuales con motivo**.

## 2. Primitivas de Medusa usadas
- **Inventory Module:** `InventoryItem`, `InventoryLevel`, `ReservationItem`, `StockLocation`.
- **Reservas nativas:** creadas al iniciar checkout (módulo 04) y convertidas en consumo al completar la orden.
- **Operaciones atómicas** del módulo para prevenir sobreventa (RF-INV-7).
- **Eventos + Worker:** job de liberación de reservas vencidas; job de evaluación de umbrales.
- **Admin Dashboard:** edición de stock nativa + extensión para umbral y ajustes con motivo.

## 3. Extensiones propias
- **Job de expiración de reservas (15 min):** libera reservas vencidas y restaura disponibilidad (compartido con módulos 03/04).
- **Umbral de stock bajo:** configuración global + override por variante; **subscriber/job** que detecta cruces y dispara alerta (módulo 10).
- **Ajustes manuales con motivo:** acción de admin que registra delta + motivo + autor (RF-INV-10).
- **Exposición de disponibilidad** consistente a catálogo/carrito (RF-INV-6/8).
- **Alerta de vencimiento simple:** atributo `fecha_vencimiento` por variante (en atributos de suplemento, módulo 01) + **job diario** que detecta variantes a N días de vencer y avisa al dueño (RF-INV-13). Reutiliza el patrón del job de stock bajo.

## 4. Desglose de tareas
- [ ] Configurar `StockLocation` única y niveles por variante (RF-INV-1,11).
- [ ] Integrar reservas al iniciar checkout (RF-INV-2 — coord. módulo 04).
- [ ] Job de expiración/liberación de reservas a 15 min (RF-INV-3).
- [ ] Consumo al crear orden y devolución al cancelar (RF-INV-4,5 — coord. módulo 06).
- [ ] Cálculo y exposición de disponibilidad + estado "agotado" (RF-INV-6,8).
- [ ] Verificación de atomicidad/concurrencia contra sobreventa (RF-INV-7).
- [ ] Umbral de stock bajo + alerta al dueño (RF-INV-9 — coord. módulo 10).
- [ ] Ajustes manuales con motivo y traza (RF-INV-10).
- [ ] Alerta de vencimiento simple: campo + job diario (RF-INV-13 — coord. módulos 01 y 10).
- [ ] (Opcional) variantes sin gestión de stock (RF-INV-12).

## 5. Orden de trabajo y dependencias
Base para 03/04/06. Secuencia: ubicación + niveles → disponibilidad/"agotado" → reservas + job de expiración → consumo/devolución (con 06) → concurrencia → alertas + ajustes manuales.
Es **dependencia dura** de la reserva de 15 min del checkout y del consumo de órdenes.

## 6. Estrategia de pruebas
- **Concurrencia:** prueba con stock=1 y dos checkouts simultáneos → solo uno completa (RF-INV-7).
- **Integración:** reserva→expiración libera stock; orden→consumo descuenta; cancelación→devuelve.
- **Unitarias:** cálculo de disponibilidad (stock − reservas); detección de umbral de stock bajo.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Sobreventa por carreras de concurrencia | Orden incumplible | Usar operaciones atómicas del Inventory Module; prueba explícita de concurrencia. |
| Reservas vencidas no liberadas | Stock "fantasma" no vendible | Job idempotente de liberación + verificación periódica. |
| Stock no devuelto al cancelar | Inventario erróneo | Devolución dentro del workflow transaccional de cancelación (módulo 06). |
| Umbral mal configurado | Alertas inútiles o tardías | Default sensato + override por variante; validar con casos reales. |

## 8. Definición de "hecho"
- [ ] RF-INV "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Prueba de concurrencia sin sobreventa superada.
- [ ] Reserva de 15 min con liberación automática verificada.
- [ ] Consumo al crear orden y devolución al cancelar verificados.
- [ ] Disponibilidad y "agotado" correctos en catálogo/carrito.
- [ ] Alerta de stock bajo y ajustes manuales con motivo funcionando.
