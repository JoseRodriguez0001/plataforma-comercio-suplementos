# Modelo nativo de Medusa (referencia)

Estos modelos los provee **Medusa v2 de fábrica**. **No se modifican ni se redefinen**; se usan tal cual y se extienden por *module link* cuando hace falta (ver [`extensiones.md`](extensiones.md)). Esta página documenta qué nos da el core para que el esquema custom no duplique nada.

## Catálogo (Product Module) — specs 01, 02
- **Product** — producto base: título, descripción, handle/slug, estado (activo/borrador), imágenes, metadata, SEO.
- **ProductVariant** — variante vendible: SKU, opciones, vínculo a precios e inventario.
- **ProductOption / ProductOptionValue** — ejes de variante (sabor, tamaño).
- **ProductCategory** — categorías jerárquicas.
- **ProductCollection** — colecciones de marketing (destacados, etc.).
- **ProductTag / ProductType** — etiquetas y tipo (útiles para facetas de búsqueda).
- **Image** — galería de producto.

## Precios (Pricing Module) — specs 01, 04, 15
- **Price / PriceSet / PriceList** — precios por **moneda y región**. Aquí vive el dinero; las extensiones no guardan precios.

## Carrito (Cart Module) — spec 03
- **Cart**, **LineItem**, **ShippingMethod (en carrito)**, totales e impuestos calculados, asociación a `Region`/`Customer`.

## Órdenes (Order Module) — spec 06
- **Order**, **OrderLineItem** — orden y sus líneas; `display_id` (número de orden), email (sirve para lookup de invitado).
- **OrderChange / OrderChangeAction** — historial/auditoría de cambios de la orden.
- **Return**, **OrderClaim**, **Exchange** — devoluciones (parcial post-MVP).
- Estados nativos: **payment_status** y **fulfillment_status**.

## Cumplimiento (Fulfillment Module) — specs 04, 06
- **FulfillmentSet**, **ServiceZone**, **GeoZone** — **zonas de envío** (se configuran las provincias/zonas de Panamá aquí; sin tabla custom).
- **ShippingOption / ShippingOptionRule** — métodos de envío y **opción "retiro en local"** (option de precio 0, sin dirección).
- **Fulfillment**, **FulfillmentItem**, **FulfillmentLabel** — el cumplimiento en sí (se extiende con `FulfillmentDetail`, ver extensiones).

## Inventario (Inventory Module) — spec 07
- **InventoryItem** — ítem de inventario (vinculado a variante).
- **InventoryLevel** — stock por **StockLocation** (una ubicación en MVP).
- **ReservationItem** — **reservas** (la ventana de 15 min se apoya aquí).
- **StockLocation** — ubicación(es) de stock.

## Pagos (Payment Module) — spec 05
- **PaymentCollection**, **PaymentSession**, **Payment**, **Refund**, **PaymentProvider** — ciclo de pago. Yappy/PagueloFacil/mock se registran como **providers** (la config va por entorno; la auditoría propia es `PaymentAttemptLog`).

## Clientes y auth (Customer + Auth Module) — spec 08
- **Customer** — perfil del cliente (email único).
- **CustomerAddress** — libreta de direcciones (predeterminada incluida).
- **CustomerGroup** — segmentos (útil a futuro).
- **AuthIdentity / ProviderIdentity** — credenciales: proveedor `emailpass` **y Google** (login social MVP).

## Promociones (Promotion Module) — specs 03, 04, 09
- **Promotion**, **PromotionRule**, **Campaign** — cupones/descuentos (activos en lanzamiento).

## Impuestos (Tax Module) — spec 04
- **TaxRegion**, **TaxRate**, **TaxRateRule** — ITBMS parametrizable por región (no hardcodear).

## Regiones y canales (Region + Sales Channel) — specs 04, 15
- **Region**, **Currency** — Panamá/USD en MVP; base multi-región para expansión.
- **SalesChannel** — canal de venta (web).

## Administración y notificaciones — specs 09, 10
- **User** — usuarios administradores (login admin separado; el dueño en MVP). Se audita con `AdminAuditLog`.
- **Notification** — registro nativo de notificaciones + **providers** (Resend). Se complementa con `NotificationLog` solo si se necesita más detalle.

## Lo que NO existe nativo (y por eso se crea custom)
- **Reseñas/valoraciones** → módulo `review`.
- **Atributos de suplemento, marca, vencimiento por variante** → módulo `supplement`.
- **Datos de cumplimiento manual** (transportista, guía, fechas, retiro) → módulo `fulfillment_ext`.
- **Umbrales de stock/vencimiento y ajustes con motivo** → módulo `inventory_ext`.
- **Auditoría de intentos de pago** → módulo `payment_audit`.
- **Consentimiento Ley 81 y auditoría admin** → módulos `compliance` / `audit`.
