import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CtaBanner = () => {
  return (
    <section className="py-12 small:py-20">
      <div className="content-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-footer px-8 py-14 text-center small:px-16">
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <span className="rounded-full bg-brand-500/20 px-4 py-1.5 text-xs font-semibold text-brand-300">
              Empieza hoy
            </span>
            <h2 className="heading-display text-3xl font-bold text-white small:text-4xl">
              Comienza tu camino hacia el bienestar
            </h2>
            <p className="text-grey-30">
              Suplementos premium y naturales para acompañar tu salud. Calidad
              respaldada por la ciencia, entrega a todo Panamá.
            </p>
            <LocalizedClientLink href="/store" className="btn-brand mt-2">
              Explorar productos
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBanner
