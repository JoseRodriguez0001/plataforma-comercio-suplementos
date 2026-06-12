import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { COMPLIANCE_MODULE } from "../../../modules/compliance"
import ComplianceModuleService from "../../../modules/compliance/service"

// GET /store/consents → consentimientos del cliente autenticado
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "No autenticado" })
    return
  }
  const compliance: ComplianceModuleService = req.scope.resolve(COMPLIANCE_MODULE)
  const consents = await compliance.listCustomerConsents({ customer_id: customerId })
  res.json({ consents })
}

// POST /store/consents → registrar/actualizar un consentimiento
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "No autenticado" })
    return
  }
  const compliance: ComplianceModuleService = req.scope.resolve(COMPLIANCE_MODULE)
  const { consent_type, granted, policy_version } = (req.body as any) ?? {}

  if (!["privacy_policy", "marketing", "cookies"].includes(consent_type)) {
    res.status(400).json({ message: "consent_type inválido" })
    return
  }

  const consent = await compliance.setConsent({
    customer_id: customerId,
    consent_type,
    granted: !!granted,
    policy_version: policy_version ?? null,
  })
  res.json({ consent })
}
