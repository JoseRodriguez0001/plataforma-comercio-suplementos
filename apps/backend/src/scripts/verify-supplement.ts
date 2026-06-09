import { ExecArgs } from "@medusajs/framework/types"
import { SUPPLEMENT_MODULE } from "../modules/supplement"

/**
 * Verificación rápida del módulo supplement: crea (si no existe) y lista marcas.
 * Uso: npx medusa exec src/scripts/verify-supplement.ts
 */
export default async function verifySupplement({ container }: ExecArgs) {
  const supplement: any = container.resolve(SUPPLEMENT_MODULE)

  const slug = "optimum-nutrition"
  const existing = await supplement.listBrands({ slug })

  if (!existing.length) {
    await supplement.createBrands({
      name: "Optimum Nutrition",
      slug,
      description: "Marca de prueba",
    })
    console.log("✔ Marca creada")
  } else {
    console.log("• Marca ya existía")
  }

  const brands = await supplement.listBrands()
  console.log(`✔ Total marcas en BD: ${brands.length}`)
  console.log("  →", brands.map((b: any) => `${b.name} (${b.slug})`).join(", "))
}
