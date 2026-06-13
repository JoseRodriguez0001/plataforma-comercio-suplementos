import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { FULFILLMENT_EXT_MODULE } from "../../../../../modules/fulfillment-ext"
import FulfillmentExtModuleService from "../../../../../modules/fulfillment-ext/service"
import { orderShippedEmail, orderReadyForPickupEmail } from "../../../../../lib/email-templates"

// GET /admin/orders/:id/fulfillment-detail
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "fulfillment_detail.*"],
    filters: { id },
  })
  res.json({ fulfillment_detail: (order as any)?.fulfillment_detail ?? null })
}

// POST /admin/orders/:id/fulfillment-detail → crea/actualiza datos de cumplimiento
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const svc: FulfillmentExtModuleService = req.scope.resolve(FULFILLMENT_EXT_MODULE)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const body = (req.body as any) ?? {}
  const data = {
    method: body.method === "pickup" ? "pickup" : "shipping",
    carrier_id: body.carrier_id || null,
    tracking_number: body.tracking_number || null,
    shipped_at: body.shipped_at || null,
    estimated_delivery_at: body.estimated_delivery_at || null,
    delivery_note: body.delivery_note || null,
    ready_for_pickup_at: body.ready_for_pickup_at || null,
    picked_up_at: body.picked_up_at || null,
  }

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "email",
      "display_id",
      "fulfillment_detail.id",
      "fulfillment_detail.shipped_at",
      "fulfillment_detail.ready_for_pickup_at",
    ],
    filters: { id },
  })

  const prev = (order as any)?.fulfillment_detail

  let detail
  if (prev?.id) {
    detail = await (svc as any).updateFulfillmentDetails({ id: prev.id, ...data })
  } else {
    detail = await (svc as any).createFulfillmentDetails(data)
    await link.create({
      [Modules.ORDER]: { order_id: id },
      [FULFILLMENT_EXT_MODULE]: { fulfillment_detail_id: detail.id },
    })
  }

  // Emails al cliente en transiciones (solo la primera vez que se setea la fecha).
  const email = (order as any)?.email
  if (email) {
    const notif: any = req.scope.resolve(Modules.NOTIFICATION)
    const justShipped = data.method === "shipping" && !prev?.shipped_at && data.shipped_at
    const justReady = data.method === "pickup" && !prev?.ready_for_pickup_at && data.ready_for_pickup_at
    if (justShipped) {
      await notif.createNotifications({
        to: email,
        channel: "email",
        template: "order-shipped",
        content: orderShippedEmail(order, detail),
      })
    } else if (justReady) {
      await notif.createNotifications({
        to: email,
        channel: "email",
        template: "order-ready-pickup",
        content: orderReadyForPickupEmail(order),
      })
    }
  }

  res.json({ fulfillment_detail: detail })
}
