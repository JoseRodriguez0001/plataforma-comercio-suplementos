const values = [
  {
    title: "Puro y natural",
    desc: "Ingredientes de origen natural, seleccionados por su pureza y potencia.",
    icon: (
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    ),
  },
  {
    title: "Calidad garantizada",
    desc: "Cada producto cumple los más altos estándares de calidad y seguridad.",
    icon: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "El cliente primero",
    desc: "Tu salud es nuestra prioridad: te acompañamos en tu bienestar.",
    icon: (
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Compromiso real",
    desc: "Bienestar auténtico, accesible para todos, respaldado por la ciencia.",
    icon: (
      <path d="M12 21s-6.7-4.35-9.33-8.04C.9 10.27 1.6 6.6 4.6 5.4 6.7 4.56 9 5.3 10.1 7.1L12 9.9l1.9-2.8c1.1-1.8 3.4-2.54 5.5-1.7 3 1.2 3.7 4.87 1.93 7.56C18.7 16.65 12 21 12 21z" />
    ),
  },
]

const ValueProps = () => {
  return (
    <section className="bg-white py-12 small:py-20">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-pill-amber mb-4">Por qué NATURZEN</span>
          <h2 className="heading-display text-3xl font-bold text-ink small:text-4xl">
            Bienestar con propósito
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-8 medium:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                  {v.icon}
                </svg>
              </span>
              <h3 className="font-display text-base font-semibold text-ink">
                {v.title}
              </h3>
              <p className="mt-2 max-w-[15rem] text-sm leading-6 text-grey-50">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValueProps
