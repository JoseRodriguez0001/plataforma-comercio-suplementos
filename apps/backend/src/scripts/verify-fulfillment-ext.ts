import { ExecArgs } from "@medusajs/framework/types"
import { FULFILLMENT_EXT_MODULE } from "../modules/fulfillment-ext"

/** Verificación rápida del módulo fulfillment_ext. */
export default async function verifyFulfillmentExt({ container }: ExecArgs) {
  const svc: any = container.resolve(FULFILLMENT_EXT_MODULE)

  const carriers = await svc.listShippingCarriers({ name: "Uno Express" })
  const carrier = carriers.length
    ? carriers[0]
    : await svc.createShippingCarriers({ name: "Uno Express", sort_order: 1 })
  console.log(`✔ Transportista: ${carrier.name}`)

  const detail = await svc.createFulfillmentDetails({
    method: "shipping",
    carrier_id: carrier.id,
    tracking_number: "TEST-123",
    shipped_at: new Date().toISOString(),
  })
  console.log(`✔ FulfillmentDetail creado: method=${detail.method}, guía=${detail.tracking_number}`)

  const carrierCount = (await svc.listShippingCarriers()).length
  const detailCount = (await svc.listFulfillmentDetails()).length
  console.log(`✔ carriers=${carrierCount}, fulfillment_details=${detailCount}`)
}
