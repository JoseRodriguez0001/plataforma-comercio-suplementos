import { model } from "@medusajs/framework/utils"

/**
 * Ajuste manual de stock con motivo (RF-INV-10). Registro append-only:
 * se crea, no se edita ni borra (auditoría del inventario).
 */
export const InventoryAdjustment = model.define("inventory_adjustment", {
  id: model.id().primaryKey(),
  inventory_item_id: model.text(),
  variant_id: model.text().nullable(),
  delta: model.number(), // + reabastecimiento / − merma
  reason: model.enum(["restock", "shrinkage", "correction", "other"]),
  note: model.text().nullable(),
  admin_user_id: model.text().nullable(),
})
