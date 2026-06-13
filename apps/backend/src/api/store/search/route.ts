import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { searchProducts } from "../../../lib/search"

// GET /store/search?q=...&brand=...&category=...&vegano=true&limit=&offset=
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const q = (req.query.q as string) ?? ""
  const limit = req.query.limit ? Number(req.query.limit) : 20
  const offset = req.query.offset ? Number(req.query.offset) : 0

  const filter: string[] = ["status = published"]
  if (req.query.brand) filter.push(`brand_slug = "${req.query.brand}"`)
  if (req.query.category) filter.push(`categories = "${req.query.category}"`)
  if (req.query.vegano === "true") filter.push(`is_vegano = true`)
  if (req.query.sin_azucar === "true") filter.push(`sin_azucar = true`)
  if (req.query.sin_gluten === "true") filter.push(`sin_gluten = true`)

  const result = await searchProducts(q, { limit, offset, filter })

  res.json({
    hits: result.hits ?? [],
    total: result.estimatedTotalHits ?? 0,
    facets: result.facetDistribution ?? {},
  })
}
