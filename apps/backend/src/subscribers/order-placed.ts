import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { orderConfirmationEmail, newOrderOwnerEmail } from "../lib/email-templates"

const ORDER_FIELDS = [
  "id",
  "display_id",
  "email",
  "currency_code",
  "total",
  "items.title",
  "items.quantity",
  "items.unit_price",
]

// order.placed → confirmación al cliente + aviso al dueño.
export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const {
    data: [order],
  } = await query.graph({ entity: "order", fields: ORDER_FIELDS, filters: { id: event.data.id } })
  if (!order) return

  // Confirmación al cliente
  if (order.email) {
    const tpl = orderConfirmationEmail(order)
    await notif.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-confirmation",
      content: tpl,
    })
  }

  // Aviso al dueño (si está configurado)
  const ownerEmail = process.env.OWNER_EMAIL
  if (ownerEmail) {
    const tpl = newOrderOwnerEmail(order)
    await notif.createNotifications({
      to: ownerEmail,
      channel: "email",
      template: "new-order-owner",
      content: tpl,
    })
  }

  logger.info(`[order.placed] emails de pedido #${order.display_id} encolados`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
