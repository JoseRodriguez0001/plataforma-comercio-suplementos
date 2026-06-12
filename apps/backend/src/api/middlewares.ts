import { defineMiddlewares, authenticate } from "@medusajs/medusa"

// Rutas de cliente que requieren autenticación (sesión o bearer de customer).
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/consents",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/account",
      method: ["DELETE"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/carts/merge",
      method: ["POST"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
  ],
})
