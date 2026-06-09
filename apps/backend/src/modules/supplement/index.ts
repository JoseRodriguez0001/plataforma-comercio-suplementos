import { Module } from "@medusajs/framework/utils"
import SupplementModuleService from "./service"

export const SUPPLEMENT_MODULE = "supplement"

export default Module(SUPPLEMENT_MODULE, {
  service: SupplementModuleService,
})
