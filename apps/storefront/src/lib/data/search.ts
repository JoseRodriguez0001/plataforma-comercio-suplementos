"use server"

import { sdk } from "@lib/config"

export type SearchHit = {
  id: string
  title: string
  handle: string
  thumbnail?: string | null
  brand?: string | null
}

export type SearchResponse = {
  hits: SearchHit[]
  total: number
  facets: Record<string, Record<string, number>>
}

export const searchStore = async (
  q: string,
  opts?: { brand?: string; category?: string }
): Promise<SearchResponse> => {
  const query: Record<string, string> = { q: q ?? "" }
  if (opts?.brand) query.brand = opts.brand
  if (opts?.category) query.category = opts.category

  try {
    return await sdk.client.fetch<SearchResponse>(`/store/search`, {
      method: "GET",
      query,
      cache: "no-store",
    })
  } catch {
    return { hits: [], total: 0, facets: {} }
  }
}
