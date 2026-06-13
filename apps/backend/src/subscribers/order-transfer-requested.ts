import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { orderTransferEmail } from "../lib/email-templates"

// order.transfer_requested → email al cliente con el enlace para confirmar la
// vinculación de una orden de invitado a su cuenta (RF-CTA-8).
export default async function orderTransferRequestedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; order_change_id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "email", "display_id"],
    filters: { id: event.data.id },
  })
  if (!order?.email) return

  // El token del transfer vive en la acción del order_change.
  const {
    data: [change],
  } = await query.graph({
    entity: "order_change",
    fields: ["id", "actions.details"],
    filters: { id: event.data.order_change_id },
  })
  let token: string | undefined
  for (const a of ((change as any)?.actions ?? [])) {
    if (a?.details?.token) token = a.details.token
  }
  if (!token) return

  const base = process.env.STOREFRONT_URL || "http://localhost:8000"
  const url = `${base}/account/claim-order?order_id=${order.id}&token=${encodeURIComponent(token)}`

  await notif.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-transfer",
    content: orderTransferEmail({ display_id: order.display_id, url }),
  })
}

export const config: SubscriberConfig = {
  event: "order.transfer_requested",
}
