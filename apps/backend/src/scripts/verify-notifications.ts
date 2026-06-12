import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/** Envía una notificación de email de prueba (dev: la registra el proveedor local). */
export default async function verifyNotifications({ container }: ExecArgs) {
  const notif: any = container.resolve(Modules.NOTIFICATION)
  const r = await notif.createNotifications({
    to: "cliente@test.pa",
    channel: "email",
    template: "test",
    content: { subject: "Prueba de notificación", html: "<p>Hola desde la tienda</p>" },
  })
  console.log("✔ notificación creada:", JSON.stringify(Array.isArray(r) ? r[0] : r).slice(0, 200))
}
