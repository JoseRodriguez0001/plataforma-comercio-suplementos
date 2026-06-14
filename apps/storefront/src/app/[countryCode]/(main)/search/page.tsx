import { Metadata } from "next"
import { searchStore } from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Búsqueda",
  description: "Resultados de búsqueda",
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const { hits, total } = await searchStore(q)

  return (
    <div className="content-container py-6">
      <h1 className="text-2xl-semi mb-1">Búsqueda</h1>
      <p className="text-ui-fg-subtle mb-6">
        {q ? `${total} resultado(s) para “${q}”` : "Escribe algo para buscar."}
      </p>

      {hits.length === 0 && q ? (
        <p className="text-ui-fg-subtle">
          No encontramos productos. Prueba con otra palabra.
        </p>
      ) : (
        <ul className="grid grid-cols-2 small:grid-cols-4 gap-6">
          {hits.map((h) => (
            <li key={h.id}>
              <LocalizedClientLink href={`/products/${h.handle}`} className="group block">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-ui-bg-subtle">
                  {h.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={h.thumbnail}
                      alt={h.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ui-fg-muted text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  {h.brand && (
                    <span className="text-xs text-ui-fg-muted">{h.brand}</span>
                  )}
                  <p className="text-ui-fg-base group-hover:text-ui-fg-interactive">
                    {h.title}
                  </p>
                </div>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
