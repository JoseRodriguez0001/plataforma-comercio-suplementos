// Verifica la fusión de carrito al iniciar sesión.
// Requiere servidor en localhost:9000. Uso: node scripts/verify-cart-merge.mjs

const BASE = "http://localhost:9000"
const ADMIN = { email: "admin@local.test", password: "supersecret123" }
const EMAIL = `merge+${Date.now()}@test.pa`
const PASS = "Cliente123!"
let pk = ""

async function call(method, path, { body, token } = {}) {
  const h = { "Content-Type": "application/json" }
  if (pk) h["x-publishable-api-key"] = pk
  if (token) h["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined })
  const t = await res.text(); let j; try { j = JSON.parse(t) } catch { j = t }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return j
}

async function variant(handle, rid) {
  const p = (await call("GET", `/store/products?handle=${handle}&region_id=${rid}&fields=id,*variants`)).products
  return p[0].variants[0].id
}

async function main() {
  const adminTok = (await call("POST", "/auth/user/emailpass", { body: ADMIN })).token
  pk = (await call("GET", "/admin/api-keys?type=publishable&limit=1", { token: adminTok })).api_keys[0].token
  const region = (await call("GET", "/admin/regions?fields=id,currency_code", { token: adminTok })).regions.find((r) => r.currency_code === "usd")
  const vCreatina = await variant("creatina-monohidratada-300g", region.id)
  const vWhey = await variant("whey-gold-standard-2lb", region.id)

  console.log(`\n[setup] Cliente ${EMAIL}`)
  const regTok = (await call("POST", "/auth/customer/emailpass/register", { body: { email: EMAIL, password: PASS } })).token
  await call("POST", "/store/customers", { token: regTok, body: { email: EMAIL, first_name: "Merge", last_name: "Test" } })
  const tok = (await call("POST", "/auth/customer/emailpass", { body: { email: EMAIL, password: PASS } })).token

  console.log("\n=== CASO FUSIÓN ===")
  console.log("[1] Carrito invitado A + creatina")
  const A = (await call("POST", "/store/carts", { body: { region_id: region.id } })).cart
  await call("POST", `/store/carts/${A.id}/line-items`, { body: { variant_id: vCreatina, quantity: 1 } })
  console.log("[2] Carrito del cliente B + whey")
  const B = (await call("POST", "/store/carts", { token: tok, body: { region_id: region.id } })).cart
  await call("POST", `/store/carts/${B.id}/line-items`, { token: tok, body: { variant_id: vWhey, quantity: 1 } })
  console.log("[3] Merge A→B")
  const merged = await call("POST", "/store/carts/merge", { token: tok, body: { source_cart_id: A.id, target_cart_id: B.id } })
  console.log(`    merged=${merged.merged}, customer=${!!merged.cart.customer_id}, líneas=${merged.cart.items.length} → ${merged.cart.items.map((i) => i.title).join(", ")}`)
  if (merged.cart.items.length !== 2) throw new Error("La fusión debió dejar 2 líneas")

  console.log("\n=== CASO TRANSFERENCIA (cliente sin carrito previo) ===")
  console.log("[4] Carrito invitado C + creatina")
  const C = (await call("POST", "/store/carts", { body: { region_id: region.id } })).cart
  await call("POST", `/store/carts/${C.id}/line-items`, { body: { variant_id: vCreatina, quantity: 2 } })
  console.log("[5] Merge solo source C")
  const transferred = await call("POST", "/store/carts/merge", { token: tok, body: { source_cart_id: C.id } })
  console.log(`    merged=${transferred.merged}, customer=${!!transferred.cart.customer_id}, líneas=${transferred.cart.items.length}`)
  if (transferred.merged !== false || !transferred.cart.customer_id) throw new Error("La transferencia debió asignar el cliente al carrito")

  console.log("\n✅ CART MERGE OK: fusión y transferencia al iniciar sesión funcionan.")
}

main().catch((e) => { console.error("\n❌ FALLÓ:", e.message); process.exit(1) })
