import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYMENT_AUDIT_MODULE } from "../../../../modules/payment-audit"
import PaymentAuditModuleService from "../../../../modules/payment-audit/service"

const VALID_PROVIDERS = ["mock", "yappy", "paguelofacil", "stripe"] as const

// POST /webhooks/payments/:provider → recibe el webhook de la pasarela.
// Pública (fuera de /admin y /store). Registra el intento de forma idempotente.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { provider } = req.params
  if (!VALID_PROVIDERS.includes(provider as any)) {
    res.status(404).json({ message: `Proveedor desconocido: ${provider}` })
    return
  }

  const audit: PaymentAuditModuleService = req.scope.resolve(PAYMENT_AUDIT_MODULE)
  const body = (req.body as any) ?? {}

  // TODO (con credenciales): verificar la FIRMA del webhook según el proveedor
  //       (header/secret). Para verificar firma se necesitará el raw body.
  const signatureValid = false

  // Clave de idempotencia: header estándar o campos comunes del payload.
  const idempotencyKey =
    (req.headers["idempotency-key"] as string) ||
    body.idempotency_key ||
    body.transaction_id ||
    body.id ||
    null

  const { log, duplicate } = await audit.recordAttempt({
    provider: provider as any,
    event_type: body.event_type || body.status || "webhook_received",
    status: "pending",
    idempotency_key: idempotencyKey,
    external_reference: body.reference || body.transaction_id || body.id || null,
    order_id: body.order_id || null,
    amount: typeof body.amount === "number" ? body.amount : null,
    raw_payload: body,
    signature_valid: signatureValid,
  })

  // TODO (con credenciales): si no es duplicado y la firma es válida, mapear el
  //       evento a una acción (autorizado/capturado/fallido) y avanzar el pago.

  res.status(200).json({ received: true, duplicate, log_id: log.id })
}
