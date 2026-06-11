import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
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

export type YappyOptions = {
  merchant_id?: string
  secret?: string
  mode?: "sandbox" | "production"
}

/**
 * Proveedor de pago Yappy (Botón de Pago de Banco General).
 *
 * SKELETON: la estructura, la interfaz y la lectura de credenciales están
 * listas. La integración real con el API de Yappy queda pendiente de las
 * credenciales del comercio del dueño (ver módulo 05 spec). Cuando estén:
 * implementar las secciones marcadas con TODO y activar el proveedor en la
 * región. Docs: https://www.yappy.com.pa/comercial/desarrolladores/
 */
class YappyPaymentProviderService extends AbstractPaymentProvider<YappyOptions> {
  static identifier = "yappy"

  protected logger_: Logger
  protected options_: YappyOptions

  constructor(container: { logger: Logger }, options: YappyOptions) {
    super(container as any, options)
    this.logger_ = container.logger
    this.options_ = options ?? {}

    if (!this.isConfigured()) {
      this.logger_?.warn(
        "[yappy] proveedor cargado SIN credenciales. Define YAPPY_MERCHANT_ID y YAPPY_SECRET para producción."
      )
    }
  }

  private isConfigured(): boolean {
    return !!(this.options_.merchant_id && this.options_.secret)
  }

  /** Hasta tener credenciales + integración del API, las operaciones reales fallan claro. */
  private notReady(op: string): never {
    throw new Error(
      `[yappy] '${op}' no disponible: falta integrar el API real de Yappy (credenciales del comercio). ` +
        `Configura YAPPY_MERCHANT_ID/YAPPY_SECRET y completa la integración.`
    )
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    if (!this.isConfigured()) this.notReady("initiatePayment")
    // TODO: POST al API de Yappy para crear la orden de pago (monto/moneda/orderId)
    //       y devolver el identificador + datos para el aviso al móvil del cliente.
    //       Configurar expiración alineada a la reserva de 15 min.
    return this.notReady("initiatePayment")
  }

  async authorizePayment(_input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    // TODO: consultar/confirmar el estado del pago en Yappy (o vía webhook).
    return this.notReady("authorizePayment")
  }

  async capturePayment(_input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    // Yappy suele capturar al confirmar; mapear según el flujo real.
    return this.notReady("capturePayment")
  }

  async getPaymentStatus(_input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    // TODO: consultar estado en el API de Yappy y mapear a PaymentSessionStatus.
    return this.notReady("getPaymentStatus")
  }

  async refundPayment(_input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // TODO: solicitar reembolso vía API de Yappy (si lo soporta) o registrar manual.
    return this.notReady("refundPayment")
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
      data: { ...(input.data ?? {}), amount: input.amount, currency_code: input.currency_code },
    }
  }

  async getWebhookActionAndData(
    _payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    // TODO: verificar firma del webhook de Yappy y mapear el evento a:
    //       { action: "authorized" | "captured" | "failed" | ..., data: { session_id, amount } }
    return { action: "not_supported" }
  }
}

export default YappyPaymentProviderService
