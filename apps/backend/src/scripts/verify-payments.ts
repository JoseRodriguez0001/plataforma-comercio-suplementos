import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Lista los proveedores de pago registrados en el Payment Module.
 * Uso: npx medusa exec src/scripts/verify-payments.ts
 */
export default async function verifyPayments({ container }: ExecArgs) {
  const payment: any = container.resolve(Modules.PAYMENT)
  const providers = await payment.listPaymentProviders()
  console.log("Proveedores de pago:", providers.map((p: any) => `${p.id} (enabled=${p.is_enabled})`))
}
