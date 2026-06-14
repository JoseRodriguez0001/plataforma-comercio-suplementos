"use server"

import { sdk } from "@lib/config"

type State = { success?: boolean; error?: string } | null

// Solicitar enlace de reseteo (el backend envía el email con el token).
export async function requestPasswordReset(_prev: State, formData: FormData): Promise<State> {
  const email = (formData.get("email") as string)?.trim()
  if (!email) return { error: "Ingresa tu correo." }
  try {
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: email })
  } catch {
    // No revelamos si el correo existe o no.
  }
  return { success: true }
}

// Establecer la nueva contraseña usando el token del email.
export async function resetPassword(_prev: State, formData: FormData): Promise<State> {
  const password = formData.get("password") as string
  const confirm = formData.get("confirm_password") as string
  const token = formData.get("token") as string

  if (!token) return { error: "Enlace inválido. Solicita uno nuevo." }
  if (!password || password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." }
  }
  if (password !== confirm) return { error: "Las contraseñas no coinciden." }

  try {
    await sdk.auth.updateProvider("customer", "emailpass", { password }, token)
  } catch {
    return { error: "El enlace es inválido o expiró. Solicita uno nuevo." }
  }
  return { success: true }
}
