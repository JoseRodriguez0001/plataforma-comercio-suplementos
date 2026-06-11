import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"
import { SUPPLEMENT_MODULE } from "../modules/supplement"

/**
 * Seed de productos de suplemento de ejemplo (con marca, atributos, precio,
 * categoría y stock). Idempotente: si el producto/categoría/marca ya existe,
 * no lo duplica. Uso: npx medusa exec src/scripts/seed-suplementos.ts
 */
export default async function seedSuplementos({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const supplement: any = container.resolve(SUPPLEMENT_MODULE)

  // --- Datos por defecto del store (creados por el seed inicial) ---
  const { data: [salesChannel] } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const { data: [shippingProfile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { data: [stockLocation] } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code", "name"],
  })
  // Preferir la región USD (Panamá); si no existe aún, usar la primera.
  const region =
    regions.find((r: any) => r.currency_code === "usd") ?? regions[0]

  if (!salesChannel || !shippingProfile || !region) {
    logger.error("Faltan datos base (sales channel / shipping profile / region). Corre primero las migraciones/seed inicial.")
    return
  }
  const currency = region.currency_code
  logger.info(`Seed usando canal "${salesChannel.name}", moneda ${currency}`)

  // --- Categorías (idempotente) ---
  async function ensureCategory(name: string): Promise<string> {
    const { data: found } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
      filters: { name },
    })
    if (found.length) return found[0].id
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name, is_active: true }] },
    })
    return result[0].id
  }

  const catProteinas = await ensureCategory("Proteínas")
  const catCreatina = await ensureCategory("Creatina")
  const catVitaminas = await ensureCategory("Vitaminas")

  // --- Marcas (idempotente) ---
  async function ensureBrand(name: string, slug: string, description?: string) {
    const found = await supplement.listBrands({ slug })
    if (found.length) return found[0]
    return await supplement.createBrands({ name, slug, description })
  }

  const optimum = await ensureBrand("Optimum Nutrition", "optimum-nutrition", "Marca líder de proteínas")
  const universal = await ensureBrand("Universal Nutrition", "universal-nutrition", "Suplementos y vitaminas")

  // --- Catálogo a sembrar ---
  const items = [
    {
      handle: "whey-gold-standard-2lb",
      title: "Whey Gold Standard 2 lb",
      description: "Proteína de suero de alta calidad, 24 g por porción.",
      category_id: catProteinas,
      brand: optimum,
      price: 54.99,
      stock: 40,
      supplement: {
        ingredientes: "Aislado de proteína de suero, cacao, lecitina de soya.",
        modo_de_uso: "Mezclar 1 scoop con 250 ml de agua o leche.",
        advertencias: "Consulte a su médico antes de usar si está embarazada o lactando.",
        tamano_porcion: "1 scoop (30 g)",
        porciones_por_envase: 29,
        es_vegano: false,
        sin_azucar: true,
        sin_gluten: true,
        apto_vegetariano: true,
      },
    },
    {
      handle: "creatina-monohidratada-300g",
      title: "Creatina Monohidratada 300 g",
      description: "Creatina micronizada para fuerza y rendimiento.",
      category_id: catCreatina,
      brand: optimum,
      price: 29.99,
      stock: 60,
      supplement: {
        ingredientes: "Creatina monohidratada micronizada 100%.",
        modo_de_uso: "Tomar 5 g (1 cucharadita) al día con agua.",
        advertencias: "Mantener una adecuada hidratación. Consulte a su médico.",
        tamano_porcion: "5 g",
        porciones_por_envase: 60,
        es_vegano: true,
        sin_azucar: true,
        sin_gluten: true,
        apto_vegetariano: true,
      },
    },
    {
      handle: "multivitaminico-daily-60caps",
      title: "Multivitamínico Daily 60 cápsulas",
      description: "Complejo multivitamínico de uso diario.",
      category_id: catVitaminas,
      brand: universal,
      price: 19.99,
      stock: 75,
      supplement: {
        ingredientes: "Vitaminas A, C, D, E, complejo B, zinc, magnesio.",
        modo_de_uso: "Tomar 1 cápsula al día con una comida.",
        advertencias: "No exceder la dosis recomendada. Consulte a su médico.",
        tamano_porcion: "1 cápsula",
        porciones_por_envase: 60,
        es_vegano: false,
        sin_azucar: true,
        sin_gluten: true,
        apto_vegetariano: false,
      },
    },
  ]

  let created = 0
  for (const item of items) {
    const { data: [exists] } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { handle: item.handle },
    })
    if (exists) {
      logger.info(`• "${item.title}" ya existía, omitido`)
      continue
    }

    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: item.title,
            handle: item.handle,
            description: item.description,
            status: "published",
            category_ids: [item.category_id],
            shipping_profile_id: shippingProfile.id,
            sales_channels: [{ id: salesChannel.id }],
            options: [{ title: "Presentación", values: ["Única"] }],
            variants: [
              {
                title: "Única",
                sku: item.handle.toUpperCase(),
                manage_inventory: true,
                options: { "Presentación": "Única" },
                prices: [{ amount: item.price, currency_code: currency }],
              },
            ],
          },
        ],
      },
    })
    const product = result[0]

    // Atributos de suplemento + link
    const info = await supplement.createSupplementInfos(item.supplement)
    await link.create({
      [Modules.PRODUCT]: { product_id: product.id },
      [SUPPLEMENT_MODULE]: { supplement_info_id: info.id },
    })
    // Marca + link
    await link.create({
      [SUPPLEMENT_MODULE]: { brand_id: item.brand.id },
      [Modules.PRODUCT]: { product_id: product.id },
    })

    // Stock inicial en la ubicación por defecto
    const variant = (product as any).variants?.[0]
    if (variant && stockLocation) {
      const { data: [v] } = await query.graph({
        entity: "product_variant",
        fields: ["id", "inventory_items.inventory_item_id"],
        filters: { id: variant.id },
      })
      const invItemId = (v as any)?.inventory_items?.[0]?.inventory_item_id
      if (invItemId) {
        await createInventoryLevelsWorkflow(container).run({
          input: {
            inventory_levels: [
              {
                inventory_item_id: invItemId,
                location_id: stockLocation.id,
                stocked_quantity: item.stock,
              },
            ],
          },
        })
      }
    }

    created++
    logger.info(`✔ Creado "${item.title}" (${item.brand.name}) — ${item.price} ${currency}, stock ${item.stock}`)
  }

  logger.info(`Seed completado. Productos nuevos: ${created}`)
}
