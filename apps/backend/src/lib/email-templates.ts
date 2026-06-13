// Plantillas de email transaccional (español, branding simple).
// Devuelven { subject, html } para el proveedor de notificación.

const STORE = process.env.STORE_NAME || "Suplementos Panamá"

function layout(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="es"><body style="font-family:Arial,sans-serif;background:#f5f7fa;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf0">
    <div style="background:#0f766e;color:#fff;padding:16px 24px;font-size:18px;font-weight:bold">${STORE}</div>
    <div style="padding:24px;color:#1f2937;font-size:15px;line-height:1.5">
      <h2 style="margin-top:0;color:#0f766e">${title}</h2>
      ${body}
    </div>
    <div style="padding:16px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e6eaf0">
      ${STORE} · Este es un correo automático, por favor no respondas.
    </div>
  </div></body></html>`
}

function itemsList(order: any): string {
  const items = order?.items ?? []
  const rows = items
    .map(
      (i: any) =>
        `<tr><td style="padding:4px 0">${i.quantity}× ${i.title}</td><td style="padding:4px 0;text-align:right">${i.unit_price} ${order.currency_code?.toUpperCase() ?? ""}</td></tr>`
    )
    .join("")
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0">${rows}</table>`
}

export function orderConfirmationEmail(order: any) {
  return {
    subject: `Confirmación de tu pedido #${order.display_id}`,
    html: layout(
      "¡Gracias por tu compra!",
      `<p>Recibimos tu pedido <strong>#${order.display_id}</strong>. Estos son los detalles:</p>
       ${itemsList(order)}
       <p style="font-size:16px"><strong>Total: ${order.total} ${order.currency_code?.toUpperCase() ?? ""}</strong></p>
       <p>Te avisaremos cuando tu pedido sea preparado y enviado.</p>`
    ),
  }
}

export function orderCanceledEmail(order: any) {
  return {
    subject: `Tu pedido #${order.display_id} fue cancelado`,
    html: layout(
      "Pedido cancelado",
      `<p>Tu pedido <strong>#${order.display_id}</strong> fue cancelado. Si corresponde un reembolso, se procesará por el mismo medio de pago.</p>
       <p>Si tienes dudas, contáctanos.</p>`
    ),
  }
}

export function lowStockOwnerEmail(rows: { name: string; available: number; threshold: number }[]) {
  const list = rows
    .map((r) => `<li>${r.name} — disponible ${r.available} (umbral ${r.threshold})</li>`)
    .join("")
  return {
    subject: `Alerta: ${rows.length} producto(s) con stock bajo`,
    html: layout(
      "Stock bajo",
      `<p>Estos productos están en o por debajo de su umbral de stock:</p><ul>${list}</ul><p>Considera reabastecer.</p>`
    ),
  }
}

export function expiryOwnerEmail(rows: { name: string; date: string; days: number }[]) {
  const list = rows
    .map((r) => `<li>${r.name} — vence ${r.date} (${r.days < 0 ? "VENCIDO" : `en ${r.days} días`})</li>`)
    .join("")
  return {
    subject: `Alerta: ${rows.length} producto(s) por vencer`,
    html: layout(
      "Productos por vencer",
      `<p>Estos productos están próximos a vencer o ya vencieron:</p><ul>${list}</ul>`
    ),
  }
}

export function newOrderOwnerEmail(order: any) {
  return {
    subject: `Nuevo pedido #${order.display_id} (${order.total} ${order.currency_code?.toUpperCase() ?? ""})`,
    html: layout(
      "Nuevo pedido recibido",
      `<p>Entró un nuevo pedido <strong>#${order.display_id}</strong> de ${order.email}.</p>
       ${itemsList(order)}
       <p><strong>Total: ${order.total} ${order.currency_code?.toUpperCase() ?? ""}</strong></p>
       <p>Prepáralo desde el panel de administración.</p>`
    ),
  }
}
