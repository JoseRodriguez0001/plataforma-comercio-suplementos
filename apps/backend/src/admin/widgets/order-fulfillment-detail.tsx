import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import {
  Container,
  Heading,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Carrier = { id: string; name: string }

type Form = {
  method: "shipping" | "pickup"
  carrier_id: string
  tracking_number: string
  shipped_at: string
  estimated_delivery_at: string
  delivery_note: string
  ready_for_pickup_at: string
  picked_up_at: string
}

const EMPTY: Form = {
  method: "shipping",
  carrier_id: "",
  tracking_number: "",
  shipped_at: "",
  estimated_delivery_at: "",
  delivery_note: "",
  ready_for_pickup_at: "",
  picked_up_at: "",
}

const d = (v?: string | null) => (v ? v.slice(0, 10) : "")

const OrderFulfillmentDetailWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const [form, setForm] = useState<Form>(EMPTY)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          fetch(`/admin/shipping-carriers`, { credentials: "include" }),
          fetch(`/admin/orders/${order.id}/fulfillment-detail`, { credentials: "include" }),
        ])
        const cJson = await cRes.json()
        const dJson = await dRes.json()
        setCarriers(cJson.shipping_carriers ?? [])
        const fd = dJson.fulfillment_detail
        if (fd) {
          setForm({
            method: fd.method ?? "shipping",
            carrier_id: fd.carrier_id ?? "",
            tracking_number: fd.tracking_number ?? "",
            shipped_at: d(fd.shipped_at),
            estimated_delivery_at: d(fd.estimated_delivery_at),
            delivery_note: fd.delivery_note ?? "",
            ready_for_pickup_at: d(fd.ready_for_pickup_at),
            picked_up_at: d(fd.picked_up_at),
          })
        }
      } catch {
        toast.error("No se pudieron cargar los datos de cumplimiento")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [order.id])

  const onSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/admin/orders/${order.id}/fulfillment-detail`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: form.method,
          carrier_id: form.carrier_id || null,
          tracking_number: form.tracking_number || null,
          shipped_at: form.shipped_at || null,
          estimated_delivery_at: form.estimated_delivery_at || null,
          delivery_note: form.delivery_note || null,
          ready_for_pickup_at: form.ready_for_pickup_at || null,
          picked_up_at: form.picked_up_at || null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Datos de cumplimiento guardados")
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Cumplimiento (envío / retiro)</Heading>
        <Button size="small" onClick={onSave} isLoading={saving} disabled={loading}>
          Guardar
        </Button>
      </div>

      {!loading && (
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex flex-col gap-1">
            <Label size="small">Método</Label>
            <Select value={form.method} onValueChange={(v) => set("method", v as Form["method"])}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="shipping">Envío a domicilio</Select.Item>
                <Select.Item value="pickup">Retiro en local</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {form.method === "shipping" ? (
            <>
              <div className="flex flex-col gap-1">
                <Label size="small">Transportista</Label>
                <Select value={form.carrier_id} onValueChange={(v) => set("carrier_id", v)}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecciona…" />
                  </Select.Trigger>
                  <Select.Content>
                    {carriers.map((c) => (
                      <Select.Item key={c.id} value={c.id}>
                        {c.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="N.º de guía">
                  <Input value={form.tracking_number} onChange={(e) => set("tracking_number", e.target.value)} />
                </Field>
                <Field label="Fecha de envío">
                  <Input type="date" value={form.shipped_at} onChange={(e) => set("shipped_at", e.target.value)} />
                </Field>
                <Field label="Entrega estimada">
                  <Input type="date" value={form.estimated_delivery_at} onChange={(e) => set("estimated_delivery_at", e.target.value)} />
                </Field>
              </div>
              <Field label="Nota de entrega">
                <Textarea value={form.delivery_note} onChange={(e) => set("delivery_note", e.target.value)} placeholder="Ej. coordinar por WhatsApp" />
              </Field>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Listo para retiro">
                <Input type="date" value={form.ready_for_pickup_at} onChange={(e) => set("ready_for_pickup_at", e.target.value)} />
              </Field>
              <Field label="Retirado el">
                <Input type="date" value={form.picked_up_at} onChange={(e) => set("picked_up_at", e.target.value)} />
              </Field>
            </div>
          )}
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

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderFulfillmentDetailWidget
