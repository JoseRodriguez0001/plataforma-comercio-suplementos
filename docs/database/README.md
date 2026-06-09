# Esquema de base de datos

Diseño de datos de la tienda. **Fuente de verdad:** las specs en [`../specs/`](../specs/). Este directorio traduce esas specs a un modelo de datos concreto.

## Principio rector
Medusa v2 aporta la mayor parte del esquema (catálogo, carrito, órdenes, clientes, inventario, pagos, regiones, promociones, notificaciones). **No se redefine ni se forkea nada de eso.** Solo se diseñan **extensiones propias** como **módulos custom** enlazados al core mediante **module links**. Así Medusa puede actualizarse sin romper lo nuestro.

## Documentos
- [`modelo-nativo.md`](modelo-nativo.md) — qué modelos **nativos de Medusa** usamos y para qué (referencia, no se modifican).
- [`extensiones.md`](extensiones.md) — **modelos custom** propios: campos, tipos, relaciones y enlaces al core.

## Convenciones
- **Motor:** PostgreSQL (gestionado por Medusa/MikroORM). Tablas en `snake_case`.
- **IDs:** strings con prefijo por entidad (estilo Medusa, ej. `rev_01H…`). No autoincrementales.
- **Timestamps:** `created_at`, `updated_at` y `deleted_at` (borrado lógico) en todos los modelos custom.
- **Dinero:** se delega al modelo de precios de Medusa (por moneda/región); las extensiones **no** guardan precios.
- **Relaciones cross-módulo:** vía **module link** (no foreign keys directas entre módulos), para respetar el aislamiento modular de Medusa.
- **Secretos/credenciales:** NUNCA en BD ni repo (van en variables de entorno) — ver módulo 13.

## Mapa de extensiones (resumen)
| Módulo custom | Modelos | Se enlaza a (core) | Spec |
|---|---|---|---|
| `supplement` | `Brand`, `SupplementInfo`, `VariantExpiry` | `Product`, `ProductVariant` | 01, 07 |
| `review` | `Review`, `ProductRatingSummary` | `Product`, `Customer` | 17 |
| `fulfillment_ext` | `FulfillmentDetail`, `ShippingCarrier` | `Fulfillment`/`Order` | 06 |
| `inventory_ext` | `StockAlertSetting`, `InventoryAdjustment` | `ProductVariant`/`InventoryItem` | 07 |
| `payment_audit` | `PaymentAttemptLog` | `PaymentCollection`/`Order` (referencia débil) | 05 |
| `compliance` | `CustomerConsent` | `Customer` | 08, 13 |
| `audit` | `AdminAuditLog` | `User` (admin) | 09, 13 |
| `notification_ext` | `NotificationLog` (opcional) | — | 10 |

> Las **zonas de envío y la opción de retiro** NO son extensión: se modelan con `FulfillmentSet`/`ServiceZone`/`ShippingOption` **nativos** (solo configuración/seed). Ver [`modelo-nativo.md`](modelo-nativo.md).

## Diagrama entidad-relación (alto nivel)

```
        ┌──────────────────────── NÚCLEO MEDUSA ────────────────────────┐
        │                                                                │
        │   Product ──1:N── ProductVariant ──N:1── InventoryItem         │
        │      │                  │                      │               │
        │   Category, Tag,     Price (Pricing)        InventoryLevel,    │
        │   Collection                                 Reservation       │
        │                                                                │
        │   Customer ──1:N── Order ──1:N── OrderLineItem                 │
        │      │               │                                         │
        │   CustomerAddress  Fulfillment, Payment, Refund, Return        │
        │                                                                │
        │   Region, Currency, TaxRegion, Promotion, SalesChannel         │
        │   FulfillmentSet ─ ServiceZone ─ ShippingOption (zonas+retiro) │
        │   User (admin), Notification                                   │
        └───────▲────────▲───────────▲───────────▲──────────▲───────────┘
        link │       │link        │link        │link       │link
   ┌─────────┴──┐ ┌──┴────────┐ ┌─┴─────────┐ ┌┴────────┐ ┌┴───────────┐
   │ supplement │ │  review   │ │fulfillment│ │inventory│ │  payment   │
   │            │ │           │ │   _ext    │ │  _ext   │ │  _audit    │
   │ Brand      │ │ Review    │ │Fulfillment│ │StockAle-│ │PaymentAtt- │
   │ Supplement │ │ ProductRa-│ │  Detail   │ │rtSetting│ │ emptLog    │
   │   Info     │ │ tingSumm- │ │ ShippingC-│ │Inventory│ │            │
   │ VariantEx- │ │   ary     │ │  arrier   │ │Adjustm- │ │            │
   │  piry      │ │           │ │           │ │  ent    │ │            │
   └────────────┘ └───────────┘ └───────────┘ └─────────┘ └────────────┘
   ┌────────────┐ ┌───────────┐ ┌──────────────┐
   │ compliance │ │   audit   │ │notification_ │
   │ Customer-  │ │ AdminAud- │ │    ext       │
   │  Consent   │ │  itLog    │ │NotificationL-│
   │            │ │           │ │   og (opc.)  │
   └────────────┘ └───────────┘ └──────────────┘
```
