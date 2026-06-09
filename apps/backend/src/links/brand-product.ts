import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import SupplementModule from "../modules/supplement"

// Brand 1—N Product: una marca tiene muchos productos.
export default defineLink(
  SupplementModule.linkable.brand,
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  }
)
