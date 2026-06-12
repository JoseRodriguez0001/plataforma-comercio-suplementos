import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { addToCartWorkflow, transferCartCustomerWorkflow } from "@medusajs/medusa/core-flows"

// POST /store/carts/merge { source_cart_id, target_cart_id? }
// Al iniciar sesión: transfiere el carrito de invitado al cliente y, si el
// cliente ya tenía un carrito (target), fusiona las líneas sin perder nada.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "No autenticado" })
    return
  }

  const { source_cart_id, target_cart_id } = (req.body as any) ?? {}
  if (!source_cart_id) {
    res.status(400).json({ message: "source_cart_id es obligatorio" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [source],
  } = await query.graph({
    entity: "cart",
    fields: ["id", "completed_at", "items.variant_id", "items.quantity"],
    filters: { id: source_cart_id },
  })
  if (!source) {
    res.status(404).json({ message: "Carrito de origen no encontrado" })
    return
  }

  const fetchCart = async (id: string) => {
    const {
      data: [cart],
    } = await query.graph({
      entity: "cart",
      fields: ["id", "customer_id", "email", "items.variant_id", "items.quantity", "items.title"],
      filters: { id },
    })
    return cart
  }

  // Caso transferencia: el cliente no tenía carrito → su carrito pasa a ser el de invitado.
  if (!target_cart_id || target_cart_id === source_cart_id) {
    await transferCartCustomerWorkflow(req.scope).run({
      input: { id: source_cart_id, customer_id: customerId },
    })
    res.json({ cart: await fetchCart(source_cart_id), merged: false })
    return
  }

  // Caso fusión: agregar las líneas del invitado al carrito del cliente.
  const items = (source.items ?? [])
    .filter((i: any) => i.variant_id)
    .map((i: any) => ({ variant_id: i.variant_id, quantity: i.quantity }))

  if (items.length) {
    await addToCartWorkflow(req.scope).run({
      input: { cart_id: target_cart_id, items },
    })
  }
  await transferCartCustomerWorkflow(req.scope).run({
    input: { id: target_cart_id, customer_id: customerId },
  })

  // Eliminar el carrito de invitado ya fusionado.
  const cartModule: any = req.scope.resolve(Modules.CART)
  await cartModule.deleteCarts([source_cart_id])

  res.json({ cart: await fetchCart(target_cart_id), merged: true })
}
