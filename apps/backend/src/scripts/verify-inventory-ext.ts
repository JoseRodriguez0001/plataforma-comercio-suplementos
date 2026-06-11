import { ExecArgs } from "@medusajs/framework/types"
import { INVENTORY_EXT_MODULE } from "../modules/inventory-ext"

/**
 * Verificación rápida del módulo inventory_ext: asegura el umbral global y
 * registra un ajuste de prueba. Uso: npx medusa exec src/scripts/verify-inventory-ext.ts
 */
export default async function verifyInventoryExt({ container }: ExecArgs) {
  const inv: any = container.resolve(INVENTORY_EXT_MODULE)

  const globals = await inv.listStockAlertSettings({ scope: "global" })
  if (!globals.length) {
    await inv.createStockAlertSettings({ scope: "global", low_stock_threshold: 5, expiry_alert_days: 30 })
    console.log("✔ Umbral global creado (stock<5, vencimiento 30d)")
  } else {
    console.log("• Umbral global ya existía")
  }

  const adj = await inv.createInventoryAdjustments({
    inventory_item_id: "iitem_demo",
    variant_id: "variant_demo",
    delta: 10,
    reason: "restock",
    note: "Ajuste de prueba",
  })
  console.log(`✔ Ajuste registrado: ${adj.reason} delta=${adj.delta}`)

  const settings = await inv.listStockAlertSettings()
  const adjustments = await inv.listInventoryAdjustments()
  console.log(`✔ settings=${settings.length}, adjustments=${adjustments.length}`)
}
