import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { adjustStockWorkflow } from "../../../workflows/adjust-stock"
import { INVENTORY_EXT_MODULE } from "../../../modules/inventory-ext"
import InventoryExtModuleService from "../../../modules/inventory-ext/service"

// GET /admin/inventory-adjustments?inventory_item_id=... → historial de ajustes
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const invExt: InventoryExtModuleService = req.scope.resolve(INVENTORY_EXT_MODULE)
  const filters: Record<string, unknown> = {}
  const itemId = req.query.inventory_item_id as string | undefined
  if (itemId) filters.inventory_item_id = itemId

  const adjustments = await invExt.listInventoryAdjustments(filters, {
    order: { created_at: "DESC" },
    take: 50,
  })
  res.json({ adjustments })
}

// POST /admin/inventory-adjustments → aplica delta al stock + registra el ajuste
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const body = (req.body as any) ?? {}

  const { inventory_item_id, delta, reason, note, variant_id } = body
  if (!inventory_item_id || typeof delta !== "number" || !reason) {
    res.status(400).json({
      message: "Se requieren inventory_item_id, delta (número) y reason",
    })
    return
  }

  // Ubicación: la enviada o la única por defecto
  let location_id = body.location_id as string | undefined
  if (!location_id) {
    const { data: [loc] } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    })
    location_id = loc?.id
  }
  if (!location_id) {
    res.status(400).json({ message: "No hay ubicación de stock disponible" })
    return
  }

  const admin_user_id = (req as any).auth_context?.actor_id ?? null

  const { result } = await adjustStockWorkflow(req.scope).run({
    input: {
      inventory_item_id,
      location_id,
      delta,
      reason,
      note: note ?? null,
      variant_id: variant_id ?? null,
      admin_user_id,
    },
  })

  res.json({
    stock: result.applied,
    adjustment: result.record,
  })
}
