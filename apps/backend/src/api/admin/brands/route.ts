import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SUPPLEMENT_MODULE } from "../../../modules/supplement"
import SupplementModuleService from "../../../modules/supplement/service"

// GET /admin/brands → lista de marcas
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const supplement: SupplementModuleService = req.scope.resolve(SUPPLEMENT_MODULE)
  const brands = await supplement.listBrands({}, { order: { name: "ASC" } })
  res.json({ brands })
}

// POST /admin/brands → crear marca
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const supplement: SupplementModuleService = req.scope.resolve(SUPPLEMENT_MODULE)
  const brand = await supplement.createBrands(req.body as any)
  res.status(201).json({ brand })
}
