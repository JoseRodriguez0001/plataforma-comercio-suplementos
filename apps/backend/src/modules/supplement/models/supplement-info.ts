import { model } from "@medusajs/framework/utils"

/**
 * Atributos de suplemento por producto (lo que Medusa no modela).
 * Relación: SupplementInfo 1—1 Product (module link).
 */
export const SupplementInfo = model.define("supplement_info", {
  id: model.id().primaryKey(),
  ingredientes: model.text().nullable(),
  modo_de_uso: model.text().nullable(),
  advertencias: model.text(),
  tamano_porcion: model.text().nullable(),
  porciones_por_envase: model.number().nullable(),
  registro_sanitario: model.text().nullable(),
  // Flags dietéticos (facetas de búsqueda)
  es_vegano: model.boolean().default(false),
  sin_azucar: model.boolean().default(false),
  sin_gluten: model.boolean().default(false),
  apto_vegetariano: model.boolean().default(false),
})
