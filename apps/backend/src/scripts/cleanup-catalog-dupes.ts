import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Limpia el catálogo:
 * 1. Elimina productos demo del starter (shorts, sweatpants, sweatshirt, t-shirt).
 * 2. Elimina duplicados de productos: agrupa por handle y conserva el más
 *    antiguo de cada uno (borra las copias creadas después).
 * Usa deleteProductsWorkflow para borrar en cascada variantes/precios/inventario.
 *
 * Uso: npx medusa exec src/scripts/cleanup-catalog-dupes.ts
 */
const DEMO_HANDLES = ["shorts", "sweatpants", "sweatshirt", "t-shirt"]

export default async function cleanupCatalogDupes({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "created_at"],
  })

  const all = products as Array<{
    id: string
    title: string
    handle: string
    created_at: string
  }>

  const toDelete = new Set<string>()

  // 1. Productos demo
  for (const p of all) {
    if (DEMO_HANDLES.includes(p.handle)) {
      toDelete.add(p.id)
      console.log(`demo → borrar: ${p.title} (${p.handle})`)
    }
  }

  // 2. Duplicados por handle (conservar el más antiguo)
  const byHandle = new Map<string, typeof all>()
  for (const p of all) {
    if (DEMO_HANDLES.includes(p.handle)) continue
    const list = byHandle.get(p.handle) ?? []
    list.push(p)
    byHandle.set(p.handle, list)
  }
  for (const [handle, list] of byHandle) {
    if (list.length <= 1) continue
    const sorted = [...list].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    // conservar sorted[0]; borrar el resto
    for (const dup of sorted.slice(1)) {
      toDelete.add(dup.id)
      console.log(`duplicado → borrar: ${dup.title} (${handle}, ${dup.created_at})`)
    }
  }

  const ids = [...toDelete]
  if (ids.length === 0) {
    console.log("Nada que limpiar.")
    return
  }

  await deleteProductsWorkflow(container).run({ input: { ids } })
  console.log(`✔ eliminados ${ids.length} productos. Quedan ${all.length - ids.length}.`)
}
