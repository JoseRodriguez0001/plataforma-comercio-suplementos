"use client"

import { useActionState, useState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const mismatch = confirm.length > 0 && password !== confirm

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="heading-display text-2xl font-bold text-ink mb-2 text-center">Crea tu cuenta en NATURZEN</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Regístrate para ver tu historial de pedidos, guardar direcciones y
        comprar más rápido.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input label="Nombre" name="first_name" required autoComplete="given-name" data-testid="first-name-input" />
          <Input label="Apellido" name="last_name" required autoComplete="family-name" data-testid="last-name-input" />
          <Input label="Correo" name="email" required type="email" autoComplete="email" data-testid="email-input" />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            pattern="[0-9+\-\s]{7,15}"
            title="Ingresa un teléfono válido (solo números, 7 a 15 dígitos)."
            data-testid="phone-input"
          />
          <Input
            label="Contraseña"
            name="password"
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            data-testid="password-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirmar contraseña"
            name="confirm_password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="confirm-password-input"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {mismatch && (
          <p className="text-rose-500 text-small-regular mt-2">
            Las contraseñas no coinciden.
          </p>
        )}
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Al crear una cuenta, aceptas la{" "}
          <LocalizedClientLink href="/content/privacy-policy" className="underline">
            Política de privacidad
          </LocalizedClientLink>{" "}
          y los{" "}
          <LocalizedClientLink href="/content/terms-of-use" className="underline">
            Términos de uso
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6" disabled={mismatch} data-testid="register-button">
          Crear cuenta
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        ¿Ya tienes cuenta?{" "}
        <button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} className="underline">
          Inicia sesión
        </button>
        .
      </span>
    </div>
  )
}

export default Register
