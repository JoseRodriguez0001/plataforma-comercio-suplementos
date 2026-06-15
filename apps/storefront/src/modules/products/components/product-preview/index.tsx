import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-large border border-grey-20 bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(46,158,79,0.35)]"
        data-testid="product-wrapper"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          className="!rounded-none !rounded-t-large !shadow-none border-b border-grey-20 group-hover:!shadow-none"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Text
            className="font-display text-base font-semibold text-ink"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          {product.description && (
            <p className="line-clamp-2 text-xs leading-5 text-grey-50">
              {product.description}
            </p>
          )}
          <div className="mt-auto flex items-center gap-x-2 pt-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
          <span className="btn-brand mt-2 w-full">Ver producto</span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
