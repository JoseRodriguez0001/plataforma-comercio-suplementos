import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { INVENTORY_EXT_MODULE } from "../modules/inventory-ext"
import { lowStockOwnerEmail, expiryOwnerEmail } from "./email-templates"

async function getThresholds(container: MedusaContainer) {
  const inv: any = container.resolve(INVENTORY_EXT_MODULE)
  const settings = await inv.listStockAlertSettings({}, { take: 1000 })
  const global =
    settings.find((s: any) => s.scope === "global") ?? {
      low_stock_threshold: 5,
      expiry_alert_days: 30,
    }
  const overrides = new Map<string, any>()
  for (const s of settings) {
    if (s.scope === "variant" && s.variant_id) overrides.set(s.variant_id, s)
  }
  return { global, overrides }
}

/** Detecta variantes con stock disponible ≤ umbral y avisa al dueño. */
export async function runLowStockAlert(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const { global, overrides } = await getThresholds(container)

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "product.title", "inventory_items.inventory_item_id"],
  })
  const { data: levels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "available_quantity"],
  })

  const availByItem = new Map<string, number>()
  for (const l of levels as any[]) {
    availByItem.set(
      l.inventory_item_id,
      (availByItem.get(l.inventory_item_id) ?? 0) + (l.available_quantity ?? 0)
    )
  }

  const low: { name: string; available: number; threshold: number }[] = []
  for (const v of variants as any[]) {
    const iids = (v.inventory_items ?? [])
      .map((ii: any) => ii.inventory_item_id)
      .filter(Boolean)
    if (!iids.length) continue
    const available = iids.reduce((s: number, iid: string) => s + (availByItem.get(iid) ?? 0), 0)
    const threshold = overrides.get(v.id)?.low_stock_threshold ?? global.low_stock_threshold
    if (available <= threshold) {
      low.push({ name: `${v.product?.title ?? ""} ${v.title ?? ""}`.trim(), available, threshold })
    }
  }

  logger.info(`[low-stock-alert] ${low.length} variante(s) con stock bajo`)
  const owner = process.env.OWNER_EMAIL
  if (low.length && owner) {
    await notif.createNotifications({
      to: owner,
      channel: "email",
      template: "low-stock",
      content: lowStockOwnerEmail(low),
    })
  }
  return low
}

/** Detecta variantes próximas a vencer (≤ días de aviso) y avisa al dueño. */
export async function runExpiryAlert(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notif: any = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const { global, overrides } = await getThresholds(container)

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "product.title", "variant_expiry.expiration_date"],
  })

  const now = Date.now()
  const soon: { name: string; date: string; days: number }[] = []
  for (const v of variants as any[]) {
    const exp = v.variant_expiry?.expiration_date
    if (!exp) continue
    const days = Math.ceil((new Date(exp).getTime() - now) / 86400000)
    const threshold = overrides.get(v.id)?.expiry_alert_days ?? global.expiry_alert_days
    if (days <= threshold) {
      soon.push({
        name: `${v.product?.title ?? ""} ${v.title ?? ""}`.trim(),
        date: new Date(exp).toISOString().slice(0, 10),
        days,
      })
    }
  }

  logger.info(`[expiry-alert] ${soon.length} variante(s) por vencer`)
  const owner = process.env.OWNER_EMAIL
  if (soon.length && owner) {
    await notif.createNotifications({
      to: owner,
      channel: "email",
      template: "expiry",
      content: expiryOwnerEmail(soon),
    })
  }
  return soon
}
