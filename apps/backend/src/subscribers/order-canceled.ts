import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { orderCanceledEmail } from "../lib/email-templates"

// order.canceled → aviso de cancelación al cliente.
export default async function orderCanceledHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email", "currency_code"],
    filters: { id: event.data.id },
  })
  if (!order?.email) return

  await notif.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-canceled",
    content: orderCanceledEmail(order),
  })
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
