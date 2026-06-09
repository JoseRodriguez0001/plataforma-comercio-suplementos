import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"
import { SupplementInfo } from "./models/supplement-info"
import { VariantExpiry } from "./models/variant-expiry"

/**
 * Servicio del módulo supplement. MedusaService autogenera el CRUD de cada
 * modelo (createBrands, listSupplementInfos, etc.). La lógica de negocio
 * compleja vive en workflows, no aquí.
 */
class SupplementModuleService extends MedusaService({
  Brand,
  SupplementInfo,
  VariantExpiry,
}) {}

export default SupplementModuleService
