import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TrustItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) => (
  <div className="flex items-center gap-2 text-sm font-medium text-ink">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
      {icon}
    </span>
    {label}
  </div>
)

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div className="content-container grid grid-cols-1 items-center gap-10 py-16 small:grid-cols-2 small:py-24">
        {/* Texto */}
        <div className="flex flex-col gap-6">
          <span className="section-pill-green w-fit">
            Productos 100% naturales
          </span>
          <h1 className="heading-display text-5xl font-bold leading-[1.1] text-ink small:text-6xl">
            Bienestar <span className="text-accent-500">puro</span>
            <br />
            para <span className="text-brand-700">vivir mejor</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-grey-50">
            Descubre proteínas, creatina, vitaminas y suplementos premium.
            Calidad respaldada por la ciencia, pensada para tu salud.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <TrustItem
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              }
              label="Calidad garantizada"
            />
            <TrustItem
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.7-4.35-9.33-8.04C.9 10.27 1.6 6.6 4.6 5.4 6.7 4.56 9 5.3 10.1 7.1L12 9.9l1.9-2.8c1.1-1.8 3.4-2.54 5.5-1.7 3 1.2 3.7 4.87 1.93 7.56C18.7 16.65 12 21 12 21z" /></svg>
              }
              label="100% natural"
            />
            <TrustItem
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
              }
              label="Envío a todo Panamá"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store" className="btn-brand">
              Comprar ahora
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="btn-brand-outline">
              Ver catálogo
            </LocalizedClientLink>
          </div>
        </div>

        {/* Panel decorativo (reemplazable por una foto de producto) */}
        <div className="relative hidden small:block">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-[2rem] bg-gradient-to-br from-brand-100 to-brand-50 p-10 shadow-[0_20px_60px_-20px_rgba(46,158,79,0.45)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/60">
              <svg viewBox="0 0 24 24" className="h-28 w-28 text-brand-500" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
            <span className="absolute -left-3 top-10 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-700 shadow-md">
              Lab Tested
            </span>
            <span className="absolute -right-3 bottom-16 rounded-full bg-white px-4 py-2 text-xs font-semibold text-accent-600 shadow-md">
              +5000 clientes
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
