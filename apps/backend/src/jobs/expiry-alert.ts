import { MedusaContainer } from "@medusajs/framework/types"
import { runExpiryAlert } from "../lib/alerts"

export default async function expiryAlertJob(container: MedusaContainer) {
  await runExpiryAlert(container)
}

export const config = {
  name: "expiry-alert",
  schedule: "0 8 * * *", // diario 08:00
}
