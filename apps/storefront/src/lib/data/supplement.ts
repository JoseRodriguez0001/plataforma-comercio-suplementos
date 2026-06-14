"use server"

import { sdk } from "@lib/config"

export type SupplementInfo = {
  ingredientes?: string | null
  modo_de_uso?: string | null
  advertencias?: string | null
  tamano_porcion?: string | null
  porciones_por_envase?: number | null
  registro_sanitario?: string | null
  es_vegano?: boolean
  sin_azucar?: boolean
  sin_gluten?: boolean
  apto_vegetariano?: boolean
}

export type SupplementData = {
  supplement_info: SupplementInfo | null
  brand: { name?: string; slug?: string; logo_url?: string | null } | null
}

export const getSupplement = async (productId: string): Promise<SupplementData> => {
  try {
    return await sdk.client.fetch<SupplementData>(
      `/store/products/${productId}/supplement`,
      { method: "GET", cache: "no-store" }
    )
  } catch {
    return { supplement_info: null, brand: null }
  }
}
