import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { INVENTORY_EXT_MODULE } from "../../../modules/inventory-ext"
import InventoryExtModuleService from "../../../modules/inventory-ext/service"

// GET /admin/stock-alert-settings → umbral global + overrides por variante
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const invExt: InventoryExtModuleService = req.scope.resolve(INVENTORY_EXT_MODULE)
  const all = await invExt.listStockAlertSettings({}, { take: 500 })
  const global = all.find((s: any) => s.scope === "global") ?? null
  const overrides = all.filter((s: any) => s.scope === "variant")
  res.json({ global, overrides })
}

// POST /admin/stock-alert-settings → upsert del umbral global o de un override por variante
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const invExt: InventoryExtModuleService = req.scope.resolve(INVENTORY_EXT_MODULE)
  const body = (req.body as any) ?? {}

  const scope = body.scope === "variant" ? "variant" : "global"
  if (scope === "variant" && !body.variant_id) {
    res.status(400).json({ message: "variant_id es obligatorio para un override por variante" })
    return
  }

  const selector: Record<string, unknown> =
    scope === "global"
      ? { scope: "global" }
      : { scope: "variant", variant_id: body.variant_id }

  const [existing] = await invExt.listStockAlertSettings(selector)

  const data: Record<string, unknown> = {}
  if (body.low_stock_threshold !== undefined) data.low_stock_threshold = body.low_stock_threshold
  if (body.expiry_alert_days !== undefined) data.expiry_alert_days = body.expiry_alert_days

  let setting
  if (existing) {
    setting = await invExt.updateStockAlertSettings({ id: (existing as any).id, ...data })
  } else {
    setting = await invExt.createStockAlertSettings({
      scope,
      variant_id: scope === "variant" ? body.variant_id : null,
      low_stock_threshold: (data.low_stock_threshold as number) ?? 5,
      expiry_alert_days: (data.expiry_alert_days as number) ?? 30,
    })
  }

  res.json({ setting })
}
