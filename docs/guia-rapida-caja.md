# 🟢 Guía rápida NATURZEN — para tener al lado de la caja

**Panel:** https://backend-production-f80d.up.railway.app/app
**Tienda:** https://storefront-production-a6b1.up.railway.app

---

## ✅ Procesar un pedido (lo del día a día)

**1. Cobrar** → *Orders* → abre el pedido → **Capture payment**.

**2. Preparar** → en los productos: **Fulfill items**
   - **Location:** Almacén NATURZEN
   - **Create Fulfillment** ← aquí baja el stock.

**3. Avisar al cliente** → recuadro **"Cumplimiento (envío / retiro)"**:
   - **Envío a domicilio:** Transportista + N.º de guía + **Fecha de envío** → **Guardar**.
   - **Retiro en local:** Método *Retiro en local* + **Listo para retiro** → **Guardar**.

> ⚠️ La **"Fecha de envío"** (o "Listo para retiro") **manda el correo al cliente**.
> Ponla **solo cuando ya esté despachado/listo**.
> Puedes **ignorar** la pantalla en inglés "Mark fulfillment shipped".

---

## 📦 Reponer stock
*Inventory* → busca el producto → edita la **cantidad disponible**.

## ➕ Producto nuevo (rápido)
*Products → Create* → Nombre, **precio en USD**, inventario, **foto cuadrada**, estado **Published** → *Save*.

## 🏷️ Descuento
*Promotions → Create* → porcentaje o monto → define el **código** → comparte.

## 🔧 Si algo sale mal (menú ⋮ del pedido)
- **Create Return** = devolución (reembolso).
- **Create Exchange** = cambio por otro producto.
- **Create Claim** = producto dañado / equivocado / faltante.

## 📊 Ver ventas
*Métricas* (menú izquierdo) → elige 7 / 30 / 90 días.

---

## 🚫 NO tocar (en *Settings*)
**Regions · Taxes · Sales Channels · API Keys** → avisar al equipo técnico.

## 🧠 Recordatorios
- Mantén el **stock al día** (evita vender lo que no hay).
- **Pago de prueba** activo (Yappy/PagueloFácil aún por activar).
- Fotos: cuadradas, fondo claro.
- ¿Dudas o error? Toma **captura de pantalla** y avisa al equipo técnico.
