import { MedusaService } from "@medusajs/framework/utils"
import { PaymentAttemptLog } from "./models/payment-attempt-log"

type RecordAttemptInput = {
  provider: "mock" | "yappy" | "paguelofacil" | "stripe"
  event_type: string
  status?: "pending" | "success" | "failed" | "canceled" | "refunded"
  idempotency_key?: string | null
  external_reference?: string | null
  order_id?: string | null
  payment_collection_id?: string | null
  amount?: number | null
  raw_payload?: Record<string, unknown> | null
  signature_valid?: boolean
}

class PaymentAuditModuleService extends MedusaService({ PaymentAttemptLog }) {
  /**
   * Registra un intento/evento de pago de forma idempotente. Si llega un
   * idempotency_key ya visto, no crea otro registro (evita doble proceso).
   */
  async recordAttempt(
    data: RecordAttemptInput
  ): Promise<{ log: any; duplicate: boolean }> {
    if (data.idempotency_key) {
      const existing = await this.listPaymentAttemptLogs({
        idempotency_key: data.idempotency_key,
      })
      if (existing.length) {
        return { log: existing[0], duplicate: true }
      }
    }
    const log = await this.createPaymentAttemptLogs({
      provider: data.provider,
      event_type: data.event_type,
      status: data.status ?? "pending",
      idempotency_key: data.idempotency_key ?? null,
      external_reference: data.external_reference ?? null,
      order_id: data.order_id ?? null,
      payment_collection_id: data.payment_collection_id ?? null,
      amount: data.amount ?? null,
      raw_payload: data.raw_payload ?? null,
      signature_valid: data.signature_valid ?? false,
    })
    return { log, duplicate: false }
  }
}

export default PaymentAuditModuleService
