"use client"

import { Suspense, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { resetPassword } from "@lib/data/auth-reset"

const ResetForm = () => {
  const params = useSearchParams()
  const token = params.get("token") ?? ""
  const [state, formAction] = useActionState(resetPassword, null)

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">Restablecer contraseña</h1>

      {state?.success ? (
        <>
          <p className="text-center text-base-regular mb-6">
            Tu contraseña se actualizó correctamente.
          </p>
          <LocalizedClientLink href="/account" className="underline">
            Iniciar sesión
          </LocalizedClientLink>
        </>
      ) : !token ? (
        <p className="text-center text-rose-500 text-base-regular">
          Enlace inválido o incompleto. Solicita uno nuevo desde “¿Olvidaste tu
          contraseña?”.
        </p>
      ) : (
        <form className="w-full" action={formAction}>
          <input type="hidden" name="token" value={token} />
          <div className="flex flex-col gap-y-2">
            <Input label="Nueva contraseña" name="password" type="password" required autoComplete="new-password" />
            <Input label="Confirmar contraseña" name="confirm_password" type="password" required autoComplete="new-password" />
          </div>
          {state?.error && (
            <p className="text-rose-500 text-small-regular mt-2">{state.error}</p>
          )}
          <SubmitButton className="w-full mt-6">Guardar contraseña</SubmitButton>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="content-container py-12 flex justify-center">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  )
}
