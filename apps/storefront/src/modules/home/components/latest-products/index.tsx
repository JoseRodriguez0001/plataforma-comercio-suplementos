import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

/**
 * Sección de productos del home, independiente de colecciones: muestra los
 * últimos productos del catálogo. Así siempre hay productos visibles sin
 * depender de asignarlos a una colección.
 */
export default async function LatestProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="section-pill-green mb-4">Nuestros productos</span>
        <h2 className="heading-display text-3xl font-bold text-ink small:text-4xl">
          Suplementos destacados
        </h2>
        <p className="mt-3 max-w-xl text-grey-50">
          Una selección de suplementos premium, probados para garantizar pureza
          y potencia.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-6 small:grid-cols-3 small:gap-8 medium:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <InteractiveLink href="/store">Ver todos los productos</InteractiveLink>
      </div>
    </div>
  )
}
