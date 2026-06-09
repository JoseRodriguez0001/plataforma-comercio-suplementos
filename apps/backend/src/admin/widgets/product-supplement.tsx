import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {
  Container,
  Heading,
  Button,
  Input,
  Textarea,
  Label,
  Switch,
  Select,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Brand = { id: string; name: string }

type FormState = {
  brand_id: string
  ingredientes: string
  modo_de_uso: string
  advertencias: string
  tamano_porcion: string
  porciones_por_envase: string
  registro_sanitario: string
  es_vegano: boolean
  sin_azucar: boolean
  sin_gluten: boolean
  apto_vegetariano: boolean
}

const EMPTY: FormState = {
  brand_id: "",
  ingredientes: "",
  modo_de_uso: "",
  advertencias: "",
  tamano_porcion: "",
  porciones_por_envase: "",
  registro_sanitario: "",
  es_vegano: false,
  sin_azucar: false,
  sin_gluten: false,
  apto_vegetariano: false,
}

const ProductSupplementWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  useEffect(() => {
    const load = async () => {
      try {
        const [brandsRes, infoRes] = await Promise.all([
          fetch(`/admin/brands`, { credentials: "include" }),
          fetch(`/admin/products/${product.id}/supplement`, { credentials: "include" }),
        ])
        const brandsData = await brandsRes.json()
        const infoData = await infoRes.json()
        setBrands(brandsData.brands ?? [])
        const i = infoData.supplement_info
        setForm({
          brand_id: infoData.brand?.id ?? "",
          ingredientes: i?.ingredientes ?? "",
          modo_de_uso: i?.modo_de_uso ?? "",
          advertencias: i?.advertencias ?? "",
          tamano_porcion: i?.tamano_porcion ?? "",
          porciones_por_envase: i?.porciones_por_envase?.toString() ?? "",
          registro_sanitario: i?.registro_sanitario ?? "",
          es_vegano: !!i?.es_vegano,
          sin_azucar: !!i?.sin_azucar,
          sin_gluten: !!i?.sin_gluten,
          apto_vegetariano: !!i?.apto_vegetariano,
        })
      } catch (e) {
        toast.error("No se pudieron cargar los atributos de suplemento")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [product.id])

  const onSave = async () => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        ingredientes: form.ingredientes || null,
        modo_de_uso: form.modo_de_uso || null,
        advertencias: form.advertencias,
        tamano_porcion: form.tamano_porcion || null,
        porciones_por_envase: form.porciones_por_envase
          ? Number(form.porciones_por_envase)
          : null,
        registro_sanitario: form.registro_sanitario || null,
        es_vegano: form.es_vegano,
        sin_azucar: form.sin_azucar,
        sin_gluten: form.sin_gluten,
        apto_vegetariano: form.apto_vegetariano,
      }
      if (form.brand_id) payload.brand_id = form.brand_id

      const res = await fetch(`/admin/products/${product.id}/supplement`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Atributos de suplemento guardados")
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Atributos de suplemento</Heading>
        <Button size="small" onClick={onSave} isLoading={saving} disabled={loading}>
          Guardar
        </Button>
      </div>

      {!loading && (
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex flex-col gap-1">
            <Label size="small">Marca</Label>
            <Select value={form.brand_id} onValueChange={(v) => set("brand_id", v)}>
              <Select.Trigger>
                <Select.Value placeholder="Sin marca" />
              </Select.Trigger>
              <Select.Content>
                {brands.map((b) => (
                  <Select.Item key={b.id} value={b.id}>
                    {b.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <Field label="Advertencias (obligatorio)">
            <Textarea
              value={form.advertencias}
              onChange={(e) => set("advertencias", e.target.value)}
              placeholder="Ej. Consulte a su médico antes de usar."
            />
          </Field>

          <Field label="Ingredientes">
            <Textarea
              value={form.ingredientes}
              onChange={(e) => set("ingredientes", e.target.value)}
            />
          </Field>

          <Field label="Modo de uso">
            <Textarea
              value={form.modo_de_uso}
              onChange={(e) => set("modo_de_uso", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tamaño de porción">
              <Input
                value={form.tamano_porcion}
                onChange={(e) => set("tamano_porcion", e.target.value)}
                placeholder="1 scoop (30 g)"
              />
            </Field>
            <Field label="Porciones por envase">
              <Input
                type="number"
                value={form.porciones_por_envase}
                onChange={(e) => set("porciones_por_envase", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Registro sanitario">
            <Input
              value={form.registro_sanitario}
              onChange={(e) => set("registro_sanitario", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Flag label="Vegano" checked={form.es_vegano} onChange={(v) => set("es_vegano", v)} />
            <Flag label="Sin azúcar" checked={form.sin_azucar} onChange={(v) => set("sin_azucar", v)} />
            <Flag label="Sin gluten" checked={form.sin_gluten} onChange={(v) => set("sin_gluten", v)} />
            <Flag
              label="Apto vegetariano"
              checked={form.apto_vegetariano}
              onChange={(v) => set("apto_vegetariano", v)}
            />
          </div>
        </div>
      )}
    </Container>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <Label size="small">{label}</Label>
    {children}
  </div>
)

const Flag = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <div className="flex items-center gap-2">
    <Switch checked={checked} onCheckedChange={onChange} />
    <Label size="small">{label}</Label>
  </div>
)

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductSupplementWidget
