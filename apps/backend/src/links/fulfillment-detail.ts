import { defineLink } from "@medusajs/framework/utils"
import FulfillmentModule from "@medusajs/medusa/fulfillment"
import FulfillmentExtModule from "../modules/fulfillment-ext"

// Fulfillment 1—1 FulfillmentDetail: datos de cumplimiento manual del envío/retiro.
export default defineLink(
  FulfillmentModule.linkable.fulfillment,
  FulfillmentExtModule.linkable.fulfillmentDetail
)
