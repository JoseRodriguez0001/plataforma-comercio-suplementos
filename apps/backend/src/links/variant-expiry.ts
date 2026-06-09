import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import SupplementModule from "../modules/supplement"

// ProductVariant 1—1 VariantExpiry: fecha de vencimiento por variante.
export default defineLink(
  ProductModule.linkable.productVariant,
  SupplementModule.linkable.variantExpiry
)
