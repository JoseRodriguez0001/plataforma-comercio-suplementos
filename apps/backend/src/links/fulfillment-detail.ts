import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import FulfillmentExtModule from "../modules/fulfillment-ext"

// Order 1—1 FulfillmentDetail: datos de cumplimiento manual (envío/retiro) de la orden.
// (Se enlaza a Order, no a Fulfillment, por simplicidad del MVP: una entrega por orden.)
export default defineLink(
  OrderModule.linkable.order,
  FulfillmentExtModule.linkable.fulfillmentDetail
)
