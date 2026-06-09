import { model } from "@medusajs/framework/utils"

/**
 * Marca del producto. Entidad propia para poder filtrar/facetar por marca
 * y mostrar logo. Relación: Brand 1—N Product (module link).
 */
export const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  logo_url: model.text().nullable(),
  description: model.text().nullable(),
  is_active: model.boolean().default(true),
})
