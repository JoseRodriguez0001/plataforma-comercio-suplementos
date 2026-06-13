import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INVENTORY_EXT_MODULE } from "../../../modules/inventory-ext"

// GET /admin/metrics → métricas que conviene calcular en el servidor.
// (Ventas/órdenes/top productos se calculan en la página desde /admin/orders,
//  cuyo endpoint nativo decora los totales correctamente.)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  let lowStockCount = 0
  try {
    const inv: any = req.scope.resolve(INVENTORY_EXT_MODULE)
    const [g] = await inv.listStockAlertSettings({ scope: "global" })
    const threshold = g?.low_stock_threshold ?? 5
    const { data: levels } = await query.graph({
      entity: "inventory_level",
      fields: ["available_quantity"],
    })
    lowStockCount = (levels as any[]).filter((l) => (l.available_quantity ?? 0) <= threshold).length
  } catch {
    // ignorar
  }

  res.json({ low_stock_count: lowStockCount })
}
