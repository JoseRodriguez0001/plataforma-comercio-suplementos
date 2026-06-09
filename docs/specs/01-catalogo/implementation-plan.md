# Plan de implementación — Catálogo de productos

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Borrador

## 1. Enfoque general
Reutilizar al máximo el módulo de **Product** de Medusa v2 (productos, variantes, categorías, colecciones, tags, opciones, precios e imágenes vienen de fábrica con su Admin y Store API). Solo se construye a medida un **módulo de "Atributos de Suplemento"** que extiende el producto con los campos del rubro y se enlaza vía *module link*. Esto evita forkear el core y mantiene las actualizaciones de Medusa.

## 2. Primitivas de Medusa usadas
- **Product Module:** `Product`, `ProductVariant`, `ProductCategory`, `ProductCollection`, `ProductTag`, `ProductOption`.
- **Pricing Module:** precios por variante/moneda/región.
- **File Module:** subida de imágenes (proveedor Cloudflare R2 vía S3-compatible).
- **Admin Dashboard:** pantallas nativas de productos/categorías; se extiende con un *widget/UI route* para los atributos de suplemento.
- **Store API + Eventos:** `product.created/updated` para el subscriber de reindexado (módulo 02).

## 3. Extensiones propias
- **Módulo `supplement` (custom):** modelo `SupplementInfo` con `ingredientes`, `modo_de_uso`, `advertencias`, `tamano_porcion`, `porciones_por_envase`, `marca`, `registro_sanitario`.
- **Module link** `Product` ↔ `SupplementInfo` (uno a uno).
- **Admin UI:** widget en la página de producto para editar esos campos.
- **Proveedor de File para R2:** configurar el módulo File con credenciales S3-compatibles de R2.

## 4. Desglose de tareas
- [ ] Configurar Product Module y verificar Admin CRUD (RF-CAT-1,2,3,5,6).
- [ ] Configurar File Module → Cloudflare R2 y validar subida/servido de imágenes (RF-CAT-7).
- [ ] Crear módulo custom `supplement` + modelo + link a Product (RF-CAT-4).
- [ ] Widget de Admin para atributos de suplemento (RF-CAT-4,5).
- [ ] Exponer atributos en la Store API/respuesta de producto para el storefront (RF-CAT-4).
- [ ] Lógica de disponibilidad "agotado" integrada con inventario (RF-CAT-8 — coordinar módulo 07).
- [ ] Campos/slug SEO por producto (RF-CAT-9).
- [ ] Tags/atributos filtrables (RF-CAT-10 — base para módulo 02).
- [ ] Subscriber de evento `product.*` para reindexado/caché.

## 5. Orden de trabajo y dependencias
1. Product + File (base). → 2. Módulo `supplement` + link + Admin UI. → 3. Exposición en Store API. → 4. Disponibilidad (requiere módulo 07). → 5. SEO/tags.
Bloquea a: módulo 02 (búsqueda) y 03 (carrito) necesitan productos publicables.

## 6. Estrategia de pruebas
- **Integración:** crear producto con variantes + atributos vía Admin API y leerlo por Store API.
- **Unitarias:** validaciones de regla de negocio (producto activo requiere variante+precio; SKU único).
- **E2E (storefront):** listar por categoría, abrir ficha, cambiar de variante, ver "agotado".

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Configuración R2 con API S3 difiere de S3 puro | Imágenes no cargan | Probar el proveedor File temprano con un bucket de prueba. |
| Acoplar atributos de suplemento al core | Dificulta upgrades de Medusa | Usar módulo custom + module link, nunca modificar el core. |
| Atributos legales obligatorios sin definir | Reproceso | Resolver preguntas abiertas con el dueño antes de fijar el modelo. |

## 8. Definición de "hecho"
- [ ] Todos los RF-CAT marcados como "Debe" cumplidos y con criterios de aceptación verdes.
- [ ] El dueño crea un producto completo en el admin sin ayuda.
- [ ] Imágenes servidas desde R2 y optimizadas en móvil.
- [ ] Pruebas de integración y e2e del catálogo en verde.
- [ ] Documentación de los atributos custom en la spec actualizada.
