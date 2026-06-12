import { MedusaService } from "@medusajs/framework/utils"
import { CustomerConsent } from "./models/customer-consent"

type SetConsentInput = {
  customer_id: string
  consent_type: "privacy_policy" | "marketing" | "cookies"
  granted: boolean
  policy_version?: string | null
}

class ComplianceModuleService extends MedusaService({ CustomerConsent }) {
  /** Registra/actualiza el consentimiento de un cliente para un tipo dado. */
  async setConsent(data: SetConsentInput) {
    const [existing] = await this.listCustomerConsents({
      customer_id: data.customer_id,
      consent_type: data.consent_type,
    })
    const payload = {
      granted: data.granted,
      policy_version: data.policy_version ?? null,
      granted_at: data.granted ? new Date() : null,
    }
    if (existing) {
      return await this.updateCustomerConsents({ id: (existing as any).id, ...payload })
    }
    return await this.createCustomerConsents({
      customer_id: data.customer_id,
      consent_type: data.consent_type,
      ...payload,
    })
  }
}

export default ComplianceModuleService
