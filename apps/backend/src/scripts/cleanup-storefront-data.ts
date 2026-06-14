import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Limpia datos demo del starter que ensucian el storefront:
 * - Categorías demo (Shirts, Sweatshirts, Pants, Merch).
 * - Colecciones demo.
 * - Corrige el título del multivitamínico (acentos corruptos por edición previa).
 * Uso: npx medusa exec src/scripts/cleanup-storefront-data.ts
 */
export default async function cleanupStorefrontData({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule: any = container.resolve(Modules.PRODUCT)

  // 1. Categorías demo
  const demo = ["Shirts", "Sweatshirts", "Pants", "Merch"]
  const { data: cats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const catIds = (cats as any[]).filter((c) => demo.includes(c.name)).map((c) => c.id)
  if (catIds.length) {
    await productModule.deleteProductCategories(catIds)
    console.log(`✔ borradas ${catIds.length} categorías demo`)
  }

  // 2. Colecciones demo (el starter crea "Featured"/"Latest", no usamos colecciones)
  const { data: cols } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  if ((cols as any[]).length) {
    await productModule.deleteProductCollections((cols as any[]).map((c) => c.id))
    console.log(`✔ borradas ${cols.length} colecciones demo`)
  }

  // 3. Corregir título del multivitamínico (UTF-8 correcto)
  const { data: prods } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: { handle: "multivitaminico-daily-60caps" },
  })
  if ((prods as any[])[0]) {
    await productModule.updateProducts((prods as any[])[0].id, {
      title: "Multivitamínico Daily 60 cápsulas",
    })
    console.log("✔ título del multivitamínico corregido")
  }

  console.log("Limpieza completada.")
}
