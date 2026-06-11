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

export type PagueloFacilOptions = {
  cclw?: string
  api_key?: string
  mode?: "sandbox" | "production"
}

/**
 * Proveedor de pago PagueloFacil (tarjetas de crédito/débito, Sistema Clave).
 *
 * SKELETON: interfaz y lectura de credenciales listas. La integración real
 * (flujo hospedado/redirect + retorno + tokenización) queda pendiente de las
 * credenciales del comercio. Docs: https://en.paguelofacil.com/
 */
class PagueloFacilPaymentProviderService extends AbstractPaymentProvider<PagueloFacilOptions> {
  static identifier = "paguelofacil"

  protected logger_: Logger
  protected options_: PagueloFacilOptions

  constructor(container: { logger: Logger }, options: PagueloFacilOptions) {
    super(container as any, options)
    this.logger_ = container.logger
    this.options_ = options ?? {}

    if (!this.isConfigured()) {
      this.logger_?.warn(
        "[paguelofacil] proveedor cargado SIN credenciales. Define PAGUELOFACIL_CCLW y PAGUELOFACIL_API_KEY para producción."
      )
    }
  }

  private isConfigured(): boolean {
    return !!(this.options_.cclw && this.options_.api_key)
  }

  private notReady(op: string): never {
    throw new Error(
      `[paguelofacil] '${op}' no disponible: falta integrar el API real (credenciales del comercio). ` +
        `Configura PAGUELOFACIL_CCLW/PAGUELOFACIL_API_KEY y completa la integración.`
    )
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    if (!this.isConfigured()) this.notReady("initiatePayment")
    // TODO: crear la transacción en PagueloFacil (monto/moneda/retorno) y devolver
    //       el id + URL hospedada de pago (redirect). Alinear expiración a 15 min.
    return this.notReady("initiatePayment")
  }

  async authorizePayment(_input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    // TODO: confirmar resultado tras el retorno/redirect o vía webhook.
    return this.notReady("authorizePayment")
  }

  async capturePayment(_input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return this.notReady("capturePayment")
  }

  async getPaymentStatus(_input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    // TODO: consultar estado de la transacción y mapear a PaymentSessionStatus.
    return this.notReady("getPaymentStatus")
  }

  async refundPayment(_input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // TODO: reembolso vía API de PagueloFacil.
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
    // TODO: verificar firma del webhook de PagueloFacil y mapear el evento.
    return { action: "not_supported" }
  }
}

export default PagueloFacilPaymentProviderService
