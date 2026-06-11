import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import YappyPaymentProviderService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [YappyPaymentProviderService],
})
