# Plan de implementación — Cuentas de cliente y autenticación

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Borrador

## 1. Enfoque general
Medusa v2 trae un **módulo de Auth** con proveedores (`emailpass` y **proveedor de Google**) y el **Customer Module** con perfil y libreta de direcciones, además de la asociación de órdenes a clientes. La estrategia es **usar la auth nativa** para registro/login/sesión (email/contraseña **+ Google desde el MVP**) y la cuenta del storefront, y construir a medida solo lo que el flujo de tienda necesita encima: **reseteo de contraseña en el storefront**, **asociación de órdenes de invitado** al crear cuenta, **baja de cuenta con salvaguarda**, y los **disparadores de correo**.

## 2. Primitivas de Medusa usadas
- **Auth Module:** proveedores `emailpass` y **Google** (registro/login), identidades de auth.
- **Customer Module:** `Customer`, `CustomerAddress` (perfil y direcciones).
- **Store API:** endpoints de cuenta, sesión y direcciones.
- **Order Module:** historial por cliente (módulo 06).
- **Eventos:** `customer.created`, login → fusión de carrito (módulo 03); reseteo de contraseña → email (módulo 10).

## 3. Extensiones propias
- **Flujo de reseteo de contraseña** en storefront: solicitar → token de un solo uso con expiración → email → cambio.
- **Asociación de órdenes de invitado** al crear cuenta con el mismo email (RF-CTA-8).
- **Páginas de cuenta** en Next.js: registro/login, perfil, direcciones, historial de pedidos (protegidas).
- **Consentimiento y baja en autoservicio** (Ley 81) — registro de consentimiento y baja con **salvaguarda** que la bloquea si hay órdenes activas/envío en camino (RF-CTA-12).
- **Proveedor de auth Google** configurado en el MVP (OAuth).

## 4. Desglose de tareas
- [ ] Configurar Auth `emailpass` + registro/login/logout en storefront (RF-CTA-1,2).
- [ ] Configurar proveedor **Google OAuth** y botón "Continuar con Google" (RF-CTA-10).
- [ ] Reseteo de contraseña con token expirable + email (RF-CTA-3 — coord. módulo 10).
- [ ] Página de historial de pedidos (RF-CTA-4 — coord. módulo 06).
- [ ] Libreta de direcciones CRUD + predeterminada (RF-CTA-5).
- [ ] Edición de perfil y cambio de contraseña (RF-CTA-6).
- [ ] Fusión de carrito al login (RF-CTA-7 — coord. módulo 03).
- [ ] Crear cuenta post-compra + asociación de orden (RF-CTA-8 — coord. módulo 04).
- [ ] Protección de rutas de cuenta (RF-CTA-11).
- [ ] Consentimiento + baja en autoservicio con salvaguarda de órdenes activas (RF-CTA-12).
- [ ] Verificación de email opcional (RF-CTA-9).

## 5. Orden de trabajo y dependencias
Secuencia: auth básica (registro/login) → páginas de cuenta protegidas → direcciones/perfil → reseteo de contraseña → historial (con 06) → fusión de carrito (con 03) → cuenta post-compra (con 04).
Habilita: precarga de datos en checkout (módulo 04) e historial (módulo 06).

## 6. Estrategia de pruebas
- **Integración:** registro→login→logout; reseteo de contraseña con token expirado/usado; asociación de orden de invitado.
- **Seguridad:** un cliente no accede a datos/pedidos de otro (RF-CTA-11); contraseñas hasheadas; tokens de un solo uso.
- **E2E:** flujo completo de cuenta y fusión de carrito al iniciar sesión.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Acceso a datos de otro cliente | Brecha de privacidad | Autorización por dueño de recurso; pruebas explícitas; sesiones seguras. |
| Tokens de reseteo inseguros | Toma de cuenta | Tokens aleatorios de un solo uso, con expiración corta; invalidar al usar. |
| Fricción por verificación de email | Menos registros | Diferir verificación; no bloquear la compra por ella. |
| Cumplimiento Ley 81 | Riesgo legal | Consentimiento explícito + proceso de baja documentado. |

## 8. Definición de "hecho"
- [ ] RF-CTA "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Registro/login/logout y reseteo de contraseña funcionando.
- [ ] Historial de pedidos, direcciones y perfil operativos.
- [ ] Fusión de carrito al login verificada.
- [ ] Cuenta post-compra asocia la orden del invitado.
- [ ] Aislamiento de datos entre clientes verificado.
