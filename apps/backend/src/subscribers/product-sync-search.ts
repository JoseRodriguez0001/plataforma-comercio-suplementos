import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { upsertProducts, ensureIndex, searchEnabled } from "../lib/search"

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

// product.created / product.updated → sincroniza el documento en Meilisearch.
export default async function productSyncSearchHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  if (!searchEnabled()) return
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [product] } = await query.graph({
    entity: "product",
    fields: PRODUCT_FIELDS,
    filters: { id: event.data.id },
  })
  if (!product) return
  await ensureIndex()
  await upsertProducts([product])
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
