# Spec — Cuentas de cliente y autenticación

- **ID módulo:** `CTA`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 03-Carrito (fusión), 04-Checkout, 06-Órdenes (historial), 10-Notificaciones

## 1. Propósito
Permitir que los clientes **creen una cuenta, inicien sesión y gestionen su perfil**, para ver su **historial de pedidos**, reusar direcciones y comprar más rápido — sin obligar a registrarse (la compra como invitado sigue disponible). La cuenta es un valor agregado, no una barrera.

## 2. Actores involucrados
- **Visitante (invitado):** puede registrarse; al comprar se le ofrece crear cuenta con un clic.
- **Cliente registrado:** inicia sesión, gestiona perfil/direcciones, ve su historial de pedidos.
- **Sistema:** autentica, fusiona el carrito de invitado al iniciar sesión, envía correos de verificación/reseteo.
- **Dueño / Administrador:** ve los clientes desde el admin (gestión en módulo 09).

## 3. Historias de usuario
- Como **visitante** quiero registrarme con correo y contraseña de forma simple.
- Como **cliente** quiero iniciar y cerrar sesión de forma segura.
- Como **cliente** quiero **recuperar mi contraseña** si la olvido.
- Como **cliente** quiero ver el **historial y estado de mis pedidos** en mi cuenta.
- Como **cliente** quiero **guardar direcciones** para no reescribirlas en cada compra.
- Como **cliente** quiero editar mis datos de perfil (nombre, teléfono, contraseña).
- Como **invitado que ya compró** quiero **crear mi cuenta con un clic** usando el correo de la compra y ver esa orden en mi historial.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CTA-1 | **Registro** de cliente con email + contraseña. | Debe |
| RF-CTA-2 | **Inicio y cierre de sesión** seguros (token/sesión). | Debe |
| RF-CTA-3 | **Recuperación de contraseña** vía correo (enlace seguro con expiración). | Debe |
| RF-CTA-4 | **Historial de pedidos** del cliente con su estado (coord. módulo 06). | Debe |
| RF-CTA-5 | **Libreta de direcciones**: crear, editar, eliminar y marcar predeterminada. | Debe |
| RF-CTA-6 | **Edición de perfil** (nombre, teléfono, cambio de contraseña). | Debe |
| RF-CTA-7 | **Fusión del carrito** de invitado al iniciar sesión (coord. módulo 03). | Debe |
| RF-CTA-8 | **Crear cuenta post-compra** para el invitado, asociando su orden reciente (coord. módulo 04). | Debería |
| RF-CTA-9 | **Verificación de email** del registro (opcional, definir). | Podría |
| RF-CTA-10 | **Login social (Google)** para registro/login simplificado. | Debe (MVP) |
| RF-CTA-11 | Rutas/área de cuenta **protegidas** (solo el dueño de la cuenta accede a sus datos). | Debe |
| RF-CTA-12 | Cumplimiento de **protección de datos** (Ley 81 Panamá): consentimiento y **baja de cuenta en autoservicio**, bloqueada si hay órdenes activas (envío en camino / sin completar) que comprometan la logística. | Debe |

## 5. Reglas de negocio
- El **email es único** por cuenta de cliente.
- La compra **no requiere cuenta** (invitado permitido, decisión global); la cuenta es opcional.
- Las contraseñas se almacenan **hasheadas** (nunca en texto plano); el reseteo usa enlaces de un solo uso con expiración.
- Al **crear cuenta post-compra**, las órdenes hechas con ese email como invitado se **asocian** a la nueva cuenta.
- Un cliente solo puede ver y modificar **sus propios** datos, direcciones y pedidos.
- La dirección **predeterminada** se precarga en el checkout del cliente registrado.
- **Baja de cuenta (autoservicio):** permitida solo si el cliente **no tiene órdenes activas** (pagadas sin entregar / envío en camino); si las tiene, se bloquea con un mensaje hasta que se completen. Verificación de email del registro: **opcional** (no bloquea la compra).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Customer`, `CustomerAddress`, `AuthIdentity`/proveedor de auth, `Order` (para historial). Medusa v2 trae autenticación de clientes, libreta de direcciones y módulo de Auth con proveedores (emailpass, y opción de social).
**Extensiones propias:** flujo de **reseteo de contraseña** (si no viene completo de fábrica para storefront), **asociación de órdenes de invitado** al crear cuenta, y consentimiento/baja para Ley 81.

## 7. Interfaces / puntos de integración
- **Auth + Customer Module (Medusa):** registro, login, sesión, perfil, direcciones.
- **Store API:** endpoints de cuenta consumidos por el storefront Next.js.
- **Módulo 03 (Carrito):** evento de login → fusión de carrito.
- **Módulo 04 (Checkout):** oferta de cuenta post-compra y precarga de direcciones.
- **Módulo 06 (Órdenes):** historial del cliente.
- **Módulo 10 (Notificaciones):** correos de bienvenida, verificación y reseteo.

## 8. Criterios de aceptación
- [ ] (RF-CTA-1/2) Un visitante se registra, inicia y cierra sesión correctamente.
- [ ] (RF-CTA-3) Un cliente recupera su contraseña con un enlace que expira y es de un solo uso.
- [ ] (RF-CTA-4) El cliente ve su historial de pedidos con estado actualizado.
- [ ] (RF-CTA-5/6) El cliente gestiona direcciones (incl. predeterminada) y edita su perfil.
- [ ] (RF-CTA-7) Al iniciar sesión con un carrito de invitado, este se fusiona sin pérdida.
- [ ] (RF-CTA-8) Un invitado crea cuenta tras comprar y ve esa orden en su historial.
- [ ] (RF-CTA-11) Un cliente no puede acceder a datos/pedidos de otro.

## 9. Fuera de alcance
- Roles/permisos de **staff** del negocio → módulo 09 (admin) y post-MVP.
- Programa de fidelidad / puntos (post-MVP).
- Autenticación de dos factores para clientes (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Verificación de email:** **opcional**, no bloquea la compra (el reseteo de contraseña ya valida el correo).
2. **Login con Google:** **incluido en el MVP** (RF-CTA-10) como proveedor de auth adicional a email/contraseña.
3. **Baja de cuenta (Ley 81):** **autoservicio**, con salvaguarda: bloqueada si hay órdenes activas/envío en camino (RF-CTA-12).

**Pendientes:**
- Configurar credenciales de **Google OAuth** (client ID/secret) — dato de onboarding del proyecto.
