import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYMENT_AUDIT_MODULE } from "../../../modules/payment-audit"
import PaymentAuditModuleService from "../../../modules/payment-audit/service"

// GET /admin/payment-logs?order_id=...&provider=... → auditoría de intentos de pago
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const audit: PaymentAuditModuleService = req.scope.resolve(PAYMENT_AUDIT_MODULE)
  const filters: Record<string, unknown> = {}
  if (req.query.order_id) filters.order_id = req.query.order_id
  if (req.query.provider) filters.provider = req.query.provider

  const logs = await audit.listPaymentAttemptLogs(filters, {
    order: { created_at: "DESC" },
    take: 100,
  })
  res.json({ payment_logs: logs })
}
