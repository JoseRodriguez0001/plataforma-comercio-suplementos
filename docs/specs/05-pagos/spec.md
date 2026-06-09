# Spec — Pagos (abstracción + Yappy + PagueloFacil)

- **ID módulo:** `PAY`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 04-Checkout, 06-Órdenes, 07-Inventario

## 1. Propósito
Cobrar de forma segura y confiable en Panamá ofreciendo **Yappy** (pago móvil, el preferido local) y **PagueloFacil** (tarjetas de crédito/débito y Sistema Clave), **detrás de una capa de abstracción** que permita agregar **Stripe u otros** para la expansión internacional sin reescribir el checkout. La meta operativa: que cuando el dueño tenga aprobadas sus cuentas de comercio, solo haya que **cargar credenciales y activar**, no programar el flujo.

## 2. Actores involucrados
- **Cliente (invitado o registrado):** autoriza y completa el pago.
- **Sistema (worker):** crea la sesión de pago, procesa confirmaciones (webhooks/redirect), concilia estados y dispara la creación de orden.
- **Pasarela de pago (externa):** Yappy (Banco General) y PagueloFacil; procesan el cobro y notifican el resultado.
- **Dueño / Administrador:** configura credenciales, ve el estado de pago de cada orden y solicita reembolsos.

## 3. Historias de usuario
- Como **cliente** quiero pagar con **Yappy** desde mi teléfono sin teclear datos de tarjeta.
- Como **cliente** quiero pagar con **tarjeta** de forma segura (PagueloFacil) y recibir confirmación.
- Como **cliente** quiero que si el pago falla o lo cancelo, **no se me cobre** y pueda reintentar.
- Como **dueño** quiero ver claramente si una orden está **pagada, pendiente o fallida**.
- Como **dueño** quiero poder **reembolsar** una orden (total o parcial) cuando corresponda.
- Como **dueño** quiero **activar Yappy y PagueloFacil con mis credenciales** sin depender del desarrollador.
- Como **negocio** quiero poder **sumar Stripe** en el futuro sin rehacer el checkout.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-PAY-1 | Definir una **interfaz de proveedor de pago** común; cada pasarela es un módulo que la implementa. | Debe |
| RF-PAY-2 | Proveedor **Yappy** (Botón de Pago): iniciar pago, recibir confirmación, mapear estado. | Debe |
| RF-PAY-3 | Proveedor **PagueloFacil**: pago con tarjeta/Sistema Clave, recibir confirmación, mapear estado. | Debe |
| RF-PAY-4 | El checkout ofrece los **métodos activos** sin conocer detalles de cada pasarela. | Debe |
| RF-PAY-5 | Manejar resultados: **éxito, fallo, cancelación, pendiente/timeout**, con mensajes claros. | Debe |
| RF-PAY-6 | Recibir y verificar **webhooks/callbacks** de cada pasarela de forma segura (firma/validación). | Debe |
| RF-PAY-7 | **Idempotencia**: no duplicar cobros ni órdenes ante reintentos o webhooks repetidos. | Debe |
| RF-PAY-8 | **Conciliación**: el estado de pago en el sistema refleja el real de la pasarela (incl. confirmaciones tardías). | Debe |
| RF-PAY-9 | Crear la orden **solo** cuando el pago está confirmado (coord. módulo 04/06). | Debe |
| RF-PAY-10 | **Reembolsos** (total/parcial) desde el admin cuando la pasarela lo soporte; si no, registrar reembolso manual. | Debería |
| RF-PAY-11 | **Cero almacenamiento de datos de tarjeta**; usar páginas/flujos hospedados o tokenización de la pasarela. | Debe |
| RF-PAY-12 | **Configuración por entorno** (sandbox/producción) y credenciales fuera del repositorio. | Debe |
| RF-PAY-13 | **Proveedor de prueba** (mock/sandbox) para desarrollar el checkout sin credenciales reales. | Debe |
| RF-PAY-14 | Registrar **trazabilidad** de cada intento de pago (auditoría/diagnóstico). | Debería |
| RF-PAY-15 | Tokenización para **cobros recurrentes** preparada (PagueloFacil lo soporta) — diseñar, no activar en MVP. | Podría |

## 5. Reglas de negocio
- Un pago confirmado es **condición necesaria** para crear la orden (módulo 04 RF-CHK-9).
- Si la confirmación llega **después** del timeout de UI, la conciliación debe igualmente reflejar el pago y la orden (o reembolsar si ya expiró la reserva y no hay stock — definir política).
- La reserva de stock (15 min) y el pago están acoplados: si el pago no se confirma en ese plazo, se libera stock y el intento se marca fallido. **La solicitud de pago se configura para expirar junto con la reserva** (15 min), de modo que la pasarela rechace pagos fuera de tiempo y minimice las confirmaciones tardías.
- **Confirmación tardía:** si llega una confirmación de pago después de vencida la reserva y **ya no hay stock**, se ejecuta **reembolso automático** y se notifica al cliente. Si aún hay stock, se honra la orden. (No se puede garantizar al 100% el rechazo en la pasarela porque el cobro ocurre de su lado; por eso el reembolso automático es la red de seguridad.)
- **Método sugerido por defecto: Yappy** (menor comisión para el dueño, confirmación inmediata y máxima confianza local); tarjeta (PagueloFacil) como alternativa.
- Reembolso solo sobre pagos efectivamente capturados.
- Los montos se manejan en la **moneda de la región** (USD en MVP) y deben cuadrar exactamente con el total del checkout.
- Las credenciales y secretos **nunca** se versionan; viven en variables de entorno de la plataforma.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `PaymentCollection`, `PaymentSession`, `Payment`, `Refund`, `PaymentProvider`. Medusa modela el ciclo de pago y permite registrar proveedores personalizados.
**Extensiones propias:** dos **módulos de proveedor** (`payment-yappy`, `payment-paguelofacil`) que implementan la interfaz de proveedor de Medusa; registro de intentos/eventos de pago para auditoría (RF-PAY-14); configuración de credenciales por entorno.

## 7. Interfaces / puntos de integración
- **Payment Module de Medusa:** se registran los proveedores; el checkout crea `PaymentSession` con el proveedor elegido.
- **Yappy Botón de Pago (Banco General):** API oficial (soporta Node.js); flujo de notificación al teléfono + confirmación vía callback/webhook. Requiere credenciales de comercio.
- **PagueloFacil:** API/SDK REST; flujo hospedado/redirect con retorno + webhook; tokenización disponible.
- **Webhooks entrantes:** endpoints dedicados por proveedor con verificación de firma/origen.
- **Módulo 04/06:** al confirmarse el pago, dispara `completeCart` → creación de orden.
- **Módulo 07:** libera/confirma reserva según resultado del pago.
- **Módulo 10:** dispara email de confirmación/fallo.

## 8. Criterios de aceptación
- [ ] (RF-PAY-1/4) El checkout lista los métodos activos consultando la abstracción, sin lógica específica de pasarela en el front.
- [ ] (RF-PAY-2) Un pago Yappy de prueba completo (inicio → confirmación) marca el pago como pagado y crea la orden.
- [ ] (RF-PAY-3) Un pago con tarjeta vía PagueloFacil (sandbox) se confirma y crea la orden.
- [ ] (RF-PAY-5) Pagos fallidos/cancelados no crean orden, liberan stock y permiten reintento con mensaje claro.
- [ ] (RF-PAY-6/7) Un webhook repetido o reintento no genera doble cobro ni doble orden.
- [ ] (RF-PAY-8) Una confirmación tardía concilia el estado correctamente.
- [ ] (RF-PAY-9) Nunca existe una orden "pagada" sin pago confirmado en la pasarela.
- [ ] (RF-PAY-11/12) No se almacena dato de tarjeta; credenciales solo en entorno.
- [ ] (RF-PAY-13) El checkout se puede desarrollar/probar end-to-end con el proveedor de prueba.
- [ ] (RF-PAY-10) El dueño puede reembolsar (o registrar reembolso) desde el admin.

## 9. Fuera de alcance
- Activación productiva real de Yappy/PagueloFacil: depende de la **aprobación de cuentas de comercio del dueño** (trámite externo en curso). En MVP se entrega el flujo completo + sandbox; el "go-live" es cargar credenciales y activar.
- Stripe y otras pasarelas internacionales: **diseñadas en la abstracción**, implementación post-MVP.
- Suscripciones/cobros recurrentes en producción (solo se deja el diseño, RF-PAY-15).
- **Pago contra entrega y transferencia/ACH manual: post-MVP** (decisión 2026-06-08). Motivo: Yappy ya cubre la confianza del cliente sin tarjeta; contra-entrega añade manejo de efectivo y no-shows, y la transferencia manual añade conciliación diaria al dueño. Se diseñan como extensibles para sumarlos si aparece demanda.

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
- **Métodos en MVP:** solo Yappy + PagueloFacil. Contra-entrega/transferencia → post-MVP.
- **Método por defecto:** Yappy (menor comisión, confirmación inmediata, mayor confianza).
- **Confirmación tardía sin stock:** reembolso automático + aviso al cliente. La solicitud de pago expira junto con la reserva (15 min) para minimizar el caso.

**Pendientes (input del negocio, no bloquean el desarrollo):**
1. **Estado del trámite** de cuentas Yappy y PagueloFacil del dueño → define la fecha real de go-live a producción.
2. **Comisiones exactas** de cada pasarela → confirmar con Banco General y PagueloFacil al abrir las cuentas (dato de onboarding; no se inventan cifras).
