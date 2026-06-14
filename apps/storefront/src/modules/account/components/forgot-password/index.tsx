"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { requestPasswordReset } from "@lib/data/auth-reset"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPassword = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">Recuperar contraseña</h1>

      {state?.success ? (
        <p className="text-center text-base-regular text-ui-fg-base mb-6">
          Si el correo está registrado, te enviamos un enlace para restablecer
          tu contraseña. Revisa tu bandeja de entrada.
        </p>
      ) : (
        <>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
          <form className="w-full" action={formAction}>
            <Input label="Correo" name="email" type="email" required autoComplete="email" />
            {state?.error && (
              <p className="text-rose-500 text-small-regular mt-2">{state.error}</p>
            )}
            <SubmitButton className="w-full mt-6">Enviar enlace</SubmitButton>
          </form>
        </>
      )}

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        <button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} className="underline">
          Volver a iniciar sesión
        </button>
      </span>
    </div>
  )
}

export default ForgotPassword
