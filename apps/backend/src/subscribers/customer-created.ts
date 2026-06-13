import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { welcomeEmail } from "../lib/email-templates"

// customer.created → email de bienvenida.
export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)

  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["id", "email", "first_name", "has_account"],
    filters: { id: event.data.id },
  })

  // Solo a clientes con cuenta real (no a los "invitados" creados en checkout).
  if (!customer?.email || customer.has_account === false) return

  await notif.createNotifications({
    to: customer.email,
    channel: "email",
    template: "welcome",
    content: welcomeEmail(customer),
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
