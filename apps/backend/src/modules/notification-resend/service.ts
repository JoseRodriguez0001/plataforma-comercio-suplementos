import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"

type Options = {
  apiKey?: string
  from?: string
  channels?: string[]
}

/**
 * Proveedor de notificación Resend (email transaccional) vía su API REST.
 * Sin dependencia npm extra (usa fetch). Si no hay apiKey, registra en log
 * (útil en dev). Activar en producción = definir RESEND_API_KEY/RESEND_FROM_EMAIL.
 */
class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend"

  protected logger_: Logger
  protected options_: Options

  constructor({ logger }: { logger: Logger }, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options ?? {}
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const apiKey = this.options_.apiKey
    const from = notification.from || this.options_.from
    const content: any = notification.content ?? {}
    const data: any = notification.data ?? {}
    const subject = content.subject || data.subject || "Notificación"
    const html = content.html || data.html
    const text = content.text || data.text

    if (!apiKey) {
      this.logger_.warn(
        `[resend] (sin RESEND_API_KEY) email simulado → ${notification.to} | asunto: "${subject}"`
      )
      return {}
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: notification.to,
        subject,
        html: html || undefined,
        text: text || undefined,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      this.logger_.error(`[resend] fallo enviando email (${res.status}): ${body}`)
      throw new Error(`Resend error ${res.status}`)
    }

    const json: any = await res.json()
    return { id: json?.id }
  }
}

export default ResendNotificationProviderService
