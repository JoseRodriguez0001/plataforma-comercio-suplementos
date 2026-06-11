import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/order-lookup?display_id=123&email=cliente@correo.com
// Consulta de orden para invitado: requiere número + email coincidentes.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const displayId = Number(req.query.display_id)
  const email = (req.query.email as string)?.toLowerCase().trim()

  if (!displayId || !email) {
    res.status(400).json({ message: "Se requieren display_id (número) y email" })
    return
  }

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "status",
      "payment_status",
      "fulfillment_status",
      "currency_code",
      "item_total",
      "shipping_total",
      "tax_total",
      "total",
      "created_at",
      "items.title",
      "items.quantity",
      "items.unit_price",
      "shipping_address.*",
      "fulfillment_detail.*",
    ],
    filters: { display_id: displayId },
  })

  // No revelar si la orden existe cuando el email no coincide.
  if (!order || (order as any).email?.toLowerCase() !== email) {
    res.status(404).json({ message: "Orden no encontrada" })
    return
  }

  res.json({ order })
}
