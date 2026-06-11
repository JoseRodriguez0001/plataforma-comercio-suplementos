import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FULFILLMENT_EXT_MODULE } from "../../../modules/fulfillment-ext"
import FulfillmentExtModuleService from "../../../modules/fulfillment-ext/service"

// GET /admin/shipping-carriers → lista de transportistas
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const svc: FulfillmentExtModuleService = req.scope.resolve(FULFILLMENT_EXT_MODULE)
  const carriers = await svc.listShippingCarriers({}, { order: { sort_order: "ASC", name: "ASC" } })
  res.json({ shipping_carriers: carriers })
}

// POST /admin/shipping-carriers → crear transportista
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const svc: FulfillmentExtModuleService = req.scope.resolve(FULFILLMENT_EXT_MODULE)
  const carrier = await svc.createShippingCarriers(req.body as any)
  res.status(201).json({ shipping_carrier: carrier })
}
