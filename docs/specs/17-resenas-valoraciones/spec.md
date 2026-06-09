# Spec — Reseñas y valoraciones de productos

- **ID módulo:** `REV`
- **Estado:** Aprobado
- **MVP:** Sí (agregado tras decisión del módulo 12)
- **Depende de:** 01-Catálogo, 06-Órdenes, 08-Cuentas, 09-Admin, 12-UI

## 1. Propósito
Permitir que los clientes dejen **valoraciones (estrellas) y reseñas** de los productos, y mostrarlas en la ficha, para **generar confianza** e impulsar la conversión —un factor cada vez más decisivo al comprar online. Incluye **moderación** por el dueño y, preferentemente, **compra verificada**.

## 2. Actores involucrados
- **Cliente registrado (con compra):** deja y edita su reseña.
- **Visitante:** lee reseñas y el promedio de valoración.
- **Dueño / Administrador:** modera (aprueba/oculta/elimina) y puede responder.
- **Sistema:** valida compra, calcula promedios, aplica antiabuso.

## 3. Historias de usuario
- Como **cliente que compró** quiero **valorar (1–5★) y comentar** un producto para ayudar a otros.
- Como **visitante** quiero ver el **promedio de estrellas** y leer reseñas en la ficha para decidir.
- Como **dueño** quiero **moderar** reseñas (aprobar/ocultar/eliminar) para evitar spam u ofensas.
- Como **dueño** quiero **responder** públicamente a una reseña (atención al cliente).
- Como **visitante** quiero **ordenar/filtrar** reseñas (más recientes, mejor/peor valoradas).

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-REV-1 | **Crear reseña**: valoración 1–5★ + comentario, asociada a producto y cliente. | Debe |
| RF-REV-2 | **Compra verificada**: solo quien compró el producto puede reseñarlo (marca "compra verificada"). | Debe |
| RF-REV-3 | Mostrar en la ficha: **promedio de estrellas**, conteo y lista de reseñas. | Debe |
| RF-REV-4 | **Moderación** en el admin: aprobar/ocultar/eliminar; estado de cada reseña. | Debe |
| RF-REV-5 | **Una reseña por cliente y producto** (editable por el autor). | Debe |
| RF-REV-6 | **Antiabuso**: evitar spam/lenguaje ofensivo (límite de longitud, validación, rate limit). | Debería |
| RF-REV-7 | **Respuesta del dueño** a una reseña (visible públicamente). | Debería |
| RF-REV-8 | **Ordenar/filtrar** reseñas (recientes, mayor/menor valoración, solo verificadas). | Debería |
| RF-REV-9 | Reflejar el **promedio** en tarjetas de producto y permitir su uso en orden por "mejor valorado" (coord. módulo 02). | Podría |
| RF-REV-10 | **Notificación** al dueño de nueva reseña pendiente de moderar (coord. módulo 10). | Podría |
| RF-REV-11 | **Datos estructurados** de valoración (schema.org AggregateRating/Review) para SEO (coord. módulo 11). | Debería |

## 5. Reglas de negocio
- Solo **clientes con compra entregada/confirmada** del producto pueden reseñarlo (compra verificada).
- **Una reseña por cliente y producto**; el autor puede editarla; el promedio se recalcula.
- **Política de moderación:** definir si las reseñas se publican directo y se moderan a posteriori, o requieren aprobación previa (ver pregunta abierta).
- Las reseñas **ofensivas/spam** pueden ocultarse/eliminarse por el dueño.
- El **promedio** se calcula solo con reseñas **visibles/aprobadas**.
- No se permiten reseñas **anónimas** (requiere cuenta) para reducir abuso.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Product`, `Customer`, `Order` (para verificar compra). *(Medusa no trae reseñas de fábrica.)*
**Extensiones propias (módulo `review`):** modelo `Review` (producto, cliente, rating, comentario, estado, compra_verificada, respuesta_dueño, timestamps) con **module links** a Product y Customer; agregados de promedio/conteo por producto.

## 7. Interfaces / puntos de integración
- **Módulo custom `review`** (modelo + workflows + API Store/Admin).
- **Store API:** crear/editar reseña (autenticado), listar reseñas y promedio por producto.
- **Admin (módulo 09):** UI de moderación y respuesta.
- **Módulo 06/08:** verificación de compra (orden del cliente que incluye el producto).
- **Módulo 02:** promedio como dato para orden "mejor valorado".
- **Módulo 11:** datos estructurados de rating.
- **Módulo 10:** aviso de reseña pendiente.

## 8. Criterios de aceptación
- [ ] (RF-REV-1/2) Un cliente que compró un producto puede dejar 1–5★ + comentario, marcado "compra verificada"; quien no compró, no puede.
- [ ] (RF-REV-3) La ficha muestra promedio, conteo y lista de reseñas.
- [ ] (RF-REV-4) El dueño aprueba/oculta/elimina reseñas desde el admin.
- [ ] (RF-REV-5) Un cliente no puede dejar dos reseñas del mismo producto; puede editar la suya.
- [ ] (RF-REV-8) Las reseñas se pueden ordenar/filtrar.
- [ ] (RF-REV-11) La ficha expone datos estructurados de valoración válidos.

## 9. Fuera de alcance
- **Reseñas con fotos/videos** del cliente (post-MVP).
- **Votos de utilidad** ("¿te resultó útil?") (post-MVP).
- Importación de reseñas externas / integraciones (post-MVP).
- Incentivos por reseñar (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Moderación:** **publicación directa** (con compra verificada) + **moderación posterior**; se cambia a aprobación previa solo si aparece abuso.
2. **Habilitación para reseñar:** **al entregarse** la orden (reseñas reales).
3. **Eliminar reseña propia:** **sí**, el cliente puede eliminar y editar la suya.
