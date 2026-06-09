import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import SupplementModule from "../modules/supplement"

// Product 1—1 SupplementInfo: atributos de suplemento de un producto.
export default defineLink(
  ProductModule.linkable.product,
  SupplementModule.linkable.supplementInfo
)
