import { model } from "@medusajs/framework/utils"

/**
 * Vencimiento por variante (alerta de vencimiento simple, RF-INV-13).
 * Un dato por variante; trazabilidad por lote/FEFO es post-MVP.
 * Relación: VariantExpiry 1—1 ProductVariant (module link).
 */
export const VariantExpiry = model.define("variant_expiry", {
  id: model.id().primaryKey(),
  expiration_date: model.dateTime().nullable(),
  lot_code: model.text().nullable(),
})
