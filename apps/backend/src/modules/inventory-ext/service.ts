import { MedusaService } from "@medusajs/framework/utils"
import { StockAlertSetting } from "./models/stock-alert-setting"
import { InventoryAdjustment } from "./models/inventory-adjustment"

/**
 * Servicio del módulo inventory_ext. CRUD autogenerado para configuración de
 * alertas y registro de ajustes manuales. La lógica (aplicar ajuste al stock
 * real, detectar umbrales) vive en workflows/jobs que coordinan con el
 * Inventory Module nativo y Notificaciones.
 */
class InventoryExtModuleService extends MedusaService({
  StockAlertSetting,
  InventoryAdjustment,
}) {}

export default InventoryExtModuleService
