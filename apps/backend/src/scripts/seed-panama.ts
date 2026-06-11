import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  createShippingOptionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Configura el store para Panamá: moneda USD por defecto, región Panamá,
 * impuesto ITBMS y zona de envío (envío nacional + retiro en local).
 * Idempotente. Uso: npx medusa exec src/scripts/seed-panama.ts
 *
 * PENDIENTES de negocio: tarifas reales por zona/provincia y confirmar si los
 * suplementos aplican ITBMS o están exentos (contador).
 */
export default async function seedPanama({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillment: any = container.resolve(Modules.FULFILLMENT)

  // 1. Store: USD por defecto (se mantiene EUR para no romper precios demo)
  const { data: [store] } = await query.graph({ entity: "store", fields: ["id"] })
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "eur", is_default: false },
        ],
      },
    },
  })
  logger.info("Store: USD establecido como moneda por defecto")

  // 2. Región Panamá (idempotente)
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "name"] })
  let panama = regions.find((r: any) => r.name === "Panamá")
  if (!panama) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Panamá",
            currency_code: "usd",
            countries: ["pa"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    panama = result[0]
    logger.info("Región Panamá (USD) creada")
  } else {
    logger.info("Región Panamá ya existía")
  }

  // 3. Impuesto ITBMS para Panamá (idempotente)
  const { data: taxRegions } = await query.graph({ entity: "tax_region", fields: ["id", "country_code"] })
  if (!taxRegions.find((t: any) => t.country_code === "pa")) {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "pa",
          provider_id: "tp_system",
          default_tax_rate: { name: "ITBMS", code: "itbms", rate: 7 },
        },
      ],
    })
    logger.info("Tax region PA creada (ITBMS 7%) — CONFIRMAR exención de suplementos con el contador")
  } else {
    logger.info("Tax region PA ya existía")
  }

  // 4. Envío Panamá: fulfillment set + zona + opciones (idempotente por nombre)
  const { data: [stockLocation] } = await query.graph({ entity: "stock_location", fields: ["id"] })
  const { data: [shippingProfile] } = await query.graph({ entity: "shipping_profile", fields: ["id"] })

  const existingSets = await fulfillment.listFulfillmentSets({ name: "Envío Panamá" })
  if (!existingSets.length) {
    const set = await fulfillment.createFulfillmentSets({
      name: "Envío Panamá",
      type: "shipping",
      service_zones: [
        { name: "Panamá", geo_zones: [{ country_code: "pa", type: "country" }] },
      ],
    })

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
    })

    const zoneId = set.service_zones[0].id
    const baseRules = [
      { attribute: "enabled_in_store", value: "true", operator: "eq" },
      { attribute: "is_return", value: "false", operator: "eq" },
    ]

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Envío nacional",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: zoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Envío",
            description: "Envío a domicilio (tarifa placeholder; ajustar por zona)",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 5 },
            { region_id: panama.id, amount: 5 },
          ],
          rules: baseRules,
        },
        {
          name: "Retiro en local",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: zoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Retiro",
            description: "Retiro en el local, sin costo",
            code: "pickup",
          },
          prices: [
            { currency_code: "usd", amount: 0 },
            { region_id: panama.id, amount: 0 },
          ],
          rules: baseRules,
        },
      ],
    })
    logger.info("Envío Panamá: zona + 'Envío nacional' ($5 placeholder) + 'Retiro en local' ($0)")
  } else {
    logger.info("Fulfillment set 'Envío Panamá' ya existía")
  }

  logger.info("Seed Panamá completado.")
}
