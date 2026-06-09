# Plan de implementación — Contenido, páginas legales y SEO

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Aprobado

## 1. Enfoque general
El SEO y las páginas de contenido viven en el **storefront Next.js**, que es ideal para esto: **SSR/SSG** para indexación, **Metadata API** para títulos/OG, y rutas para sitemap/robots. La estrategia: páginas institucionales y legales como **rutas Next.js** (contenido en MDX/archivos para versionarlo), **metadatos y datos estructurados** generados desde los datos de producto (módulo 01), y un **mecanismo simple de edición** para los textos que el dueño querrá tocar (FAQ/contacto). Un CMS completo se evalúa post-MVP según la pregunta abierta.

## 2. Primitivas de Medusa usadas
- **Campos SEO de producto/categoría** (módulo 01) como fuente de metadatos.
- **Store API** para datos que alimentan datos estructurados (precio, disponibilidad).

## 3. Extensiones propias (storefront)
- **Páginas** Next.js: home, sobre nosotros, contacto, FAQ, términos, privacidad, envíos/devoluciones.
- **Metadata API** por página/producto (título, descripción, canonical, Open Graph).
- **Datos estructurados** schema.org (Product, Organization, Breadcrumb).
- **sitemap.xml** dinámico (incluye productos/categorías) y **robots.txt**.
- **`noindex`** en carrito/checkout/cuenta.
- **Contenido editable**: MDX para legal; para FAQ/contacto, un mecanismo simple (config/colección editable) — o CMS ligero si se decide.
- **Verificación de Search Console**.

## 4. Desglose de tareas
- [ ] Home con destacados/categorías/CTA (RF-CNT-1 — coord. módulo 12).
- [ ] Páginas institucionales: sobre nosotros, contacto, FAQ (RF-CNT-2).
- [ ] Páginas legales: términos, privacidad (Ley 81), envíos/devoluciones (RF-CNT-3).
- [ ] Metadatos SEO + Open Graph por página/producto (RF-CNT-4).
- [ ] sitemap.xml + robots.txt (RF-CNT-5).
- [ ] Datos estructurados schema.org (RF-CNT-6).
- [ ] URLs limpias/estables + canonical + noindex donde toca (RF-CNT-7,10).
- [ ] Optimización de rendimiento / Core Web Vitals (RF-CNT-8).
- [ ] Mecanismo de edición de contenido por el dueño (RF-CNT-9).
- [ ] Verificación en Google Search Console (RF-CNT-11).
- [ ] Estructura multilenguaje preparada (RF-CNT-12, solo dejar listo).

## 5. Orden de trabajo y dependencias
Depende del diseño (módulo 12) para los componentes visuales y del catálogo (01/02) para datos. Secuencia: estructura de páginas + legal → metadatos/sitemap/robots → datos estructurados → rendimiento → edición de contenido → Search Console.
**Bloqueante de negocio:** los textos legales y de marca los provee el dueño.

## 6. Estrategia de pruebas
- **SEO técnico:** validar metadatos, sitemap/robots, datos estructurados (Rich Results Test).
- **Rendimiento:** Lighthouse/Core Web Vitals en móvil para home y ficha.
- **Indexación:** verificación en Search Console; `noindex` correcto en páginas privadas.
- **Aceptación:** el dueño edita un texto clave sin ayuda.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Faltan textos legales al go-live | Riesgo legal/confianza | Solicitarlos temprano al negocio; bloqueante de lanzamiento. |
| SEO pobre = poco tráfico | Menos ventas | SSR + metadatos + datos estructurados + rendimiento desde el inicio. |
| CMS sobredimensionado | Costo/complejidad | MVP con MDX + edición simple; CMS solo si el dueño lo necesita. |
| Cambios de slug rompen enlaces | Pérdida SEO | Slugs estables + redirecciones cuando cambien. |

## 8. Definición de "hecho"
- [ ] RF-CNT "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Home + institucionales + legales publicadas y enlazadas.
- [ ] Metadatos, sitemap, robots y datos estructurados correctos.
- [ ] Core Web Vitals en verde en móvil.
- [ ] Páginas privadas con `noindex`; sitio verificado en Search Console.
- [ ] El dueño puede editar textos clave.
