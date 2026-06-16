import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { deleteCustomersWorkflow } from "@medusajs/medusa/core-flows"
import { COMPLIANCE_MODULE } from "../../../modules/compliance"
import ComplianceModuleService from "../../../modules/compliance/service"

// DELETE /store/account → baja de cuenta en autoservicio (Ley 81), con
// salvaguarda: bloquea si hay órdenes activas (no entregadas / sin cancelar).
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "No autenticado" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "status", "fulfillment_status"],
    filters: { customer_id: customerId },
  })

  const active = (orders ?? []).filter(
    (o: any) => o.status !== "canceled" && o.fulfillment_status !== "delivered"
  )
  if (active.length) {
    res.status(409).json({
      message:
        "No puedes eliminar tu cuenta mientras tengas órdenes activas (en proceso o envío en camino). Inténtalo cuando se completen.",
      active_orders: active.length,
    })
    return
  }

  // Borrar consentimientos del cliente y luego el cliente.
  const compliance: ComplianceModuleService = req.scope.resolve(COMPLIANCE_MODULE)
  const consents = await compliance.listCustomerConsents({ customer_id: customerId })
  if (consents.length) {
    await compliance.deleteCustomerConsents(consents.map((c: any) => c.id))
  }

  await deleteCustomersWorkflow(req.scope).run({ input: { ids: [customerId] } })

  // Borrar también la identidad de autenticación para que no pueda volver a
  // iniciar sesión (baja real, Ley 81).
  const authIdentityId = (req as any).auth_context?.auth_identity_id
  if (authIdentityId) {
    const authModule: any = req.scope.resolve(Modules.AUTH)
    await authModule.deleteAuthIdentities([authIdentityId])
  }

  res.json({ deleted: true })
}
