import { Metadata } from "next"
import ContentPage from "@modules/content/templates/content-page"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el equipo de NATURZEN.",
}

const methods = [
  {
    label: "Correo",
    value: "hola@naturzen.com",
    href: "mailto:hola@naturzen.com",
    icon: (
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.01L12 13l8-6.99V6H4zm16 2.24-8 7-8-7V18h16V8.24z" />
    ),
  },
  {
    label: "WhatsApp",
    value: "+507 0000-0000",
    href: "https://wa.me/5070000000",
    icon: (
      <path d="M.06 24l1.68-6.13A11.86 11.86 0 0 1 .16 11.9C.16 5.33 5.5 0 12.06 0a11.82 11.82 0 0 1 8.41 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.69-1.45L.06 24zM12.06 2c-5.46 0-9.9 4.43-9.9 9.88a9.8 9.8 0 0 0 1.51 5.26l-.99 3.62 3.98-1.04c1.5.83 2.92 1.32 5.4 1.32 5.45 0 9.89-4.43 9.89-9.88a9.82 9.82 0 0 0-2.9-7A9.82 9.82 0 0 0 12.06 2z" />
    ),
  },
  {
    label: "Horario",
    value: "Lun a Vie, 9:00 – 18:00",
    href: null,
    icon: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13h-2v6l5 3 1-1.73-4-2.27V7z" />
    ),
  },
]

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contacto"
      title="Hablemos"
      subtitle="¿Tienes una pregunta sobre un producto o tu pedido? Escríbenos."
    >
      <div className="grid grid-cols-1 gap-4 small:grid-cols-3">
        {methods.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center rounded-rounded border border-grey-20 bg-brand-50/50 p-6 text-center"
          >
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                {m.icon}
              </svg>
            </span>
            <span className="font-display text-sm font-semibold text-ink">
              {m.label}
            </span>
            {m.href ? (
              <a href={m.href} className="mt-1 text-sm text-brand-700">
                {m.value}
              </a>
            ) : (
              <span className="mt-1 text-sm text-grey-50">{m.value}</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-grey-40">
        Actualiza estos datos de contacto con los reales del negocio antes de
        publicar la tienda.
      </p>
    </ContentPage>
  )
}
