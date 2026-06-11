import { MedusaService } from "@medusajs/framework/utils"
import { FulfillmentDetail } from "./models/fulfillment-detail"
import { ShippingCarrier } from "./models/shipping-carrier"

class FulfillmentExtModuleService extends MedusaService({
  FulfillmentDetail,
  ShippingCarrier,
}) {}

export default FulfillmentExtModuleService
