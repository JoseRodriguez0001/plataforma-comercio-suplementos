import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/products/:id/supplement → atributos de suplemento + marca (público)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const {
    data: [product],
  } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "supplement_info.ingredientes",
      "supplement_info.modo_de_uso",
      "supplement_info.advertencias",
      "supplement_info.tamano_porcion",
      "supplement_info.porciones_por_envase",
      "supplement_info.registro_sanitario",
      "supplement_info.es_vegano",
      "supplement_info.sin_azucar",
      "supplement_info.sin_gluten",
      "supplement_info.apto_vegetariano",
      "brand.name",
      "brand.slug",
      "brand.logo_url",
    ],
    filters: { id },
  })

  if (!product) {
    res.status(404).json({ message: "Producto no encontrado" })
    return
  }

  res.json({
    supplement_info: product.supplement_info ?? null,
    brand: product.brand ?? null,
  })
}
