import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { removeProduct, searchEnabled } from "../lib/search"

// product.deleted → elimina el documento de Meilisearch.
export default async function productDeletedSearchHandler({
  event,
}: SubscriberArgs<{ id: string }>) {
  if (!searchEnabled()) return
  await removeProduct(event.data.id)
}

export const config: SubscriberConfig = {
  event: "product.deleted",
}
