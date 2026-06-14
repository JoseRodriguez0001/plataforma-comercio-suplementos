import { ReactNode } from "react"
import { getSupplement } from "@lib/data/supplement"

const Flag = ({ children }: { children: ReactNode }) => (
  <span className="inline-block rounded-full border border-ui-border-base px-2 py-0.5 text-xs text-ui-fg-subtle">
    {children}
  </span>
)

const Field = ({ label, value }: { label: string; value?: string | null | number }) =>
  value ? (
    <div>
      <span className="font-semibold">{label}</span>
      <p className="text-ui-fg-subtle whitespace-pre-line">{value}</p>
    </div>
  ) : null

const SupplementInfo = async ({ productId }: { productId: string }) => {
  const { supplement_info: s, brand } = await getSupplement(productId)
  if (!s && !brand) return null

  const flags: string[] = []
  if (s?.es_vegano) flags.push("Vegano")
  if (s?.sin_azucar) flags.push("Sin azúcar")
  if (s?.sin_gluten) flags.push("Sin gluten")
  if (s?.apto_vegetariano) flags.push("Apto vegetariano")

  return (
    <div className="flex flex-col gap-y-4 border-t border-ui-border-base pt-6 text-small-regular">
      <h3 className="text-base-semi">Información del suplemento</h3>

      {brand?.name && <Field label="Marca" value={brand.name} />}

      {flags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {flags.map((f) => (
            <Flag key={f}>{f}</Flag>
          ))}
        </div>
      )}

      <Field label="Advertencias" value={s?.advertencias} />
      <Field label="Ingredientes" value={s?.ingredientes} />
      <Field label="Modo de uso" value={s?.modo_de_uso} />
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Field label="Tamaño de porción" value={s?.tamano_porcion} />
        <Field label="Porciones por envase" value={s?.porciones_por_envase ?? undefined} />
        <Field label="Registro sanitario" value={s?.registro_sanitario} />
      </div>
    </div>
  )
}

export default SupplementInfo
