import { ReactNode } from "react"

type ContentPageProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  updatedAt?: string
  children: ReactNode
}

/**
 * Plantilla de páginas de contenido (legal, atención al cliente, contacto).
 * Encabezado con píldora + título en Poppins y cuerpo con estilos de prosa
 * propios (no usamos el plugin typography para no añadir dependencias).
 */
const ContentPage = ({
  eyebrow = "NATURZEN",
  title,
  subtitle,
  updatedAt,
  children,
}: ContentPageProps) => {
  return (
    <div className="bg-brand-50/40">
      <div className="content-container py-16 small:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="section-pill-green mb-4">{eyebrow}</span>
            <h1 className="heading-display text-3xl font-bold text-ink small:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-grey-50">{subtitle}</p>
            )}
            {updatedAt && (
              <p className="mt-2 text-xs text-grey-40">
                Última actualización: {updatedAt}
              </p>
            )}
          </div>

          <div
            className="
              rounded-large border border-grey-20 bg-white p-8 small:p-10
              text-grey-60 leading-7
              [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3 first:[&_h2]:mt-0
              [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:mb-4
              [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
              [&_a]:text-brand-700 [&_a]:underline
              [&_strong]:text-ink
            "
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentPage
