# Spec — Panel de administración

- **ID módulo:** `ADM`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 01-Catálogo, 05-Pagos, 06-Órdenes, 07-Inventario, 08-Cuentas

## 1. Propósito
Darle al **dueño** un panel donde gestione **todo el negocio sin tocar código**: productos, inventario, precios, órdenes, clientes y configuración básica de la tienda. Es la pieza que cumple el criterio #1 del proyecto (autonomía del dueño / no dependencia del desarrollador).

## 2. Actores involucrados
- **Dueño / Administrador:** acceso completo a la gestión del negocio.
- **Operador / Staff:** *(post-MVP)* acceso limitado (ej. solo órdenes/inventario).
- **Sistema:** registra quién hizo qué (auditoría básica) y aplica permisos.

## 3. Historias de usuario
- Como **dueño** quiero **gestionar productos** (crear, editar, imágenes, variantes, atributos de suplemento, activar/destacar) desde una interfaz visual.
- Como **dueño** quiero **administrar inventario** (stock, ajustes con motivo) y ver alertas de stock bajo/vencimiento.
- Como **dueño** quiero **ver y operar las órdenes** (estados, envío/retiro, cancelar, reembolsar).
- Como **dueño** quiero **ver mis clientes** y sus pedidos.
- Como **dueño** quiero **configurar** zonas/tarifas de envío, datos del local, impuestos y métodos de pago.
- Como **dueño** quiero gestionar **cupones/descuentos**.
- Como **dueño** quiero un **panel inicial** con métricas básicas (ventas, órdenes pendientes, stock bajo).
- Como **dueño** quiero acceder de forma **segura** y, a futuro, dar acceso limitado a un empleado.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-ADM-1 | **Acceso seguro** al admin (login de administrador, separado del de clientes). | Debe |
| RF-ADM-2 | **Gestión de catálogo**: productos, variantes, categorías, colecciones, imágenes y **atributos de suplemento**. | Debe |
| RF-ADM-3 | **Gestión de inventario**: editar stock, ajustes con motivo; ver alertas (stock bajo / vencimiento). | Debe |
| RF-ADM-4 | **Gestión de órdenes**: ver, filtrar, avanzar estados (envío/retiro), cancelar, reembolsar, registrar datos de cumplimiento. | Debe |
| RF-ADM-5 | **Gestión de clientes**: ver clientes y su historial de pedidos. | Debe |
| RF-ADM-6 | **Gestión de promociones/cupones**. | Debe |
| RF-ADM-7 | **Configuración de envío**: zonas/tarifas por provincia + retiro en local (datos/horario). | Debe |
| RF-ADM-8 | **Configuración de pagos**: activar proveedores y modo (sandbox/producción). | Debe |
| RF-ADM-9 | **Configuración de impuestos** (ITBMS) y de la región/moneda. | Debe |
| RF-ADM-10 | **Dashboard** con métricas básicas: ventas del período, órdenes por estado, alertas de stock. | Debería |
| RF-ADM-11 | **Roles/permisos** (dueño total; staff limitado). | Post-MVP |
| RF-ADM-12 | **Auditoría básica**: registro de acciones administrativas sensibles. | Debería |
| RF-ADM-13 | Admin **usable y responsive** (operable también desde tablet/móvil). | Debería |
| RF-ADM-14 | **Español** como idioma del panel. | Debe |

## 5. Reglas de negocio
- El admin está **separado** del storefront y de las cuentas de cliente (otro espacio de auth).
- Las acciones sensibles (reembolsos, cancelaciones, cambios de precio) quedan **registradas** (quién/cuándo).
- La configuración del negocio (envío, pagos, impuestos) se edita desde el panel **sin desplegar código**.
- En MVP hay **un rol** (dueño/admin total); el modelo no debe impedir roles adicionales luego.
- Cambios de catálogo/precio se reflejan en el storefront y el índice de búsqueda (coord. módulos 01/02).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** **Admin Dashboard** completo (React) sobre las Admin APIs de todos los módulos (producto, inventario, orden, cliente, promoción, envío, pago, impuestos, usuarios admin). Medusa v2 ya entrega este panel.
**Extensiones propias:** **widgets/UI routes** para lo custom (atributos de suplemento, campos de cumplimiento manual, umbral de stock/vencimiento, configuración de zonas Panamá), y **dashboard de métricas básicas** si no alcanza con lo nativo.

## 7. Interfaces / puntos de integración
- **Admin API + Dashboard (Medusa):** base de todo el panel.
- **Extensiones de Admin UI:** widgets y rutas para campos/flujos custom de los demás módulos.
- **Módulos 01/03/05/06/07/08:** el admin es la cara de gestión de todos ellos.
- **Módulo 10:** las alertas (stock bajo/vencimiento) se ven aquí y/o llegan por email.

## 8. Criterios de aceptación
- [ ] (RF-ADM-1) El dueño entra al admin con credenciales propias, separado del login de clientes.
- [ ] (RF-ADM-2) El dueño crea/edita un producto completo (variantes, imágenes, atributos) sin ayuda técnica.
- [ ] (RF-ADM-3) El dueño ajusta stock con motivo y ve alertas.
- [ ] (RF-ADM-4) El dueño opera una orden de principio a fin (estado, cumplimiento, reembolso).
- [ ] (RF-ADM-6/7/8/9) El dueño crea un cupón y configura envío, pagos e impuestos desde el panel.
- [ ] (RF-ADM-10) El dashboard muestra ventas del período, órdenes pendientes y alertas de stock.
- [ ] (RF-ADM-14) Todo el panel está en español.

## 9. Fuera de alcance
- **Roles y permisos** granulares de staff → post-MVP (RF-ADM-11).
- Reportes/analítica avanzada → módulo 16 (post-MVP); MVP solo métricas básicas.
- Personalización profunda del look del admin (se usa el nativo de Medusa).
- App móvil nativa de administración (se cubre con admin responsive).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Usuarios admin:** **solo el dueño** en el lanzamiento (un rol total). Roles de staff → post-MVP.
2. **Idioma:** panel **en español por defecto**; las etiquetas/widgets custom se hacen en español. (Riesgo: verificar cobertura del i18n nativo de Medusa en todas las pantallas.)

**Pendientes:**
- Confirmar al evaluar el admin nativo si el **dashboard de métricas** del MVP requiere una vista custom o basta lo nativo.
