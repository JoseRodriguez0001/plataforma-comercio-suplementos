import { Module } from "@medusajs/framework/utils"
import ComplianceModuleService from "./service"

export const COMPLIANCE_MODULE = "compliance"

export default Module(COMPLIANCE_MODULE, {
  service: ComplianceModuleService,
})
