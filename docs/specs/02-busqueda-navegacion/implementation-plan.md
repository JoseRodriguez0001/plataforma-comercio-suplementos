# Plan de implementación — Búsqueda, navegación y categorías

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobada

## 1. Enfoque general
La navegación por categorías se resuelve con la **Store API nativa de Medusa** (categorías + listado de productos con filtros básicos). Para **búsqueda de texto, autocompletado y filtros facetados con tolerancia a errores**, se integra **Meilisearch** (motor de búsqueda ligero, open source, barato de hospedar y con faceting/typo-tolerance de fábrica). Medusa tiene patrón oficial de integración de búsqueda vía *subscribers* que sincronizan el índice ante eventos de producto.

> Alternativas consideradas: **Algolia** (excelente DX pero de pago y dependencia externa) y **Postgres full-text** (sin costo extra pero sin faceting/typo-tolerance cómodos). Meilisearch equilibra costo, control y funcionalidad; se puede hospedar en Railway. Si más adelante el volumen lo exige, la capa de abstracción permite migrar a Algolia.

## 2. Primitivas de Medusa usadas
- **Product/Category Store API:** menú, páginas de categoría, paginación.
- **Eventos** `product.created/updated/deleted` y cambios de inventario → **subscriber** que indexa en Meilisearch (RF-NAV-8).
- **Worker** (proceso de Railway) ejecuta la indexación en background sin bloquear el API.

## 3. Extensiones propias
- **Servicio/módulo de búsqueda**: cliente de Meilisearch, definición del índice `products` (campos buscables: nombre, descripción, marca; atributos filtrables: categoría, tags, precio, disponibilidad).
- **Subscriber de sincronización** índice ⇄ catálogo.
- **Job de reindexado completo** (comando) para poblar/recuperar el índice desde cero.
- **Endpoints/Server-side fetch** en el storefront Next.js para búsqueda y facetas.

## 4. Desglose de tareas
- [ ] Desplegar Meilisearch (Railway) y configurar credenciales/entornos.
- [ ] Definir índice `products` y mapeo de campos buscables/filtrables (RF-NAV-3,5).
- [ ] Subscriber de eventos de producto → upsert/delete en índice (RF-NAV-8).
- [ ] Job de reindexado completo (RF-NAV-8, recuperación).
- [ ] Menú de categorías + páginas de categoría con paginación (RF-NAV-1,2).
- [ ] Barra de búsqueda + autocompletado en storefront (RF-NAV-3,4).
- [ ] UI de filtros facetados y ordenamiento, responsive (RF-NAV-5,6).
- [ ] Estados vacíos y breadcrumbs (RF-NAV-7,10).
- [ ] URLs amigables/compartibles (RF-NAV-9, coord. módulo 11).

## 5. Orden de trabajo y dependencias
Requiere módulo 01 (productos/categorías/atributos) funcional. Secuencia: índice + sync (backend) → navegación por categorías → búsqueda/autocompletado → filtros/orden → pulido (estados vacíos, breadcrumbs, URLs).
Habilita: experiencia de descubrimiento previa al carrito (módulo 03).

## 6. Estrategia de pruebas
- **Integración:** crear/editar/eliminar producto y verificar que el índice refleja el cambio.
- **Funcional:** búsquedas con errores de tipeo y acentos devuelven resultados; facetas filtran correctamente.
- **E2E:** flujo navegar categoría → filtrar → ordenar → abrir ficha.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Índice desincronizado del catálogo | Resultados incorrectos | Subscriber idempotente + job de reindexado total + verificación periódica. |
| Costo/ops de otro servicio (Meilisearch) | Más infraestructura | Instancia pequeña en Railway; abstraer cliente para poder cambiar de motor. |
| Filtros vacíos o irrelevantes | Mala UX | Derivar facetas de datos reales de la categoría. |

## 8. Definición de "hecho"
- [ ] RF-NAV "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Búsqueda con typo-tolerance y autocompletado funcionando en storefront.
- [ ] Sincronización automática índice⇄catálogo verificada (crear/editar/borrar).
- [ ] Filtros y orden usables en móvil.
- [ ] Job de reindexado documentado para operación.
