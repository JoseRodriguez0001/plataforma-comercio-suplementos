# Plan de implementación — Reseñas y valoraciones

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
Medusa **no trae reseñas de fábrica**, así que se construye un **módulo custom `review`**: un modelo `Review` enlazado a Product y Customer vía *module links*, con workflows para crear/editar/moderar y API Store/Admin. La **verificación de compra** se resuelve consultando las órdenes del cliente (módulo 06). La UI pública vive en el storefront (módulo 12) y la moderación como **UI route/widget** en el admin (módulo 09). Es el módulo MVP de mayor esfuerzo "nuevo"; se mantiene acotado (sin fotos/votos en MVP).

## 2. Primitivas de Medusa usadas
- **Custom Module + Data Model** (`Review`) con **module links** a `Product` y `Customer`.
- **Order Module:** verificación de compra del producto por el cliente.
- **Workflows:** crear/editar/moderar reseña; recalcular agregados.
- **API routes:** Store (crear/listar) y Admin (moderar/responder).
- **Admin Extensions:** pantalla de moderación.
- **Eventos:** `review.created` → aviso al dueño (módulo 10).

## 3. Extensiones propias
- **Modelo `Review`:** `product_id`, `customer_id`, `rating` (1–5), `comment`, `status` (pendiente/aprobada/oculta), `verified_purchase`, `owner_reply`, timestamps.
- **Agregados** por producto: promedio y conteo (calculados/materializados).
- **Verificación de compra** contra órdenes del cliente.
- **UI pública** (módulo 12): estrellas, promedio, lista, formulario, orden/filtro.
- **UI admin** (módulo 09): moderación y respuesta.
- **Datos estructurados** AggregateRating/Review (módulo 11).
- **Antiabuso:** límites de longitud, validación, rate limit (módulo 13).

## 4. Desglose de tareas
- [ ] Crear módulo `review` + modelo + links a Product/Customer (RF-REV-1).
- [ ] Verificación de compra (orden con el producto) (RF-REV-2).
- [ ] API Store: crear/editar/listar reseñas + promedio (RF-REV-1,3,5).
- [ ] Cálculo de promedio/conteo con reseñas visibles (RF-REV-3).
- [ ] UI de ficha: estrellas, promedio, lista, formulario (RF-REV-3 — coord. 12).
- [ ] Moderación en admin: aprobar/ocultar/eliminar + estado (RF-REV-4 — coord. 09).
- [ ] Respuesta del dueño (RF-REV-7).
- [ ] Orden/filtro de reseñas (RF-REV-8).
- [ ] Antiabuso (longitud/validación/rate limit) (RF-REV-6 — coord. 13).
- [ ] Datos estructurados de rating (RF-REV-11 — coord. 11).
- [ ] Aviso de reseña pendiente al dueño (RF-REV-10 — coord. 10).
- [ ] Promedio en tarjetas + orden "mejor valorado" (RF-REV-9 — coord. 02).

## 5. Orden de trabajo y dependencias
Depende de catálogo (01), órdenes (06) y cuentas (08). Secuencia: módulo+modelo → verificación de compra → API + agregados → UI pública → moderación admin → respuesta/orden/filtro → antiabuso/SEO/avisos.
**Nota de alcance:** módulo nuevo (no nativo); confirmar que cabe en el cronograma de 3 semanas o si entra como fast-follow inmediato.

## 6. Estrategia de pruebas
- **Unitarias:** cálculo de promedio con reseñas aprobadas; regla de una-por-cliente-producto.
- **Integración:** solo cliente con compra puede reseñar; moderación cambia visibilidad y promedio.
- **E2E:** dejar reseña → moderar → ver en ficha con promedio y datos estructurados.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Esfuerzo extra en MVP de 3 semanas | Riesgo de cronograma | Acotar (sin fotos/votos); considerar fast-follow si aprieta. |
| Spam/reseñas falsas | Pérdida de confianza | Compra verificada + moderación + antiabuso. |
| Reseñas ofensivas públicas | Imagen del negocio | Moderación (previa o posterior según decisión) + ocultar/eliminar. |
| Promedio inconsistente | Datos engañosos | Recalcular solo con reseñas visibles; pruebas de agregado. |

## 8. Definición de "hecho"
- [ ] RF-REV "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Solo compradores verificados reseñan; una por cliente/producto (editable).
- [ ] Ficha muestra promedio/conteo/lista; moderación operativa en admin.
- [ ] Datos estructurados de rating válidos.
- [ ] Antiabuso básico activo.
