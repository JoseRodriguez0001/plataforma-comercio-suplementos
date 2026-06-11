import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FULFILLMENT_EXT_MODULE } from "../../../../modules/fulfillment-ext"
import FulfillmentExtModuleService from "../../../../modules/fulfillment-ext/service"

// DELETE /admin/shipping-carriers/:id → eliminar transportista
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const svc: FulfillmentExtModuleService = req.scope.resolve(FULFILLMENT_EXT_MODULE)
  const { id } = req.params
  await svc.deleteShippingCarriers(id)
  res.json({ id, deleted: true })
}
