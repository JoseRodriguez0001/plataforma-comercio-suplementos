import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  requestOrderTransferWorkflow,
  acceptOrderTransferWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Verifica el flujo de transferencia de orden (asociación de orden de invitado
 * a una cuenta registrada). request → token → accept → la orden queda en la
 * cuenta. El request emite `order.transfer_requested` → dispara el email.
 */
export default async function verifyOrderTransfer({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const customerModule: any = container.resolve(Modules.CUSTOMER)

  const email = "cliente@test.pa"

  // Cuenta registrada destino (crear si no existe).
  let [cust] = await customerModule.listCustomers({ email, has_account: true })
  if (!cust) {
    cust = await customerModule.createCustomers({
      email,
      has_account: true,
      first_name: "Cliente",
      last_name: "Registrado",
    })
    console.log("• cuenta registrada creada")
  }

  // Buscar una orden de invitado (customer invitado) con ese email.
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email", "status", "customer_id", "customer.has_account"],
    filters: { email },
  })
  const guest = (orders as any[]).find(
    (o) =>
      o.status !== "canceled" &&
      o.customer_id !== cust.id &&
      o.customer?.has_account !== true
  )
  if (!guest) {
    console.log("No hay orden de invitado con ese email para probar.")
    return
  }
  console.log(`orden #${guest.display_id} (customer actual ${guest.customer_id})`)

  const getToken = async (): Promise<string | undefined> => {
    const { data: changes } = await query.graph({
      entity: "order_change",
      fields: ["id", "change_type", "actions.details"],
      filters: { order_id: guest.id },
    })
    let t: string | undefined
    for (const ch of changes as any[]) {
      for (const a of ch.actions ?? []) {
        if (a?.details?.token) t = a.details.token
      }
    }
    return t
  }

  // 1) Solicitar transferencia (emite el evento → email). Si ya hay una
  //    solicitud activa (corrida previa), se reutiliza su token.
  let token = await getToken()
  if (!token) {
    await requestOrderTransferWorkflow(container).run({
      input: { order_id: guest.id, customer_id: cust.id },
    })
    token = await getToken()
  }
  console.log(`token: ${token ? "obtenido" : "NO"}`)
  if (!token) return

  // 3) Aceptar la transferencia
  await acceptOrderTransferWorkflow(container).run({ input: { order_id: guest.id, token } })

  // 4) Verificar
  const { data: [after] } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: { id: guest.id },
  })
  const ok = (after as any).customer_id === cust.id
  console.log(`customer después: ${(after as any).customer_id} → ${ok ? "OK ✅" : "NO"}`)
}
