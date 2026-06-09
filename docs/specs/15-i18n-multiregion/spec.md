# Spec — Internacionalización y multi-región

- **ID módulo:** `I18N`
- **Estado:** Aprobado
- **MVP:** No (post-MVP) — **pero se diseñan los "ganchos" en el MVP**
- **Depende de:** 01, 04, 05, 11, 12, 14

## 1. Propósito
Preparar la tienda para **vender fuera de Panamá** en el futuro (otros países, monedas e idiomas) **sin reescribir** el sistema. En el MVP no se activa nada internacional, pero se toman decisiones de arquitectura que dejan listo el camino — cumpliendo el criterio #3 del proyecto (escalar de Panamá a internacional sin rehacer todo).

## 2. Actores involucrados
- **Negocio/Dueño:** decide cuándo y a qué mercados expandirse (futuro).
- **Cliente internacional (futuro):** compra en su idioma, moneda y con métodos/impuestos/envíos de su región.
- **Desarrollador:** asegura que el MVP no introduzca obstáculos a la expansión.

## 3. Historias de usuario (futuras)
- Como **cliente de otro país** quiero ver precios en **mi moneda** y contenido en **mi idioma**.
- Como **negocio** quiero **agregar una región** (país, moneda, impuestos, envío, pagos) sin reescribir el sistema.
- Como **negocio** quiero **traducir** catálogo y contenido sin duplicar la tienda.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-I18N-1 | **Modelo de regiones** de Medusa usado desde el MVP (aunque solo exista Panamá/USD). | Debe (gancho) |
| RF-I18N-2 | **Precios por moneda/región** soportados por el modelo (no hardcodear USD en la lógica). | Debe (gancho) |
| RF-I18N-3 | **Impuestos y envío por región** parametrizables (no asumir solo ITBMS/zonas Panamá en código). | Debe (gancho) |
| RF-I18N-4 | **Pagos por región**: la abstracción permite distintos proveedores según país (ej. Stripe internacional). | Debe (gancho) |
| RF-I18N-5 | **i18n del storefront** preparado (estructura de textos/rutas lista para más idiomas). | Debería (gancho) |
| RF-I18N-6 | **Activar una nueva región** (moneda, impuestos, envío, pagos) — funcionalidad completa. | Post-MVP |
| RF-I18N-7 | **Traducción de catálogo y contenido** a otros idiomas. | Post-MVP |
| RF-I18N-8 | **SEO multilenguaje/multi-región** (hreflang, URLs por idioma/país). | Post-MVP |
| RF-I18N-9 | **Detección/selección de región e idioma** por el usuario. | Post-MVP |
| RF-I18N-10 | **Conversión/visualización de moneda** y redondeo por región. | Post-MVP |

## 5. Reglas de negocio
- En el MVP existe **una región (Panamá) y una moneda (USD)**, pero el código **no asume** que siempre será así.
- Nada de **hardcodear** moneda, impuestos, idioma o método de pago: todo sale de la configuración de región.
- La **abstracción de pagos** (módulo 05) ya permite registrar proveedores por región → Stripe se suma para internacional sin tocar el checkout.
- El contenido del MVP está en español, pero la **estructura de textos** no impide agregar idiomas.

## 6. Entidades de datos involucradas
**Nativas de Medusa:** `Region`, `Currency`, `TaxRegion`, `ShippingOption` por zona, `PriceList`/precios por moneda, `SalesChannel`. Medusa es multi-región por diseño.
**Extensiones propias (futuras):** capa de traducción de contenido/catálogo; i18n del storefront (librería de Next.js); SEO hreflang.

## 7. Interfaces / puntos de integración
- **Region/Pricing/Tax/Fulfillment Modules (Medusa):** base multi-región ya usada en MVP.
- **Módulo 05 (Pagos):** proveedores por región.
- **Módulo 11 (SEO):** estructura preparada para multilenguaje.
- **Módulo 12 (UI):** componentes que no asumen idioma único.

## 8. Criterios de aceptación (del gancho en MVP)
- [ ] (RF-I18N-1/2) La tienda opera sobre el modelo de Región/Moneda de Medusa (Panamá/USD) sin hardcodear la moneda.
- [ ] (RF-I18N-3) Impuestos y envío están parametrizados por región, no incrustados en código.
- [ ] (RF-I18N-4) La abstracción de pagos admite proveedor por región (verificable conceptualmente).
- [ ] (RF-I18N-5) Los textos del storefront están centralizados de forma que agregar un idioma no requiera reescribir páginas.

## 9. Fuera de alcance (MVP)
- Activación real de cualquier región/idioma distinto de Panamá/español (RF-I18N-6..10) → **post-MVP**.
- Traducción de contenido, selector de idioma, SEO hreflang, conversión de moneda → post-MVP.

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Mercados objetivo futuros:** Colombia, Centroamérica y Latinoamérica. Implicación: la prioridad de expansión es **multi-moneda/región** (ej. COP) más que multi-idioma, porque son mayormente hispanohablantes.
2. **Idiomas:** **español primario**; **inglés** como segundo idioma deseable. Los ganchos i18n se preparan pensando en español+inglés, sin activarlos en MVP.
