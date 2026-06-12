import { model } from "@medusajs/framework/utils"

/**
 * Consentimiento de datos personales (Ley 81 Panamá). Un registro por
 * cliente y tipo de consentimiento, con la versión del documento aceptado.
 */
export const CustomerConsent = model.define("customer_consent", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  consent_type: model.enum(["privacy_policy", "marketing", "cookies"]),
  granted: model.boolean().default(false),
  policy_version: model.text().nullable(),
  granted_at: model.dateTime().nullable(),
})
