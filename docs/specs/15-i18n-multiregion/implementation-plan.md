# Plan de implementación — Internacionalización y multi-región

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
El trabajo del MVP aquí es **no cerrar puertas**: como Medusa es multi-región por diseño, basta con **usar correctamente** sus modelos de Región/Moneda/Impuesto/Envío y la abstracción de pagos, evitando hardcodear Panamá/USD/español en la lógica. La funcionalidad internacional real (nuevas regiones, traducción, selector de idioma, hreflang) se implementa **post-MVP** sobre esa base, sin reescritura.

## 2. Primitivas de Medusa usadas
- **Region, Currency, TaxRegion, ShippingOption, PriceList, SalesChannel:** base multi-región.
- **Abstracción de pagos (módulo 05):** proveedor por región.

## 3. Ganchos a asegurar en el MVP
- Operar sobre **una Región Panamá / USD** real (no constantes en código).
- Precios vía **Pricing Module** por moneda (no campos fijos).
- Impuestos (ITBMS) y envío como **config de región/zona**, no `if pais == Panamá`.
- **Textos del storefront centralizados** (preparados para i18n, aunque solo haya español).
- Pagos registrados de forma que **otro proveedor por región** sea aditivo.

## 4. Desglose de tareas (MVP = solo ganchos)
- [ ] Configurar Región Panamá/USD con impuestos y envío como datos (RF-I18N-1,2,3).
- [ ] Verificar que la lógica no hardcodea moneda/impuesto/idioma (revisión) (RF-I18N-1,2,3).
- [ ] Centralizar textos del storefront para futura i18n (RF-I18N-5).
- [ ] Confirmar que la abstracción de pagos admite proveedor por región (RF-I18N-4).

### Post-MVP (no en las 3 semanas)
- [ ] Activar nuevas regiones (moneda/impuestos/envío/pagos) (RF-I18N-6).
- [ ] Traducción de catálogo y contenido (RF-I18N-7).
- [ ] SEO hreflang + URLs por idioma/país (RF-I18N-8).
- [ ] Selector de región/idioma y conversión de moneda (RF-I18N-9,10).

## 5. Orden de trabajo y dependencias
Los ganchos son parte natural de los módulos 01/04/05/11/12; no es un esfuerzo aparte, sino una **disciplina** durante su implementación. La fase internacional se planifica como proyecto post-MVP.

## 6. Estrategia de pruebas
- **Revisión de diseño:** confirmar ausencia de valores hardcodeados (moneda/impuesto/idioma/pago).
- **Prueba conceptual:** simular "agregar una región" en dev para validar que el modelo lo soporta sin cambios de código de negocio.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Hardcodear Panamá/USD/español | Reescritura al expandir | Disciplina + revisión; usar modelos de región desde el día 1. |
| Textos dispersos en el código | i18n costosa después | Centralizar strings del storefront desde el inicio. |
| Sobre-ingeniería i18n en MVP | Retraso del lanzamiento | Solo ganchos en MVP; funcionalidad real post-MVP. |

## 8. Definición de "hecho" (ganchos MVP)
- [ ] La tienda opera sobre Región/Moneda de Medusa (Panamá/USD) sin hardcodeos.
- [ ] Impuestos y envío parametrizados por región.
- [ ] Textos del storefront centralizados para futura i18n.
- [ ] Pagos preparados para proveedor por región.
