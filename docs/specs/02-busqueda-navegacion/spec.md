# Spec — Búsqueda, navegación y categorías

- **ID módulo:** `NAV`
- **Estado:** Aprobada 
- **MVP:** Sí
- **Depende de:** 01-Catálogo (productos, categorías, tags, atributos)

## 1. Propósito
Permitir que el cliente **encuentre productos rápido**, ya sea explorando categorías, usando filtros del rubro (marca, vegano, sin azúcar, etc.) o buscando por texto. Una navegación clara reduce el abandono y aumenta la conversión, especialmente en móvil.

## 2. Actores involucrados
- **Visitante** y **Cliente registrado:** navegan, filtran y buscan (lectura).
- **Sistema:** mantiene el índice de búsqueda actualizado al crear/editar productos (evento `product.*` del módulo 01).
- **Dueño / Administrador:** define el orden de categorías en el menú y, opcionalmente, productos destacados/colecciones.

## 3. Historias de usuario
- Como **visitante** quiero un menú de categorías claro para explorar el catálogo por tipo de suplemento.
- Como **visitante** quiero una barra de búsqueda que me sugiera productos mientras escribo.
- Como **visitante** quiero filtrar dentro de una categoría (marca, atributos, rango de precio) y ordenar (precio, novedad, popularidad) para acotar resultados.
- Como **visitante en móvil** quiero que filtros y orden sean cómodos en pantalla pequeña.
- Como **administrador** quiero controlar el orden del menú de categorías y destacar colecciones.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-NAV-1 | Menú de navegación con las **categorías** (jerárquicas) del módulo 01. | Debe |
| RF-NAV-2 | Página de categoría que lista sus productos activos con paginación o scroll infinito. | Debe |
| RF-NAV-3 | **Búsqueda por texto** sobre nombre, descripción y marca, con resultados relevantes. | Debe |
| RF-NAV-4 | **Autocompletado/sugerencias** mientras el usuario escribe. | Debería |
| RF-NAV-5 | **Filtros facetados**: categoría, marca, atributos (vegano, sin azúcar…), rango de precio, disponibilidad. | Debe |
| RF-NAV-6 | **Ordenamiento**: relevancia, precio asc/desc, novedad, (popularidad si hay datos). | Debe |
| RF-NAV-7 | Estado vacío claro cuando una búsqueda/filtro no arroja resultados, con sugerencias. | Debería |
| RF-NAV-8 | El índice de búsqueda se **actualiza automáticamente** al crear/editar/eliminar/agotar productos. | Debe |
| RF-NAV-9 | URLs amigables y compartibles para categorías y resultados filtrados (SEO, coord. módulo 11). | Debería |
| RF-NAV-10 | "Migas de pan" (breadcrumbs) para ubicar al usuario en la jerarquía. | Podría |

## 5. Reglas de negocio
- Solo se indexan y muestran productos **activos**; los agotados aparecen pero marcados y filtrables aparte.
- Los filtros disponibles se derivan de los atributos/tags reales presentes en la categoría (no mostrar filtros vacíos).
- El orden por defecto en una categoría lo puede influir el negocio (destacados primero).
- La búsqueda debe tolerar errores menores de tipeo y acentos (búsqueda "fuzzy" / sin distinción de tildes).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Product`, `ProductCategory`, `ProductTag`, `ProductCollection` (fuente de datos a indexar).
**Servicio de búsqueda:** índice externo (ver plan) poblado desde estos datos. No introduce entidades nuevas de dominio; mantiene un documento de búsqueda por producto.

## 7. Interfaces / puntos de integración
- **Store API (Medusa):** listado por categoría y obtención de facetas/atributos.
- **Servicio de búsqueda** (Meilisearch — ver plan): API de búsqueda/autocompletado consumida por el storefront.
- **Subscriber de eventos** `product.created/updated/deleted` → sincroniza el índice (cumple RF-NAV-8).

## 8. Criterios de aceptación
- [ ] (RF-NAV-1/2) El menú muestra categorías y cada una lista sus productos con paginación.
- [ ] (RF-NAV-3/4) Buscar "creatina" devuelve resultados relevantes y el autocompletado sugiere mientras se escribe.
- [ ] (RF-NAV-5/6) Dentro de una categoría se puede filtrar por marca+atributo y ordenar por precio, y los resultados son correctos.
- [ ] (RF-NAV-8) Al crear/editar un producto en el admin, aparece/actualiza en la búsqueda sin intervención manual.
- [ ] (RF-NAV-7) Una búsqueda sin resultados muestra estado vacío con sugerencias.
- [ ] Filtros y orden son usables en móvil.

## 9. Fuera de alcance
- Recomendaciones personalizadas / "también te puede interesar" (post-MVP).
- Búsqueda por voz o imagen (post-MVP).
- Popularidad real requiere datos de ventas/analítica (módulo 16, post-MVP); en MVP el orden "popularidad" puede omitirse o aproximarse.

## 10. Preguntas abiertas
1. ¿Qué atributos del rubro se quieren como **filtros** desde el día 1? (depende de las preguntas abiertas del módulo 01).
2. ¿Scroll infinito o paginación clásica?
paginacion por defecto.
