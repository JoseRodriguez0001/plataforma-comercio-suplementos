import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Borra los productos demo del starter y los productos de suplemento que
 * quedaron en EUR, para re-sembrar en USD. Idempotente.
 * Uso: npx medusa exec src/scripts/cleanup-demo.ts
 */
export default async function cleanupDemo({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const handles = [
    // demo del starter
    "t-shirt",
    "sweatshirt",
    "sweatpants",
    "shorts",
    // suplementos sembrados en EUR (se re-siembran en USD)
    "whey-gold-standard-2lb",
    "creatina-monohidratada-300g",
    "multivitaminico-daily-60caps",
  ]

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: handles },
  })

  if (!products.length) {
    logger.info("No hay productos demo/EUR para borrar")
    return
  }

  await deleteProductsWorkflow(container).run({
    input: { ids: products.map((p: any) => p.id) },
  })
  logger.info(`Borrados ${products.length}: ${products.map((p: any) => p.handle).join(", ")}`)
}
