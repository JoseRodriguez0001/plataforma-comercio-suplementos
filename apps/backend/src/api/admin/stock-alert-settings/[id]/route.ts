import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { INVENTORY_EXT_MODULE } from "../../../../modules/inventory-ext"
import InventoryExtModuleService from "../../../../modules/inventory-ext/service"

// DELETE /admin/stock-alert-settings/:id → elimina un override por variante
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const invExt: InventoryExtModuleService = req.scope.resolve(INVENTORY_EXT_MODULE)
  const { id } = req.params

  const [setting] = await invExt.listStockAlertSettings({ id })
  if (!setting) {
    res.status(404).json({ message: "Configuración no encontrada" })
    return
  }
  if ((setting as any).scope === "global") {
    res.status(400).json({ message: "No se puede eliminar el umbral global" })
    return
  }

  await invExt.deleteStockAlertSettings(id)
  res.json({ id, deleted: true })
}
