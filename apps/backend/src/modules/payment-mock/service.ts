import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"

type Options = Record<string, unknown>

/**
 * Proveedor de pago de prueba (mock). Permite desarrollar y probar el checkout
 * end-to-end sin credenciales reales (RF-PAY-13). El comportamiento se puede
 * dirigir con `data.simulate` ("fail" | "requires_more") para probar fallos.
 * NO usar en producción.
 */
class MockPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "mock"

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const id = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    return {
      id,
      status: "pending",
      data: {
        ...(input.data ?? {}),
        id,
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const simulate = (input.data as any)?.simulate
    let status: AuthorizePaymentOutput["status"] = "authorized"
    if (simulate === "fail") status = "error"
    else if (simulate === "requires_more") status = "requires_more"
    return {
      status,
      data: { ...(input.data ?? {}), authorized_at: new Date().toISOString() },
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return {
      data: { ...(input.data ?? {}), captured: true, captured_at: new Date().toISOString() },
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const data = (input.data ?? {}) as any
    let status: GetPaymentStatusOutput["status"] = "authorized"
    if (data.canceled) status = "canceled"
    else if (data.captured) status = "captured"
    return { status, data }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: { ...(input.data ?? {}), refunded_amount: input.amount } }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: { ...(input.data ?? {}), canceled: true } }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return {
      data: {
        ...(input.data ?? {}),
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async getWebhookActionAndData(
    _payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    // El mock no recibe webhooks reales.
    return { action: "not_supported" }
  }
}

export default MockPaymentProviderService
