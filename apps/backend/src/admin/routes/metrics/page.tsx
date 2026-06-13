import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChartBar } from "@medusajs/icons"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Metrics = {
  period_days: number
  currency: string
  sales_total: number
  order_count: number
  avg_ticket: number
  top_products: { title: string; qty: number }[]
  low_stock_count: number
}

const Card = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-lg border p-4 bg-ui-bg-subtle">
    <Text size="small" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="xlarge" weight="plus">
      {value}
    </Text>
  </div>
)

const MetricsPage = () => {
  const [days, setDays] = useState(30)
  const [m, setM] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(
        `/admin/orders?fields=id,total,currency_code,status,created_at,items.title,items.quantity&limit=1000`,
        { credentials: "include" }
      ).then((r) => r.json()),
      fetch(`/admin/metrics`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([ord, met]) => {
        const orders: any[] = ord.orders ?? []
        const from = Date.now() - days * 86400000
        const inP = orders.filter(
          (o) => o.status !== "canceled" && new Date(o.created_at).getTime() >= from
        )
        const sales = inP.reduce((s, o) => s + Number(o.total ?? 0), 0)
        const count = inP.length
        const avg = count ? sales / count : 0
        const currency = (inP[0]?.currency_code ?? "usd").toUpperCase()
        const q: Record<string, number> = {}
        for (const o of inP) for (const it of o.items ?? []) q[it.title] = (q[it.title] ?? 0) + (it.quantity ?? 0)
        const top = Object.entries(q)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([title, qty]) => ({ title, qty }))
        setM({
          period_days: days,
          currency,
          sales_total: Math.round(sales * 100) / 100,
          order_count: count,
          avg_ticket: Math.round(avg * 100) / 100,
          top_products: top,
          low_stock_count: met?.low_stock_count ?? 0,
        })
      })
      .finally(() => setLoading(false))
  }, [days])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Métricas del negocio</Heading>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <Button key={d} size="small" variant={d === days ? "primary" : "secondary"} onClick={() => setDays(d)}>
              {d} días
            </Button>
          ))}
        </div>
      </div>

      {!loading && m && (
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card label={`Ventas (${m.period_days}d)`} value={`${m.sales_total} ${m.currency}`} />
            <Card label="Órdenes" value={`${m.order_count}`} />
            <Card label="Ticket promedio" value={`${m.avg_ticket} ${m.currency}`} />
            <Card label="Stock bajo" value={`${m.low_stock_count}`} />
          </div>

          <div>
            <Heading level="h2" className="mb-2">
              Productos más vendidos
            </Heading>
            {m.top_products.length ? (
              <div className="flex flex-col gap-2">
                {m.top_products.map((p) => (
                  <div key={p.title} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <Text>{p.title}</Text>
                    <Badge>{p.qty} uds</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Text className="text-ui-fg-subtle">Sin ventas en el período.</Text>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Métricas",
  icon: ChartBar,
})

export default MetricsPage
