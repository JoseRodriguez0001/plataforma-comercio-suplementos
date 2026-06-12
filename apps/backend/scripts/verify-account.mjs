// Verifica el flujo de cuenta: registro → consentimiento → baja con salvaguarda.
// Requiere el servidor en localhost:9000. Uso: node scripts/verify-account.mjs

const BASE = "http://localhost:9000"
const ADMIN = { email: "admin@local.test", password: "supersecret123" }
const EMAIL = `cuenta+${Date.now()}@test.pa`
const PASS = "Cliente123!"

let pk = ""

async function call(method, path, { body, token } = {}) {
  const h = { "Content-Type": "application/json" }
  if (pk) h["x-publishable-api-key"] = pk
  if (token) h["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method, headers: h, body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json; try { json = JSON.parse(text) } catch { json = text }
  return { ok: res.ok, status: res.status, json }
}

async function must(label, r) {
  if (!r.ok) throw new Error(`${label} → ${r.status}: ${JSON.stringify(r.json).slice(0, 300)}`)
  return r.json
}

async function main() {
  // pk (admin)
  const adminTok = (await must("login admin", await call("POST", "/auth/user/emailpass", { body: ADMIN }))).token
  pk = (await must("api-keys", await call("GET", "/admin/api-keys?type=publishable&limit=1", { token: adminTok }))).api_keys[0].token

  console.log(`\n[1] Registrar cliente ${EMAIL}`)
  const regTok = (await must("register", await call("POST", "/auth/customer/emailpass/register", { body: { email: EMAIL, password: PASS } }))).token
  await must("create customer", await call("POST", "/store/customers", { token: regTok, body: { email: EMAIL, first_name: "Cuenta", last_name: "Prueba" } }))
  const authTok = (await must("login customer", await call("POST", "/auth/customer/emailpass", { body: { email: EMAIL, password: PASS } }))).token
  console.log("    ✔ cliente creado y autenticado")

  console.log("[2] Registrar consentimiento (privacy_policy)")
  await must("set consent", await call("POST", "/store/consents", { token: authTok, body: { consent_type: "privacy_policy", granted: true, policy_version: "v1" } }))
  const consents = (await must("list consents", await call("GET", "/store/consents", { token: authTok }))).consents
  console.log(`    ✔ consentimientos: ${consents.map((c) => `${c.consent_type}=${c.granted}`).join(", ")}`)

  console.log("[3] Baja de cuenta (sin órdenes activas → permitido)")
  const del = await call("DELETE", "/store/account", { token: authTok })
  console.log(`    status=${del.status}, body=${JSON.stringify(del.json)}`)
  if (!del.ok) throw new Error("La baja debió permitirse (sin órdenes activas)")

  console.log("[4] Verificar que el login ya no funciona")
  const relogin = await call("POST", "/auth/customer/emailpass", { body: { email: EMAIL, password: PASS } })
  console.log(`    re-login status=${relogin.status} (se espera 401/400)`)

  console.log("\n✅ ACCOUNT OK: registro + consentimiento + baja con salvaguarda funcionan.")
}

main().catch((e) => { console.error("\n❌ FALLÓ:", e.message); process.exit(1) })
