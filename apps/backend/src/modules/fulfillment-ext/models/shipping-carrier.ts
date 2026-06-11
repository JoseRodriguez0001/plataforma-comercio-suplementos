import { model } from "@medusajs/framework/utils"

/**
 * Transportistas configurables por el dueño (para precargar el campo
 * "transportista" en el cumplimiento). Ej: Uno Express, mensajería propia, etc.
 */
export const ShippingCarrier = model.define("shipping_carrier", {
  id: model.id().primaryKey(),
  name: model.text(),
  is_active: model.boolean().default(true),
  sort_order: model.number().nullable(),
})
