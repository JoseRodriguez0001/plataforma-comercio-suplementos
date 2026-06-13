// Integración con Meilisearch vía su API REST (sin dependencia npm extra).
// Si MEILISEARCH_HOST no está definido, las funciones no hacen nada (no-op).

const INDEX = "products"

function cfg() {
  const host = process.env.MEILISEARCH_HOST
  const key = process.env.MEILISEARCH_API_KEY
  return { host, key, enabled: !!host }
}

async function meili(path: string, init: RequestInit = {}) {
  const { host, key } = cfg()
  const res = await fetch(`${host}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok && res.status !== 404) {
    const body = await res.text()
    throw new Error(`Meili ${path} → ${res.status}: ${body}`)
  }
  return res.status === 404 ? null : res.json()
}

export function searchEnabled() {
  return cfg().enabled
}

/** Crea el índice (si no existe) y configura atributos buscables/filtrables. */
export async function ensureIndex() {
  if (!searchEnabled()) return
  await meili(`/indexes`, {
    method: "POST",
    body: JSON.stringify({ uid: INDEX, primaryKey: "id" }),
  }).catch(() => {})
  await meili(`/indexes/${INDEX}/settings`, {
    method: "PATCH",
    body: JSON.stringify({
      searchableAttributes: ["title", "description", "brand", "tags"],
      filterableAttributes: [
        "brand_slug",
        "categories",
        "is_vegano",
        "sin_azucar",
        "sin_gluten",
        "status",
      ],
      sortableAttributes: ["title"],
    }),
  })
}

/** Construye el documento de búsqueda a partir de un producto + sus relaciones. */
export function toDocument(p: any) {
  const s = p.supplement_info ?? {}
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    handle: p.handle,
    thumbnail: p.thumbnail ?? null,
    status: p.status,
    brand: p.brand?.name ?? null,
    brand_slug: p.brand?.slug ?? null,
    categories: (p.categories ?? []).map((c: any) => c.name),
    tags: (p.tags ?? []).map((t: any) => t.value),
    is_vegano: !!s.es_vegano,
    sin_azucar: !!s.sin_azucar,
    sin_gluten: !!s.sin_gluten,
  }
}

export async function upsertProducts(products: any[]) {
  if (!searchEnabled() || !products.length) return
  const docs = products.map(toDocument)
  await meili(`/indexes/${INDEX}/documents`, {
    method: "POST",
    body: JSON.stringify(docs),
  })
}

export async function removeProduct(id: string) {
  if (!searchEnabled()) return
  await meili(`/indexes/${INDEX}/documents/${id}`, { method: "DELETE" })
}

export async function searchProducts(
  q: string,
  opts: { limit?: number; offset?: number; filter?: string[]; facets?: string[] } = {}
) {
  if (!searchEnabled()) return { hits: [], estimatedTotalHits: 0, facetDistribution: {} }
  return meili(`/indexes/${INDEX}/search`, {
    method: "POST",
    body: JSON.stringify({
      q: q ?? "",
      limit: opts.limit ?? 20,
      offset: opts.offset ?? 0,
      filter: opts.filter,
      facets: opts.facets ?? ["brand_slug", "categories"],
    }),
  })
}
