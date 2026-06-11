// Smoke test end-to-end del checkout con payment-mock (flujo real de la Store API).
// Requiere el servidor corriendo en localhost:9000.
// Uso: node scripts/smoke-checkout.mjs

const BASE = "http://localhost:9000"
const ADMIN = { email: "admin@local.test", password: "supersecret123" }

let adminToken = ""
let pk = ""

async function call(method, path, { body, headers, store } = {}) {
  const h = { "Content-Type": "application/json", ...(headers ?? {}) }
  if (store && pk) h["x-publishable-api-key"] = pk
  if (!store && adminToken) h["Authorization"] = `Bearer ${adminToken}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = text }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${typeof json === "string" ? json : JSON.stringify(json)}`)
  }
  return json
}

function step(n, msg) { console.log(`\n[${n}] ${msg}`) }

async function main() {
  // --- Setup admin ---
  step("setup", "Login admin + publishable key + región")
  adminToken = (await call("POST", "/auth/user/emailpass", { body: ADMIN })).token
  pk = (await call("GET", "/admin/api-keys?type=publishable&limit=1")).api_keys[0].token
  const regions = (await call("GET", "/admin/regions?fields=id,name,currency_code")).regions
  const region = regions.find((r) => r.currency_code === "usd")
  console.log(`    región=${region.name} (${region.id}), pk=${pk.slice(0, 10)}…`)

  // --- Habilitar mock en la región ---
  step("setup", "Habilitar pp_mock_mock en la región")
  await call("POST", `/admin/regions/${region.id}`, {
    body: { payment_providers: ["pp_system_default", "pp_mock_mock"] },
  })

  // --- Variante a comprar (Store API) + inventory item (Admin) + stock antes ---
  step("setup", "Buscar variante (creatina) y stock inicial")
  const sProducts = (await call("GET", `/store/products?handle=creatina-monohidratada-300g&region_id=${region.id}&fields=id,*variants`, { store: true })).products
  if (!sProducts?.length) throw new Error("No se encontró la creatina en la Store API")
  const variant = sProducts[0].variants[0]

  const aProducts = (await call("GET", `/admin/products?handle=creatina-monohidratada-300g&fields=id,variants.id,variants.inventory_items.inventory_item_id`)).products
  const invItemId = aProducts[0].variants[0].inventory_items?.[0]?.inventory_item_id
  const before = (await call("GET", `/admin/inventory-items/${invItemId}/location-levels`)).inventory_levels[0]
  console.log(`    variante=${variant.id}, inv_item=${invItemId}`)
  console.log(`    antes → stocked=${before.stocked_quantity}, reserved=${before.reserved_quantity}, available=${before.available_quantity}`)

  // --- Flujo de compra (Store API) ---
  step(1, "Crear carrito")
  const cart0 = (await call("POST", "/store/carts", { store: true, body: { region_id: region.id } })).cart

  step(2, "Agregar producto al carrito")
  await call("POST", `/store/carts/${cart0.id}/line-items`, { store: true, body: { variant_id: variant.id, quantity: 1 } })

  step(3, "Email + dirección de envío (Panamá)")
  await call("POST", `/store/carts/${cart0.id}`, {
    store: true,
    body: {
      email: "cliente@test.pa",
      shipping_address: {
        first_name: "Cliente", last_name: "Prueba", address_1: "Calle 50",
        city: "Ciudad de Panamá", country_code: "pa", phone: "60000000",
      },
    },
  })

  step(4, "Elegir método de envío")
  const shippingOptions = (await call("GET", `/store/shipping-options?cart_id=${cart0.id}`, { store: true })).shipping_options
  console.log(`    opciones: ${shippingOptions.map((o) => o.name).join(", ")}`)
  const envio = shippingOptions.find((o) => o.name === "Envío nacional") ?? shippingOptions[0]
  await call("POST", `/store/carts/${cart0.id}/shipping-methods`, { store: true, body: { option_id: envio.id } })

  step(5, "Crear payment collection + sesión con mock")
  const pc = (await call("POST", "/store/payment-collections", { store: true, body: { cart_id: cart0.id } })).payment_collection
  await call("POST", `/store/payment-collections/${pc.id}/payment-sessions`, { store: true, body: { provider_id: "pp_mock_mock" } })

  step(6, "Completar carrito (→ orden)")
  const completed = await call("POST", `/store/carts/${cart0.id}/complete`, { store: true })
  const order = completed.order ?? completed
  console.log(`    tipo respuesta: ${completed.type ?? "order"}`)
  if (!order?.id) throw new Error(`No se creó orden: ${JSON.stringify(completed).slice(0, 400)}`)
  console.log(`    ✔ ORDEN CREADA: ${order.display_id ?? order.id} — total ${order.total} ${order.currency_code}`)

  // --- Verificar inventario (Medusa RESERVA al crear orden; descuenta stocked al cumplir) ---
  step("verify", "Inventario después")
  const after = (await call("GET", `/admin/inventory-items/${invItemId}/location-levels`)).inventory_levels[0]
  console.log(`    después → stocked=${after.stocked_quantity}, reserved=${after.reserved_quantity}, available=${after.available_quantity}`)
  const reservedOk = after.reserved_quantity === before.reserved_quantity + 1
  const availableOk = after.available_quantity === before.available_quantity - 1
  console.log(`    reserva +1: ${reservedOk ? "OK" : "NO"} | disponible -1: ${availableOk ? "OK" : "NO"}`)

  if (!reservedOk || !availableOk) throw new Error("La reserva de inventario no se aplicó como se esperaba")
  console.log("\n✅ SMOKE TEST OK: compra completa con payment-mock crea orden y reserva inventario (anti-sobreventa).")
}

main().catch((e) => {
  console.error("\n❌ FALLÓ:", e.message)
  console.error(e.stack)
  process.exit(1)
})
