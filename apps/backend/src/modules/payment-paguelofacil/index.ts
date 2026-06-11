import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PagueloFacilPaymentProviderService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [PagueloFacilPaymentProviderService],
})
