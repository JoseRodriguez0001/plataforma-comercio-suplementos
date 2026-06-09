# Spec — Catálogo de productos

- **ID módulo:** `CAT`
- **Estado:** Aprobada (ejemplo de formato)
- **MVP:** Sí
- **Depende de:** 07-Inventario (stock), 09-Admin (gestión)

## 1. Propósito
Permitir que el negocio publique y organice sus productos de suplementos con categorías, imágenes, descripciones y atributos específicos del rubro, y que los clientes los exploren con información clara y confiable que impulse la compra.

## 2. Actores involucrados
- **Visitante** y **Cliente registrado:** consultan el catálogo (lectura).
- **Dueño / Administrador:** crea y mantiene productos, variantes, categorías e imágenes (escritura, vía panel de admin).
- **Sistema:** indexa para búsqueda y emite eventos al crear/actualizar productos.

## 3. Historias de usuario
- Como **visitante** quiero ver los productos agrupados por categoría con foto, nombre y precio para encontrar lo que busco rápido.
- Como **visitante** quiero abrir la ficha de un producto y ver descripción, presentaciones (variantes), ingredientes, modo de uso y advertencias para decidir con confianza.
- Como **cliente** quiero ver si un producto está disponible o agotado antes de intentar comprarlo.
- Como **administrador** quiero crear un producto con varias presentaciones (sabor/tamaño) y subir varias imágenes sin tocar código.
- Como **administrador** quiero marcar productos como destacados/activos/inactivos para controlar qué se muestra.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CAT-1 | El sistema lista productos **activos** con imagen, nombre, precio y estado de disponibilidad. | Debe |
| RF-CAT-2 | Cada producto puede tener **múltiples variantes** (ej. sabor, tamaño) con su propio SKU y precio. | Debe |
| RF-CAT-3 | Cada producto pertenece a **una o más categorías** organizadas jerárquicamente. | Debe |
| RF-CAT-4 | La ficha de producto muestra: descripción, galería de imágenes, precio por variante, disponibilidad y **atributos de suplemento** (ingredientes, modo de uso, advertencias, tamaño de porción). | Debe |
| RF-CAT-5 | El administrador crea/edita/elimina productos, variantes, categorías e imágenes desde el panel. | Debe |
| RF-CAT-6 | El administrador puede activar/desactivar y destacar productos. | Debe |
| RF-CAT-7 | Las imágenes se almacenan en object storage (Cloudflare R2) y se sirven optimizadas. | Debe |
| RF-CAT-8 | Productos agotados se muestran como "agotado" y no son comprables (coord. con módulo 07). | Debe |
| RF-CAT-9 | Cada producto expone metadatos SEO (slug, título, meta-descripción). | Debería |
| RF-CAT-10 | El catálogo soporta etiquetas/atributos filtrables (ej. "vegano", "sin azúcar", marca). | Debería |

## 5. Reglas de negocio
- Un producto sin variante activa ni precio no puede publicarse como activo.
- El precio se define **por variante** y por región/moneda (USD en MVP).
- El SKU es único en todo el catálogo.
- Eliminar una categoría no elimina sus productos; quedan sin categorizar.
- Las advertencias de salud (ej. "consulte a su médico") son texto libre obligatorio configurable por el admin para cumplimiento del rubro.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Product`, `ProductVariant`, `ProductCategory`, `ProductCollection`, `ProductTag`, `ProductOption`, `Image`, `Price`.
**Extensiones propias (módulo custom de suplementos):** atributos específicos por producto:
- `ingredientes` (texto/lista), `modo_de_uso`, `advertencias`, `tamano_porcion`, `porciones_por_envase`, `marca`, `registro_sanitario` (opcional).

> El detalle a nivel esquema SQL se define en el Paso 2; aquí solo el modelo conceptual.

## 7. Interfaces / puntos de integración
- **Store API (Medusa):** endpoints de listado/detalle de productos consumidos por el storefront Next.js.
- **Admin API (Medusa):** CRUD desde el panel.
- **Eventos:** `product.created` / `product.updated` para reindexar búsqueda (módulo 02) e invalidar caché.
- **Storage:** Cloudflare R2 vía el módulo de File de Medusa.

## 8. Criterios de aceptación
- [ ] (RF-CAT-1/3) El storefront muestra productos por categoría con imagen, nombre, precio y disponibilidad.
- [ ] (RF-CAT-2/4) Una ficha de producto con 2+ variantes permite seleccionar variante y refleja precio/disponibilidad correctos, mostrando los atributos de suplemento.
- [ ] (RF-CAT-5/6) El admin crea un producto completo (con variantes, imágenes y atributos) y lo activa/destaca sin asistencia técnica.
- [ ] (RF-CAT-8) Un producto sin stock aparece "agotado" y no permite agregar al carrito.
- [ ] (RF-CAT-7) Las imágenes cargan desde R2 y están optimizadas para móvil.

## 9. Fuera de alcance
- Búsqueda y filtrado avanzado → módulo 02.
- Reglas de inventario y reservas → módulo 07.
- Traducción de fichas a otros idiomas → módulo 15 (post-MVP).
- Reseñas/valoraciones de productos (post-MVP).

## 10. Preguntas abiertas
1. ¿Qué atributos de suplemento son **obligatorios** vs opcionales? (validar con el dueño).
2. ¿Se necesita mostrar **registro sanitario** por requisito legal panameño?
3. ¿Habrá colecciones de marketing (ej. "Más vendidos", "Nuevos") además de categorías?
