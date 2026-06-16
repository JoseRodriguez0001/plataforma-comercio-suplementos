# Guía del Panel de Administración — NATURZEN

Esta guía explica cómo usar el panel de administración de la
tienda. Está pensada para la persona que va a manejar el negocio día a día

> El panel está en **inglés**. En esta guía te digo
> qué significa cada cosa en español. La sección **Métricas** sí está en español.

---

## 1. Cómo entrar al panel

1. Abre en el navegador: **https://backend-production-f80d.up.railway.app/app**
2. Ingresa tu **correo** y **contraseña**.
3. Te recomendamos **cambiar la contraseña** la primera vez (abajo a la izquierda, en tu usuario → Settings).

**Consejos de seguridad**
- No compartas tu usuario y contraseña.
- Cierra sesión si usas una computadora ajena.
- Cada persona del equipo debería tener su **propio usuario** (se crean en *Settings → Users*).

---

## 2. Vista general del menú (barra izquierda)

| Sección | Para qué sirve |
|---|---|
| **Orders** (Pedidos) | Ver y procesar las compras de los clientes. **Lo que más usarás.** |
| **Products** (Productos) | Crear y editar los productos que vendes. |
| → Collections | Agrupaciones de productos (ej. "Destacados"). |
| → Categories | Categorías (ej. "Proteínas", "Vitaminas"). |
| **Inventory** (Inventario) | Cuántas unidades tienes de cada producto. |
| **Customers** (Clientes) | Lista de clientes registrados. |
| **Promotions** (Promociones) | Códigos de descuento y ofertas. |
| **Price Lists** (Listas de precios) | Precios especiales (mayoristas, temporadas). |
| **Métricas** (en Extensions) | Resumen de ventas, órdenes y más vendidos. |
| **Settings** (Configuración) | Ajustes de la tienda. **Tocar con cuidado.** |

---

## 3. Pedidos (Orders) — el día a día

Aquí llegan todas las compras. Cada pedido tiene dos estados importantes:

- **Payment** (Pago): `Authorized` (autorizado/por capturar), `Captured` (cobrado), `Canceled` (cancelado).
- **Fulfillment** (Entrega): `Not fulfilled` (sin preparar), `Fulfilled` (preparado/enviado).

### Cómo procesar un pedido (paso a paso)
1. Entra a **Orders** y haz clic en el pedido.
2. Revisa los **productos**, la **dirección** y el **método de entrega** (Envío nacional o Retiro en local).
3. **Cobrar el pago:** en la sección *Payment*, si dice `Authorized`, usa **Capture payment** para cobrarlo.
4. **Preparar (Create Fulfillment):** en los items, usa **Fulfill items**. Se abre una pantalla:
   - **Location:** desde dónde despachas → elige **Almacén NATURZEN**.
   - **Shipping method:** método de entrega (Envío nacional / Retiro en local).
   - **Items to fulfill:** confirma productos y cantidades. El stock baja al confirmar.
   - **Send notification:** déjalo **activado** para avisar al cliente.
   - Botón **Create Fulfillment** → marca los productos como preparados.
5. **Marcar como enviado (Mark fulfillment shipped):** después de preparar, aparece esta opción (pantalla en inglés):
   - **Tracking number:** número de guía/rastreo del transportista.
   - **Tracking URL:** enlace para rastrear (opcional).
   - **Label URL:** enlace a la etiqueta (opcional; normalmente se deja vacío).
   - **Add tracking number** para guardarlo.
   - **Send notification:** avisa al cliente del envío.

### Panel "Cumplimiento (envío / retiro)" — propio de NATURZEN
Más abajo en el pedido verás un recuadro **"Cumplimiento (envío / retiro)"**. Aquí registras los datos de entrega en español y, lo más importante, **al guardar la "Fecha de envío" por primera vez se le manda automáticamente el correo al cliente** ("tu pedido fue enviado"). Cómo llenarlo:

**Si es Envío a domicilio:**
- **Método:** elige *Envío a domicilio*.
- **Transportista:** elige de la lista (Uno Express, Mensajería propia, Servientrega, Correos de Panamá). Es opcional.
- **N.º de guía:** el número de rastreo que te dio el transportista.
- **Fecha de envío:** el día que lo despachaste. ⚠️ **Al poner esta fecha y dar Guardar, el cliente recibe el correo de "enviado".** Ponla solo cuando realmente lo despaches.
- **Entrega estimada:** fecha aproximada de llegada (opcional).
- **Nota de entrega:** notas internas o para coordinar (ej. "coordinar por WhatsApp").
- **Guardar.**

**Si es Retiro en local:**
- **Método:** elige *Retiro en local*.
- **Listo para retiro:** fecha en que está listo. ⚠️ **Al guardarla, el cliente recibe el correo de "listo para retiro".**
- **Retirado el:** fecha en que el cliente lo recogió.
- **Guardar.**

> 💡 **Recomendación para no enviar correos duplicados:** usa **este panel "Cumplimiento"** como el paso que avisa al cliente (con guía y transportista). Si además usas el "Mark fulfillment shipped" nativo, **desactiva ahí el "Send notification"** para no mandar dos correos.

### Resumen: qué toca el stock y qué avisa al cliente
| Acción | ¿Baja stock? | ¿Avisa al cliente? | ¿Obligatoria? |
|---|---|---|---|
| Cliente compra (paga) | Reserva (Disponible −1, automático) | — | — |
| Capture payment | No | No | Sí (cobrar) |
| **Create Fulfillment** (preparar) | **Sí (stock físico −1)** | No | **Sí** |
| **Panel Cumplimiento** (Guardar) | No | **Sí (correo)** | Sí (para notificar) |
| Mark as shipped | No | Opcional (apágalo) | No |
| Mark as delivered | No | Opcional | No |

> El **stock se maneja solo**: se reserva al comprar y baja de verdad al hacer **Create Fulfillment**. Las etiquetas "shipped"/"delivered" no tocan el stock; son solo estado.

### Devoluciones, cambios y reclamos (cuando algo sale mal)
En el menú **⋮** del pedido tienes acciones para resolver problemas. Las usarás
**de vez en cuando** (el día a día es Pedidos + Cumplimiento):

- **Edit order** (Editar pedido): modifica un pedido — agregar/quitar productos o cambiar cantidades. Genera una diferencia de pago (a cobrar o a devolver). Útil si el cliente pidió cambiar algo o hubo un error al armarlo.
- **Create Return** (Devolución): el cliente **devuelve** un producto y le **reembolsas**. Al recibir la devolución puedes **reponer el stock**.
- **Create Exchange** (Cambio): el cliente devuelve un producto y recibe **otro distinto** (devolución + nuevo envío en un solo paso).
- **Create Claim** (Reclamo): para productos **dañados, equivocados o faltantes**. Puedes **reembolsar o reenviar** sin que el cliente devuelva nada.

**Motivos del ajuste** (al hacer un reembolso/ajuste, el sistema te pide clasificar el porqué, para tu control interno):
- **Shipping Issue** (Problema de envío): se dañó, se perdió o llegó tarde.
- **Pricing Error** (Error de precio): se cobró un precio incorrecto y lo corriges.
- **Customer Care Adjustment** (Cortesía): compensación que decides dar para mantener contento al cliente.

> ⚠️ **Reembolso real:** la devolución/reclamo **registra** el reembolso en el sistema, pero el **dinero se devuelve de verdad cuando Yappy/PagueloFácil estén activos** (con el pago de prueba solo queda el registro).

### Cancelar o reembolsar
- En el menú **⋮** del pedido encontrarás opciones para **cancelar** o **reembolsar**.
- Una orden **cancelada** no cuenta como venta en las Métricas.

> Nota actual: la tienda está con un **método de pago de prueba** mientras se activan
> Yappy y PagueloFácil. Cuando estén listos, los pagos serán reales.

---

## 4. Productos (Products)

### Crear un producto nuevo
1. **Products → Create** (arriba a la derecha).
2. Completa:
   - **Title** (nombre): ej. "Creatina Monohidratada 300 g".
   - **Description** (descripción): texto que ve el cliente.
   - **Handle**: se genera solo (es la dirección web del producto).
3. **Variants / Pricing** (variantes y precio): define el precio en **USD**. Si el producto tiene presentaciones (sabores, tamaños), se agregan como variantes.
4. **Inventory** (inventario): activa "manage inventory" y pon las **unidades disponibles** (para evitar vender sin stock).
5. **Sales Channels:** asegúrate de que esté en **Default Sales Channel** (si no, no aparece en la tienda).
6. **Status:** ponlo en **Published** (publicado) para que se vea en la tienda. `Draft` = borrador (no visible).
7. Guarda.

### Fotos del producto (Media)
1. En el producto, sección **Media** → **Upload images**.
2. Sube las fotos y marca una como **thumbnail** (la que sale en las tarjetas).
3. **Recomendado:** imágenes **cuadradas** (~1000×1000 px), fondo claro y limpio.
4. Guarda. Las fotos se guardan en la nube (Cloudflare R2) y aparecen en la tienda.

> Si cambias una foto y en la tienda sigue saliendo la vieja, es por caché; se actualiza
> solo en un rato, o avisa al equipo técnico para refrescarla.

### Información del suplemento (campos especiales)
Este es un apartado propio de NATURZEN. En la ficha del producto puedes registrar:
- **Marca**, **Ingredientes**, **Modo de uso**, **Advertencias**.
- **Tamaño de porción**, **Porciones por envase**, **Registro sanitario**.
- Etiquetas: **Vegano**, **Sin azúcar**, **Sin gluten**, **Apto vegetariano**.

Esto se muestra al cliente en la página del producto. Mantenlo actualizado y veraz.

### Colecciones y Categorías
- **Collections:** agrupaciones para destacar (ej. "Destacados" se muestra en el inicio).
- **Categories:** clasificación (ej. "Proteínas", "Vitaminas", "Creatina").
- Asignar un producto a una categoría/colección ayuda a que el cliente lo encuentre.

---

## 5. Inventario (Inventory)

- Muestra cuántas **unidades** hay de cada producto y en qué ubicación.
- Para **actualizar existencias**: entra al item y edita la cantidad disponible.
- Cuando entra mercancía nueva, **sube el stock** aquí (o desde el producto).
- La tienda **no deja vender** más de lo que hay en stock (evita sobreventa).
- En **Métricas** verás un indicador de **Stock bajo** para reponer a tiempo.

---

## 6. Clientes (Customers)

- Lista de clientes registrados con su correo, pedidos y direcciones.
- Útil para dar soporte: buscas al cliente y ves su historial de compras.
- No es necesario crear clientes a mano; se registran solos al comprar o crear cuenta.

---

## 7. Promociones (Promotions) — descuentos

Para crear un **código de descuento** o una **oferta**:
1. **Promotions → Create**.
2. Elige el tipo: **porcentaje** (ej. 10% off) o **monto fijo** (ej. $5 off).
3. Define el **código** (ej. `BIENVENIDO10`) o si es **automático**.
4. Opcional: condiciones (monto mínimo, productos específicos, fecha de vigencia).
5. Guarda y comparte el código con tus clientes.

---

## 8. Listas de precios (Price Lists) — opcional

- Sirve para **precios especiales**: mayoristas, promociones por temporada, etc.
- Creas una lista, eliges productos y defines precios distintos (con o sin fecha).
- Si no la necesitas, puedes ignorarla.

---

## 9. Métricas (Extensions → Métricas)

Panel en español con el resumen del negocio. Puedes elegir **7, 30 o 90 días**:
- **Ventas:** total facturado en el período (no incluye canceladas).
- **Órdenes:** cantidad de pedidos válidos (no incluye canceladas).
- **Ticket promedio:** venta promedio por pedido.
- **Stock bajo:** productos por reponer.
- **Productos más vendidos:** ranking por unidades.

> Por eso a veces el número de **Órdenes** en Métricas es menor que en la lista de
> **Orders**: las **canceladas** no cuentan como venta.

---

## 10. Configuración (Settings) — con cuidado

Aquí están los ajustes de la tienda. **Algunos NO conviene tocarlos** sin el equipo técnico:

| Apartado | Qué es | ¿Tocar? |
|---|---|---|
| **Store** | Nombre y monedas de la tienda | Solo nombre, con cuidado |
| **Users** | Personas con acceso al panel | ✅ Crear/quitar usuarios del equipo |
| **Regions** | Países y monedas (Panamá/USD) | ⚠️ No tocar |
| **Shipping / Locations** | Métodos y costos de envío | ⚠️ Avisar al técnico para cambios |
| **Taxes** | Impuestos (ITBMS 7%) | ⚠️ No tocar sin contador |
| **Sales Channels** | Canales de venta | ⚠️ No tocar |
| **API Key Management** | Llaves técnicas | 🚫 No tocar |

**Regla de oro:** si no sabes qué hace un ajuste de *Settings*, **no lo cambies** y consulta al equipo técnico.

---

## 11. Buenas prácticas y advertencias

- ✅ Mantén **stock actualizado** (evita vender lo que no tienes).
- ✅ Pon **fotos buenas** y **descripciones claras** y veraces (sobre todo en suplementos).
- ✅ Procesa los **pedidos a tiempo**: cobra, prepara y marca enviado.
- ✅ Revisa **Métricas** cada semana.
- ⚠️ No borres productos con ventas; mejor ponlos en **Draft** (despublicar).
- 🚫 No toques **Regions, Taxes, Sales Channels, API Keys** sin avisar.
- 🔒 Cambia tu contraseña y no la compartas.

---

## 12. Estado actual de la tienda (para tener en cuenta)

- **Pagos:** por ahora hay un **método de prueba**. Yappy y PagueloFácil se activan cuando estén las cuentas del negocio.
- **Correos:** los correos a clientes (confirmación, recuperación de contraseña) se enviarán a todos cuando se verifique el dominio definitivo del negocio. Mientras tanto funcionan en modo prueba.
- **Dominio:** la tienda está en una dirección temporal de Railway; al definir el nombre/dominio oficial se conectará el dominio propio.

---

## ¿Dudas o algo no funciona?
Anota qué hacías, qué esperabas y qué pasó (una captura de pantalla ayuda mucho) y
contacta al equipo técnico. **No improvises en Settings.**
