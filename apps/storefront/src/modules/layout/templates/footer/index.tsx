import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-footer text-grey-30">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-20">
          <div className="max-w-xs">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl font-bold uppercase tracking-tight text-brand-500"
            >
              NATURZEN
            </LocalizedClientLink>
            <p className="mt-4 text-sm leading-6 text-grey-40">
              Bienestar para una vida óptima. Suplementos naturales respaldados
              por la ciencia.
            </p>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-4">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="font-display text-sm font-semibold text-white">
                  Categorías
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "text-grey-40 hover:text-white",
                            children && "txt-small-plus text-grey-30"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="text-grey-40 hover:text-white"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="font-display text-sm font-semibold text-white">
                  Colecciones
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-grey-40 hover:text-white"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="font-display text-sm font-semibold text-white">Tienda</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink href="/store" className="text-grey-40 hover:text-white">
                    Productos
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/search" className="text-grey-40 hover:text-white">
                    Buscar
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/account" className="text-grey-40 hover:text-white">
                    Mi cuenta
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-display text-sm font-semibold text-white">Ayuda</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink href="/customer-service" className="text-grey-40 hover:text-white">
                    Atención al cliente
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/contact" className="text-grey-40 hover:text-white">
                    Contacto
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/content/privacy-policy" className="text-grey-40 hover:text-white">
                    Política de privacidad
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/content/terms-of-use" className="text-grey-40 hover:text-white">
                    Términos de uso
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 w-full border-t border-grey-80 py-8 small:flex-row small:items-center small:justify-between">
          <Text className="txt-compact-small text-grey-50">
            © {new Date().getFullYear()} NATURZEN. Todos los derechos reservados.
          </Text>
          <div className="flex items-center gap-x-4 text-grey-40">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" aria-label="WhatsApp" className="hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M.06 24l1.68-6.13A11.86 11.86 0 01.16 11.9C.16 5.33 5.5 0 12.06 0a11.82 11.82 0 018.41 3.49 11.82 11.82 0 013.48 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 01-5.69-1.45L.06 24zm6.6-3.8c1.68.99 3.28 1.59 5.4 1.59 5.45 0 9.89-4.43 9.89-9.88a9.82 9.82 0 00-2.9-7A9.82 9.82 0 0012.06 2c-5.46 0-9.9 4.43-9.9 9.88a9.8 9.8 0 001.51 5.26l-.99 3.62 3.98-1.04zm11.39-5.55c-.07-.12-.27-.2-.56-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
