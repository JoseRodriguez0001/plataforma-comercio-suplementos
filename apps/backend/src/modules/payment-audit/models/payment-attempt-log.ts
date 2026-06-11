import { model } from "@medusajs/framework/utils"

/**
 * Auditoría de intentos de pago y webhooks. Base de la idempotencia (no duplicar
 * cobros/órdenes) y de la conciliación. Registro append-only.
 */
export const PaymentAttemptLog = model.define("payment_attempt_log", {
  id: model.id().primaryKey(),
  provider: model.enum(["mock", "yappy", "paguelofacil", "stripe"]),
  order_id: model.text().nullable(),
  payment_collection_id: model.text().nullable(),
  // Único: evita procesar dos veces el mismo evento/cobro. (NULL permitido y repetible.)
  idempotency_key: model.text().unique().nullable(),
  external_reference: model.text().nullable(),
  event_type: model.text(),
  status: model
    .enum(["pending", "success", "failed", "canceled", "refunded"])
    .default("pending"),
  amount: model.number().nullable(),
  raw_payload: model.json().nullable(),
  signature_valid: model.boolean().default(false),
})
