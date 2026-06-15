import { Text } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      <Text
        className="font-display text-lg font-bold text-brand-700"
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
      {price.price_type === "sale" && (
        <Text
          className="text-sm line-through text-grey-40"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
    </>
  )
}
