import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { INVENTORY_EXT_MODULE } from "../modules/inventory-ext"

export type AdjustStockInput = {
  inventory_item_id: string
  location_id: string
  delta: number
  reason: "restock" | "shrinkage" | "correction" | "other"
  note?: string | null
  admin_user_id?: string | null
  variant_id?: string | null
}

// Paso 1: aplicar el delta al stock real (Inventory nativo). Compensa restaurando.
const applyDeltaStep = createStep(
  "apply-stock-delta",
  async (input: AdjustStockInput, { container }) => {
    const inventory = container.resolve(Modules.INVENTORY)

    const [level] = await inventory.listInventoryLevels({
      inventory_item_id: input.inventory_item_id,
      location_id: input.location_id,
    })
    if (!level) {
      throw new Error("No existe nivel de inventario para ese item/ubicación")
    }

    const previous = level.stocked_quantity
    const next = previous + input.delta
    if (next < 0) {
      throw new Error("El ajuste dejaría el stock en negativo")
    }

    await inventory.updateInventoryLevels([
      {
        inventory_item_id: input.inventory_item_id,
        location_id: input.location_id,
        stocked_quantity: next,
      },
    ])

    return new StepResponse(
      { previous, next },
      {
        inventory_item_id: input.inventory_item_id,
        location_id: input.location_id,
        previous,
      }
    )
  },
  async (compensate, { container }) => {
    if (!compensate) return
    const inventory = container.resolve(Modules.INVENTORY)
    await inventory.updateInventoryLevels([
      {
        inventory_item_id: compensate.inventory_item_id,
        location_id: compensate.location_id,
        stocked_quantity: compensate.previous,
      },
    ])
  }
)

// Paso 2: registrar el ajuste (append-only). Compensa borrando el registro.
const recordAdjustmentStep = createStep(
  "record-adjustment",
  async (input: AdjustStockInput, { container }) => {
    const invExt: any = container.resolve(INVENTORY_EXT_MODULE)
    const rec = await invExt.createInventoryAdjustments({
      inventory_item_id: input.inventory_item_id,
      variant_id: input.variant_id ?? null,
      delta: input.delta,
      reason: input.reason,
      note: input.note ?? null,
      admin_user_id: input.admin_user_id ?? null,
    })
    return new StepResponse(rec, rec.id)
  },
  async (id, { container }) => {
    if (!id) return
    const invExt: any = container.resolve(INVENTORY_EXT_MODULE)
    await invExt.deleteInventoryAdjustments(id)
  }
)

export const adjustStockWorkflow = createWorkflow(
  "adjust-stock",
  (input: AdjustStockInput) => {
    const applied = applyDeltaStep(input)
    const record = recordAdjustmentStep(input)
    return new WorkflowResponse({ applied, record })
  }
)
