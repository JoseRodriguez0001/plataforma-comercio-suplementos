# Spec — Notificaciones y email transaccional

- **ID módulo:** `NOT`
- **Estado:** En revisión
- **MVP:** Sí
- **Depende de:** 06-Órdenes, 07-Inventario, 08-Cuentas

## 1. Propósito
Mantener informados a **clientes** y **dueño** mediante correos transaccionales confiables: confirmación de compra, cambios de estado del pedido, recuperación de contraseña y alertas operativas (stock bajo/vencimiento). Buenas notificaciones generan confianza en el cliente y permiten al dueño reaccionar a tiempo.

## 2. Actores involucrados
- **Cliente (invitado o registrado):** recibe confirmaciones y avisos de su pedido y de su cuenta.
- **Dueño / Administrador:** recibe avisos de **nuevas órdenes** y alertas de **stock bajo/vencimiento**.
- **Sistema (worker):** dispara los correos de forma asíncrona ante eventos.
- **Proveedor de email (externo):** Resend o Amazon SES; entrega los correos.

## 3. Historias de usuario
- Como **cliente** quiero un correo de **confirmación** con el detalle y número de mi orden.
- Como **cliente** quiero que me avisen cuando mi pedido es **enviado / está listo para retiro** o se **cancela/reembolsa**.
- Como **cliente** quiero recibir el correo de **recuperación de contraseña** y de **bienvenida** al registrarme.
- Como **dueño** quiero recibir un aviso cuando entra una **nueva orden** para prepararla.
- Como **dueño** quiero recibir **alertas de stock bajo y de productos por vencer**.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-NOT-1 | **Confirmación de orden** al cliente (detalle, número, método de entrega, total). | Debe |
| RF-NOT-2 | Avisos de **cambio de estado** del pedido: enviado / listo para retiro / entregado / cancelado-reembolsado. | Debe |
| RF-NOT-3 | Correo de **recuperación de contraseña** (enlace seguro) (coord. módulo 08). | Debe |
| RF-NOT-4 | Correo de **bienvenida** al crear cuenta. | Debería |
| RF-NOT-5 | Aviso al **dueño** de **nueva orden**. | Debe |
| RF-NOT-6 | **Alertas al dueño** de stock bajo y de vencimiento próximo (coord. módulo 07). | Debe |
| RF-NOT-7 | Envío **asíncrono** vía worker; un fallo de email no rompe el flujo de compra. | Debe |
| RF-NOT-8 | **Reintentos** ante fallo temporal del proveedor de email. | Debería |
| RF-NOT-9 | **Plantillas** de correo en español, con branding (logo/colores) y responsive. | Debe |
| RF-NOT-10 | **Abstracción del proveedor** de email (cambiar Resend↔SES sin tocar la lógica). | Debe |
| RF-NOT-11 | **Registro/log** de correos enviados y su resultado (entregado/fallido) para diagnóstico. | Debería |
| RF-NOT-12 | Datos remitente verificados (**dominio propio**, SPF/DKIM) para no caer en spam. | Debe |

## 5. Reglas de negocio
- Las notificaciones se disparan por **eventos** del sistema (orden creada, fulfillment actualizado, etc.), no de forma manual.
- El envío es **asíncrono**: la compra/acción nunca se bloquea ni falla por un problema de email (RF-NOT-7).
- Los correos transaccionales **no son marketing** (el marketing/newsletter es post-MVP y requiere consentimiento — Ley 81).
- Los enlaces sensibles (reseteo) **expiran** y son de un solo uso (regla compartida con módulo 08).
- El remitente usa el **dominio propio** verificado del negocio.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** **Notification Module** con proveedores (incluye Resend) y plantillas; se integra con los **eventos** de los demás módulos.
**Extensiones propias:** **plantillas** de cada correo (español + branding), **subscribers** que mapean eventos → notificación, y **log** de envíos si se requiere más detalle que el nativo.

## 7. Interfaces / puntos de integración
- **Notification Module (Medusa)** + proveedor (Resend o SES).
- **Eventos** de módulos 06 (orden/fulfillment), 07 (stock/vencimiento), 08 (cuenta/reseteo) → subscribers.
- **Worker:** procesa el envío en background con reintentos.
- **DNS (Cloudflare):** verificación de dominio, SPF/DKIM.

## 8. Criterios de aceptación
- [ ] (RF-NOT-1) Al pagar, el cliente recibe la confirmación con los datos correctos.
- [ ] (RF-NOT-2) Cada cambio de estado relevante dispara el correo correspondiente.
- [ ] (RF-NOT-3/4) Reseteo de contraseña y bienvenida funcionan.
- [ ] (RF-NOT-5/6) El dueño recibe aviso de nueva orden y alertas de stock bajo/vencimiento.
- [ ] (RF-NOT-7) Un fallo del proveedor de email no impide completar la compra.
- [ ] (RF-NOT-9/12) Los correos llegan en español, con branding, desde el dominio propio y sin caer en spam.
- [ ] (RF-NOT-10) Cambiar de proveedor de email no requiere tocar la lógica de negocio.

## 9. Fuera de alcance
- **Notificaciones por WhatsApp:** **post-MVP priorizado** (deseado por el negocio; muy usado en Panamá). La abstracción del Notification Module permite sumarlo como proveedor de canal sin rehacer la lógica de eventos.
- Notificaciones por SMS (post-MVP, menor prioridad que WhatsApp).
- **Email marketing / newsletter** y automatizaciones (post-MVP, requiere consentimiento).
- Notificaciones push web/app (post-MVP).
- Centro de preferencias de notificaciones del cliente (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Proveedor de email MVP:** **Resend** (simplicidad); la abstracción permite migrar a SES a futuro.
2. **Destinatario de avisos del dueño:** un **único correo del dueño** (la dirección concreta se configura luego).
3. **WhatsApp:** **sí interesa** → integración **post-MVP priorizada** (ver §9).

**Pendientes:**
- Definir el **correo del dueño** para avisos de nueva orden y alertas.
