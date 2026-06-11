import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SUPPLEMENT_MODULE } from "../../../../../modules/supplement"
import SupplementModuleService from "../../../../../modules/supplement/service"

// GET /admin/variants/:id/expiry → vencimiento de una variante
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const {
    data: [variant],
  } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "variant_expiry.*"],
    filters: { id },
  })

  res.json({ variant_expiry: (variant as any)?.variant_expiry ?? null })
}

// POST /admin/variants/:id/expiry → crea/actualiza vencimiento de la variante
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const supplement: SupplementModuleService = req.scope.resolve(SUPPLEMENT_MODULE)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { expiration_date, lot_code } = (req.body as any) ?? {}

  const {
    data: [existing],
  } = await query.graph({
    entity: "product_variant",
    fields: ["id", "variant_expiry.id"],
    filters: { id },
  })

  const data = {
    expiration_date: expiration_date || null,
    lot_code: lot_code || null,
  }

  let ve
  if ((existing as any)?.variant_expiry?.id) {
    ve = await (supplement as any).updateVariantExpiries({
      id: (existing as any).variant_expiry.id,
      ...data,
    })
  } else {
    ve = await (supplement as any).createVariantExpiries(data)
    await link.create({
      [Modules.PRODUCT]: { product_variant_id: id },
      [SUPPLEMENT_MODULE]: { variant_expiry_id: ve.id },
    })
  }

  res.json({ variant_expiry: ve })
}
