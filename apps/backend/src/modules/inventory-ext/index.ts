import { Module } from "@medusajs/framework/utils"
import InventoryExtModuleService from "./service"

export const INVENTORY_EXT_MODULE = "inventory_ext"

export default Module(INVENTORY_EXT_MODULE, {
  service: InventoryExtModuleService,
})
