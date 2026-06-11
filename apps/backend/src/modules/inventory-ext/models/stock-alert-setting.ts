import { model } from "@medusajs/framework/utils"

/**
 * Configuración de umbral de stock bajo y aviso de vencimiento.
 * Una fila scope="global" (por defecto) + overrides scope="variant".
 */
export const StockAlertSetting = model.define("stock_alert_setting", {
  id: model.id().primaryKey(),
  scope: model.enum(["global", "variant"]).default("global"),
  variant_id: model.text().nullable(), // referencia a ProductVariant (link lógico) cuando scope=variant
  low_stock_threshold: model.number().default(5),
  expiry_alert_days: model.number().default(30),
})
