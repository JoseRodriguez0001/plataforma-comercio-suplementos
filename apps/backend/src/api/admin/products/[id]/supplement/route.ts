import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SUPPLEMENT_MODULE } from "../../../../../modules/supplement"
import SupplementModuleService from "../../../../../modules/supplement/service"

// GET /admin/products/:id/supplement → atributos de suplemento + marca del producto
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const {
    data: [product],
  } = await query.graph({
    entity: "product",
    fields: ["id", "title", "supplement_info.*", "brand.*"],
    filters: { id },
  })

  res.json({
    supplement_info: product?.supplement_info ?? null,
    brand: product?.brand ?? null,
  })
}

// POST /admin/products/:id/supplement → crea/actualiza atributos y (opcional) asigna marca
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const supplement: SupplementModuleService = req.scope.resolve(SUPPLEMENT_MODULE)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { brand_id, ...infoData } = (req.body as any) ?? {}

  // ¿el producto ya tiene supplement_info enlazado?
  const {
    data: [existing],
  } = await query.graph({
    entity: "product",
    fields: ["id", "supplement_info.id", "brand.id"],
    filters: { id },
  })

  let info
  if (existing?.supplement_info?.id) {
    info = await supplement.updateSupplementInfos({
      id: existing.supplement_info.id,
      ...infoData,
    })
  } else {
    info = await supplement.createSupplementInfos(infoData)
    await link.create({
      [Modules.PRODUCT]: { product_id: id },
      [SUPPLEMENT_MODULE]: { supplement_info_id: info.id },
    })
  }

  // Asignar marca (si se envía brand_id)
  if (brand_id) {
    if (existing?.brand?.id && existing.brand.id !== brand_id) {
      await link.dismiss({
        [SUPPLEMENT_MODULE]: { brand_id: existing.brand.id },
        [Modules.PRODUCT]: { product_id: id },
      })
    }
    await link.create({
      [SUPPLEMENT_MODULE]: { brand_id },
      [Modules.PRODUCT]: { product_id: id },
    })
  }

  res.json({ supplement_info: info })
}
