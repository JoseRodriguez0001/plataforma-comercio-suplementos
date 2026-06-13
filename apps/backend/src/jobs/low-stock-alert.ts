import { MedusaContainer } from "@medusajs/framework/types"
import { runLowStockAlert } from "../lib/alerts"

export default async function lowStockAlertJob(container: MedusaContainer) {
  await runLowStockAlert(container)
}

export const config = {
  name: "low-stock-alert",
  schedule: "0 8 * * *", // diario 08:00
}
