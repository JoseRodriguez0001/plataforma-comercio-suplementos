import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { passwordResetEmail } from "../lib/email-templates"

// auth.password_reset → email con enlace seguro para restablecer contraseña.
export default async function passwordResetHandler({
  event,
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const notif: any = container.resolve(Modules.NOTIFICATION)
  const { entity_id: email, token, actor_type } = event.data

  if (!email || !token) return
  // Solo clientes (el reseteo de admin se maneja aparte).
  if (actor_type && actor_type !== "customer") return

  const base = process.env.STOREFRONT_URL || "http://localhost:8000"
  const url = `${base}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

  await notif.createNotifications({
    to: email,
    channel: "email",
    template: "password-reset",
    content: passwordResetEmail({ url }),
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
