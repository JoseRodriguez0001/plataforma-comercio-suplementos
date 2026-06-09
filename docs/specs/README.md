# Especificaciones — Tienda de Suplementos (Panamá)

Este directorio contiene la **especificación funcional completa** del producto y el **plan de implementación** de cada módulo. Es la fuente de verdad del *qué* y el *cómo* antes de escribir el esquema de base de datos (Paso 2) y el código (Paso 3).

## Cómo está organizado

- [`00-vision-y-alcance.md`](00-vision-y-alcance.md) — visión, alcance, **actores**, glosario y requisitos no funcionales.
- `NN-nombre/` — una carpeta por módulo, cada una con:
  - `spec.md` — qué hace el módulo, actores, historias de usuario, reglas de negocio, criterios de aceptación.
  - `implementation-plan.md` — cómo se construye sobre Medusa v2, tareas, riesgos y definición de "hecho".
- [`_templates/`](_templates/) — plantillas que siguen todas las specs.

## Convenciones

- Cada requisito funcional tiene ID estable: `RF-<modulo>-<n>` (ej. `RF-CAT-3`). Las pruebas y commits referencian ese ID.
- Estados: `Borrador` → `En revisión` → `Aprobada` → `Implementada`.
- Lo que es **post-MVP** se marca explícitamente para no inflar las 3 semanas.

## Índice de módulos y estado

| #  | Módulo | MVP | Estado |
|----|--------|-----|--------|
| 00 | Visión, alcance y actores | — | Borrador |
| 01 | Catálogo de productos | ✅ | **Ejemplo — Aprobada** |
| 02 | Búsqueda, navegación y categorías | ✅ | Aprobada |
| 03 | Carrito de compras | ✅ | Aprobada |
| 04 | Checkout (direcciones, envío, impuestos ITBMS) | ✅ | Aprobada |
| 05 | Pagos (abstracción + Yappy + PagueloFacil) | ✅ | Aprobada |
| 06 | Órdenes y cumplimiento (fulfillment) | ✅ | Aprobada |
| 07 | Inventario | ✅ | Aprobada |
| 08 | Cuentas de cliente y autenticación | ✅ | Aprobada |
| 09 | Panel de administración | ✅ | Aprobada |
| 10 | Notificaciones y email transaccional | ✅ | Aprobada |
| 11 | Contenido, páginas legales y SEO | ✅ | Aprobada |
| 12 | Diseño UI, branding y responsive | ✅ | Aprobada |
| 13 | Requisitos no funcionales (seguridad, rendimiento, datos) | ✅ | Aprobada |
| 14 | Infraestructura, entornos y deploy | ✅ | Aprobada |
| 15 | Internacionalización y multi-región | Post-MVP (diseñar hooks) | Aprobada |
| 16 | Analítica y métricas de negocio | Base mínima (MVP) | Aprobada |
| 17 | Reseñas y valoraciones de productos | ✅ | Aprobada |
