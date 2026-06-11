import { Module } from "@medusajs/framework/utils"
import FulfillmentExtModuleService from "./service"

export const FULFILLMENT_EXT_MODULE = "fulfillment_ext"

export default Module(FULFILLMENT_EXT_MODULE, {
  service: FulfillmentExtModuleService,
})
