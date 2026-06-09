# Extensiones propias (modelos custom)

Modelos que **no existen en Medusa** y se construyen como módulos custom, enlazados al core con **module links**. Tipos en notación Medusa (`text`, `number`, `boolean`, `dateTime`, `enum`, `json`, `id`). Todos llevan `id` (PK con prefijo), `created_at`, `updated_at`, `deleted_at` salvo que se indique.

Leyenda de relaciones: **(link)** = module link a otro módulo; **(fk)** = relación interna dentro del mismo módulo.

---

## Módulo `supplement` — specs 01, 02, 07

### `Brand` (marca)
Marca del producto, como entidad para poder filtrar/facetar por marca y mostrar logo.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `brand_…` |
| name | text | único; nombre de la marca |
| slug | text | único; para URL/filtro |
| logo_url | text | nullable (imagen en R2) |
| description | text | nullable |
| is_active | boolean | default true |

- **Relación:** `Brand` 1—N `Product` **(link)**.

### `SupplementInfo` (atributos de suplemento, por producto)
Información del rubro que Medusa no modela. Uno a uno con el producto.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `supp_…` |
| ingredientes | text | lista/markdown |
| modo_de_uso | text | |
| advertencias | text | obligatorio (texto de salud) |
| tamano_porcion | text | ej. "1 scoop (30 g)" |
| porciones_por_envase | number | nullable |
| registro_sanitario | text | nullable (si aplica en Panamá) |
| es_vegano | boolean | default false (faceta) |
| sin_azucar | boolean | default false (faceta) |
| sin_gluten | boolean | default false (faceta) |
| apto_vegetariano | boolean | default false (faceta) |

- **Relación:** `SupplementInfo` 1—1 `Product` **(link)**.
- Atributos dietéticos adicionales no contemplados → usar `ProductTag` nativo.

### `VariantExpiry` (vencimiento por variante)
Soporta la **alerta de vencimiento simple** (RF-INV-13). Una por variante.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `vexp_…` |
| expiration_date | dateTime | nullable; fecha de vencimiento del lote vigente |
| lot_code | text | nullable; código de lote informativo (sin FEFO en MVP) |

- **Relación:** `VariantExpiry` 1—1 `ProductVariant` **(link)**.
- *Nota:* trazabilidad por lote/FEFO es post-MVP; aquí solo un dato por variante.

---

## Módulo `review` — spec 17

### `Review`
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `rev_…` |
| product_id | id | **(link)** a `Product` |
| customer_id | id | **(link)** a `Customer` |
| order_id | id | **(link)** a `Order`; respalda la compra verificada |
| rating | number | entero 1–5 (validado) |
| title | text | nullable |
| comment | text | con límite de longitud (antiabuso) |
| status | enum | `pending` \| `approved` \| `hidden` (default `approved`: moderación posterior) |
| verified_purchase | boolean | default true (en MVP solo compradores reseñan) |
| owner_reply | text | nullable; respuesta pública del dueño |
| owner_reply_at | dateTime | nullable |

- **Restricción única:** `(product_id, customer_id)` → una reseña por cliente y producto.
- **Reglas:** solo `customer` con `order` **entregada** que incluya el producto; el cliente puede editar/eliminar la suya; promedio se calcula con `status = approved`.

### `ProductRatingSummary` (agregado por producto)
Promedio y conteo materializados para mostrar rápido en ficha/tarjetas y ordenar por "mejor valorado".
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `rsum_…` |
| product_id | id | **(link)** a `Product`; único |
| average_rating | number | decimal (ej. 4.6); solo reseñas aprobadas |
| review_count | number | conteo de reseñas aprobadas |
| last_recalculated_at | dateTime | |

- Se recalcula vía workflow al crear/editar/moderar/eliminar una reseña. (Alternativa: calcular on-the-fly; se materializa por rendimiento y por el orden "mejor valorado" del módulo 02.)

---

## Módulo `fulfillment_ext` — spec 06

### `FulfillmentDetail` (datos de cumplimiento manual)
Extiende el cumplimiento con los datos que el dueño registra a mano. Uno a uno con `Fulfillment` (o con `Order` si se prefiere a nivel orden).
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `fdet_…` |
| method | enum | `shipping` \| `pickup` |
| carrier_id | id | nullable; **(fk)** a `ShippingCarrier` (solo envío) |
| tracking_number | text | nullable (guía) |
| shipped_at | dateTime | nullable (fecha de envío) |
| estimated_delivery_at | dateTime | nullable |
| delivery_note | text | nullable (instrucciones internas) |
| ready_for_pickup_at | dateTime | nullable (solo retiro) |
| picked_up_at | dateTime | nullable (registro de retiro) |

- **Relación:** `FulfillmentDetail` 1—1 `Fulfillment` **(link)**.
- **Validación:** campos esenciales según `method` (envío: carrier + shipped_at; retiro: ready_for_pickup_at).

### `ShippingCarrier` (transportistas configurables)
Lista editable por el dueño para precargar el campo "transportista".
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `carr_…` |
| name | text | ej. "Uno Express", "Mensajería propia", "Correos de Panamá" |
| is_active | boolean | default true |
| sort_order | number | nullable |

---

## Módulo `inventory_ext` — spec 07

### `StockAlertSetting` (umbral de stock bajo y aviso de vencimiento)
Configuración global + override por variante.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `salert_…` |
| scope | enum | `global` \| `variant` |
| variant_id | id | nullable; **(link)** a `ProductVariant` cuando `scope=variant` |
| low_stock_threshold | number | unidades (global sugerido: 5) |
| expiry_alert_days | number | días de aviso previo al vencimiento (ej. 60/30) |

- Debe existir **una** fila `scope=global`; las `scope=variant` la sobrescriben.

### `InventoryAdjustment` (ajuste manual con motivo)
Traza de ajustes manuales de stock (RF-INV-10).
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `iadj_…` |
| inventory_item_id | id | **(link)** a `InventoryItem` |
| variant_id | id | **(link)** a `ProductVariant` (denormalizado para reporte) |
| delta | number | + reabastecimiento / − merma |
| reason | enum | `restock` \| `shrinkage` \| `correction` \| `other` |
| note | text | nullable |
| admin_user_id | id | **(link)** a `User` (quién lo hizo) |

- Solo `created_at` (registro inmutable; sin update/delete).

---

## Módulo `payment_audit` — spec 05

### `PaymentAttemptLog` (auditoría/idempotencia de pagos)
Trazabilidad de cada intento y de los webhooks, base de la idempotencia y la conciliación.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `paylog_…` |
| provider | enum | `yappy` \| `paguelofacil` \| `mock` (extensible: `stripe`) |
| order_id | id | nullable; **(link)** débil a `Order` |
| payment_collection_id | id | nullable; referencia a `PaymentCollection` |
| idempotency_key | text | único; evita doble cobro/orden |
| external_reference | text | nullable; id de la transacción en la pasarela |
| event_type | text | ej. `initiated`, `webhook_received`, `confirmed`, `failed`, `refunded` |
| status | enum | `pending` \| `success` \| `failed` \| `canceled` \| `refunded` |
| amount | number | monto del intento (en la moneda de la región) |
| raw_payload | json | payload crudo (webhook/respuesta) para diagnóstico |
| signature_valid | boolean | resultado de verificación de firma del webhook |

- Solo `created_at` (log append-only).
- *Nota:* las **credenciales** de cada pasarela van en variables de entorno, **no** en BD.

---

## Módulo `compliance` — specs 08, 13

### `CustomerConsent` (Ley 81)
Registro de consentimiento de datos personales.
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `cons_…` |
| customer_id | id | **(link)** a `Customer` |
| consent_type | enum | `privacy_policy` \| `marketing` \| `cookies` |
| granted | boolean | |
| policy_version | text | versión del documento aceptado |
| granted_at | dateTime | |

- La **baja de cuenta** (autoservicio con salvaguarda de órdenes activas) es lógica de aplicación; usa el borrado/anonimización del `Customer` nativo, no requiere tabla nueva.

---

## Módulo `audit` — specs 09, 13

### `AdminAuditLog` (acciones administrativas sensibles)
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `alog_…` |
| admin_user_id | id | **(link)** a `User` |
| action | text | ej. `order.cancel`, `payment.refund`, `price.update` |
| entity_type | text | ej. `order`, `product` |
| entity_id | text | id de la entidad afectada |
| metadata | json | nullable; detalle del cambio |
| ip_address | text | nullable |

- Solo `created_at` (append-only).

---

## Módulo `notification_ext` — spec 10 (opcional)

### `NotificationLog` (solo si lo nativo no basta)
| Campo | Tipo | Notas |
|---|---|---|
| id | id | `nlog_…` |
| to | text | destinatario |
| template | text | plantilla usada |
| channel | enum | `email` (futuro: `whatsapp`) |
| status | enum | `sent` \| `failed` \| `retrying` |
| provider_message_id | text | nullable |
| error | text | nullable |

- Solo `created_at`. Evaluar primero el registro **nativo** del Notification Module antes de implementar esta tabla.

---

## Notas de integridad y rendimiento
- **Índices recomendados:** `Review(product_id, status)`, `Review(customer_id)`, `PaymentAttemptLog(idempotency_key)` (único), `PaymentAttemptLog(order_id)`, `InventoryAdjustment(inventory_item_id)`, `Brand(slug)` (único), `ProductRatingSummary(product_id)` (único).
- **Borrado:** modelos de log/auditoría (`PaymentAttemptLog`, `AdminAuditLog`, `InventoryAdjustment`, `NotificationLog`) son **append-only** (sin update/delete).
- **Consistencia cross-módulo:** las relaciones entre módulos son por **link** (resueltas por el query graph de Medusa), no por FK física; la integridad la garantizan los workflows (ej. crear `Review` valida que exista la `Order` entregada).
- **Migraciones:** cada módulo custom genera sus migraciones; se aplican en el deploy (RF-INF-12).
