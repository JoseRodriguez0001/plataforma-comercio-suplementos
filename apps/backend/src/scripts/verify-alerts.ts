import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { INVENTORY_EXT_MODULE } from "../modules/inventory-ext"
import { SUPPLEMENT_MODULE } from "../modules/supplement"
import { runLowStockAlert, runExpiryAlert } from "../lib/alerts"

/**
 * Verifica los jobs de alerta. Sube temporalmente los umbrales globales para
 * forzar la detección sobre los datos existentes, ejecuta las alertas y los
 * restaura. Uso: npx medusa exec src/scripts/verify-alerts.ts
 */
export default async function verifyAlerts({ container }: ExecArgs) {
  const inv: any = container.resolve(INVENTORY_EXT_MODULE)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Asegurar una fecha de vencimiento en la variante actual de creatina.
  const { data: [prod] } = await query.graph({
    entity: "product",
    fields: ["id", "variants.id", "variants.variant_expiry.id"],
    filters: { handle: "creatina-monohidratada-300g" },
  })
  const variant = (prod as any)?.variants?.[0]
  if (variant && !variant.variant_expiry?.id) {
    const supp: any = container.resolve(SUPPLEMENT_MODULE)
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const ve = await supp.createVariantExpiries({
      expiration_date: new Date(Date.now() + 60 * 86400000),
      lot_code: "TEST-VENC",
    })
    await link.create({
      [Modules.PRODUCT]: { product_variant_id: variant.id },
      [SUPPLEMENT_MODULE]: { variant_expiry_id: ve.id },
    })
    console.log("• vencimiento de prueba creado en creatina (60 días)")
  }

  const [g] = await inv.listStockAlertSettings({ scope: "global" })

  // Forzar detección
  await inv.updateStockAlertSettings({
    id: g.id,
    low_stock_threshold: 1000,
    expiry_alert_days: 1000000,
  })

  const low = await runLowStockAlert(container)
  const soon = await runExpiryAlert(container)
  console.log(`✔ stock bajo detectado: ${low.length}`, low.slice(0, 3))
  console.log(`✔ por vencer detectado: ${soon.length}`, soon.slice(0, 3))

  // Restaurar
  await inv.updateStockAlertSettings({
    id: g.id,
    low_stock_threshold: g.low_stock_threshold,
    expiry_alert_days: g.expiry_alert_days,
  })
  console.log("✔ umbrales restaurados")
}
