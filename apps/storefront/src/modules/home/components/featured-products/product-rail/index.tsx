import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="section-pill-green mb-4">Nuestros productos</span>
        <Text className="heading-display text-3xl font-bold text-ink small:text-4xl">
          {collection.title}
        </Text>
        <p className="mt-3 max-w-xl text-grey-50">
          Una selección de suplementos premium, probados para garantizar pureza
          y potencia.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-6 small:grid-cols-3 small:gap-8">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <InteractiveLink href={`/collections/${collection.handle}`}>
          Ver todo
        </InteractiveLink>
      </div>
    </div>
  )
}
