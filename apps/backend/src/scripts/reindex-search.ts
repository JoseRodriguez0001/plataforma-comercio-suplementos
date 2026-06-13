import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ensureIndex, upsertProducts, searchProducts, searchEnabled } from "../lib/search"

const PRODUCT_FIELDS = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "status",
  "brand.name",
  "brand.slug",
  "categories.name",
  "tags.value",
  "supplement_info.es_vegano",
  "supplement_info.sin_azucar",
  "supplement_info.sin_gluten",
]

/** Reindexa todos los productos en Meilisearch y hace una búsqueda de prueba. */
export default async function reindexSearch({ container }: ExecArgs) {
  if (!searchEnabled()) {
    console.log("Meilisearch no configurado (MEILISEARCH_HOST). Nada que hacer.")
    return
  }
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  await ensureIndex()
  const { data: products } = await query.graph({ entity: "product", fields: PRODUCT_FIELDS })
  await upsertProducts(products)
  console.log(`✔ reindexados ${products.length} productos`)

  // Esperar a que Meili procese e indexe.
  await new Promise((r) => setTimeout(r, 1500))
  const r = await searchProducts("creatina", { limit: 5 })
  console.log(`✔ búsqueda "creatina": ${r.estimatedTotalHits ?? r.hits?.length} resultado(s) →`, (r.hits ?? []).map((h: any) => h.title))
}
