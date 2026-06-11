import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Button, Input, Label, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Row = { expiration_date: string; lot_code: string; saving?: boolean }

const ProductVariantExpiryWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const variants = product.variants ?? []
  const [rows, setRows] = useState<Record<string, Row>>({})
  const [loading, setLoading] = useState(true)

  const set = (vid: string, patch: Partial<Row>) =>
    setRows((r) => ({ ...r, [vid]: { ...r[vid], ...patch } }))

  useEffect(() => {
    const load = async () => {
      try {
        const entries = await Promise.all(
          variants.map(async (v) => {
            const res = await fetch(`/admin/variants/${v.id}/expiry`, { credentials: "include" })
            const json = await res.json()
            const ve = json.variant_expiry
            return [
              v.id,
              {
                expiration_date: ve?.expiration_date ? ve.expiration_date.slice(0, 10) : "",
                lot_code: ve?.lot_code ?? "",
              },
            ] as const
          })
        )
        setRows(Object.fromEntries(entries))
      } catch {
        toast.error("No se pudo cargar el vencimiento de las variantes")
      } finally {
        setLoading(false)
      }
    }
    if (variants.length) load()
    else setLoading(false)
  }, [product.id])

  const save = async (vid: string) => {
    set(vid, { saving: true })
    try {
      const row = rows[vid]
      const res = await fetch(`/admin/variants/${vid}/expiry`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expiration_date: row.expiration_date || null,
          lot_code: row.lot_code || null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Vencimiento guardado")
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      set(vid, { saving: false })
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Vencimiento por variante</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Fecha de vencimiento y lote (informativo). Alimenta la alerta de vencimiento.
        </Text>
      </div>

      {!loading &&
        variants.map((v) => {
          const row = rows[v.id] ?? { expiration_date: "", lot_code: "" }
          return (
            <div key={v.id} className="flex items-end gap-3 px-6 py-3">
              <div className="flex-1">
                <Label size="small">{v.title || v.sku || "Variante"}</Label>
              </div>
              <div className="flex flex-col gap-1">
                <Label size="small">Vence</Label>
                <Input
                  type="date"
                  value={row.expiration_date}
                  onChange={(e) => set(v.id, { expiration_date: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label size="small">Lote</Label>
                <Input
                  value={row.lot_code}
                  onChange={(e) => set(v.id, { lot_code: e.target.value })}
                  placeholder="Opcional"
                />
              </div>
              <Button
                size="small"
                variant="secondary"
                onClick={() => save(v.id)}
                isLoading={!!row.saving}
              >
                Guardar
              </Button>
            </div>
          )
        })}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVariantExpiryWidget
