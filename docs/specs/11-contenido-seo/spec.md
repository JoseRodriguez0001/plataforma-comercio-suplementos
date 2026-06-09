# Spec — Contenido, páginas legales y SEO

- **ID módulo:** `CNT`
- **Estado:** Aprobada
- **MVP:** Sí
- **Depende de:** 01-Catálogo, 02-Navegación, 12-Diseño

## 1. Propósito
Dar al sitio las **páginas no-producto** que generan confianza y cumplimiento (home, sobre nosotros, contacto, preguntas frecuentes, términos, privacidad, envíos/devoluciones) y la **optimización para buscadores (SEO)** que permite que clientes nuevos encuentren la tienda en Google. Para un negocio sin presencia digital, ser encontrable es tan importante como tener buen catálogo.

## 2. Actores involucrados
- **Visitante / Cliente:** lee páginas informativas y llega desde buscadores.
- **Dueño / Administrador:** edita textos clave (contacto, FAQ, políticas) sin tocar código (en lo posible).
- **Sistema:** genera metadatos, sitemap y datos estructurados para buscadores.
- **Buscadores (Google, etc.):** indexan el sitio.

## 3. Historias de usuario
- Como **visitante** quiero una **home** atractiva que muestre productos destacados/categorías y transmita confianza.
- Como **visitante** quiero páginas de **contacto, FAQ y sobre nosotros** para confiar en el negocio.
- Como **visitante** quiero leer **términos, privacidad y políticas de envío/devolución** claras.
- Como **cliente potencial** quiero **encontrar la tienda en Google** al buscar productos o la marca.
- Como **dueño** quiero **editar** los textos de páginas clave y metadatos SEO sin depender del desarrollador.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CNT-1 | **Home** con secciones: destacados, categorías, propuesta de valor, llamados a la acción. | Debe |
| RF-CNT-2 | Páginas institucionales: **Sobre nosotros, Contacto, Preguntas frecuentes**. | Debe |
| RF-CNT-3 | Páginas legales: **Términos y condiciones, Política de privacidad (Ley 81), Política de envíos y devoluciones**. | Debe |
| RF-CNT-4 | **Metadatos SEO** por página y producto: título, meta-descripción, slug, Open Graph (compartir en redes). | Debe |
| RF-CNT-5 | **Sitemap.xml** y **robots.txt** generados y actualizados. | Debe |
| RF-CNT-6 | **Datos estructurados** (schema.org Product, Organization, Breadcrumb) para resultados enriquecidos. | Debería |
| RF-CNT-7 | **URLs limpias y estables** (categorías, productos, páginas). | Debe |
| RF-CNT-8 | **Rendimiento/Core Web Vitals** adecuados (SSR/CDN, imágenes optimizadas). | Debe |
| RF-CNT-9 | **Edición de contenido** por el dueño de páginas/textos clave (mínimo: contacto, FAQ, políticas). | Debería |
| RF-CNT-10 | **Canonical**, manejo de paginación y `noindex` donde corresponda (carrito, checkout, cuenta). | Debería |
| RF-CNT-11 | Integración con **Google Search Console** (verificación del sitio). | Debería |
| RF-CNT-12 | **Multilenguaje** preparado a nivel de URLs/SEO (solo español activo en MVP). | Podría |

## 5. Reglas de negocio
- Las páginas de **carrito, checkout y cuenta** no se indexan (`noindex`).
- Cada producto y categoría tiene **slug único y estable**; cambiarlo debe contemplar redirección.
- Las **políticas legales** deben existir antes del go-live (requisito de confianza y cumplimiento Ley 81).
- El contenido informativo está en **español** (mercado Panamá); estructura lista para más idiomas a futuro.
- Los textos legales son provistos/validados por el **negocio** (no los inventa el desarrollador).

## 6. Entidades de datos involucradas
**Nativas de Medusa:** metadatos SEO de producto/categoría (campos del módulo 01); el contenido vive principalmente en el **storefront Next.js**.
**Extensiones propias:** páginas de contenido en Next.js (estáticas/MDX o un CMS ligero), generación de **sitemap/robots**, componentes de **metadatos y datos estructurados**, y mecanismo de **edición de contenido** por el dueño (ver pregunta abierta sobre CMS).

## 7. Interfaces / puntos de integración
- **Next.js (storefront):** renderizado SSR/SSG, metadata API, sitemap/robots, Open Graph.
- **Módulo 01/02:** datos de producto/categoría para SEO y datos estructurados.
- **Módulo 12 (Diseño):** componentes visuales de las páginas.
- **Google Search Console / Analytics (módulo 16):** verificación e indexación.
- **Cloudflare/Vercel CDN:** rendimiento y caché.

## 8. Criterios de aceptación
- [ ] (RF-CNT-1/2/3) Home y páginas institucionales/legales publicadas y enlazadas (header/footer).
- [ ] (RF-CNT-4/7) Cada producto/categoría/página tiene título, meta-descripción y slug limpio.
- [ ] (RF-CNT-5) sitemap.xml y robots.txt accesibles y correctos.
- [ ] (RF-CNT-6) Una ficha de producto expone datos estructurados válidos (test de Google).
- [ ] (RF-CNT-8) Core Web Vitals en verde en móvil para home y ficha de producto.
- [ ] (RF-CNT-10) Carrito/checkout/cuenta marcados `noindex`.
- [ ] (RF-CNT-9) El dueño edita el texto de una página clave sin asistencia técnica.

## 9. Fuera de alcance
- **Blog / marketing de contenidos** (post-MVP, gran aliado de SEO a futuro).
- **Multilenguaje** activo (post-MVP; solo se deja preparado).
- Landing pages de campañas y A/B testing (post-MVP).
- Gestión avanzada de redirecciones SEO masivas (post-MVP).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Edición de contenido:** **MDX/código** para páginas legales + **mecanismo simple** para FAQ/contacto en el MVP; **CMS completo → post-MVP**.
2. **Textos legales:** los **aporta el negocio/su asesor** (bloqueante de go-live).
3. **Assets de marca:** **existen** (logo, identidad, textos "sobre nosotros") y se proporcionan cuando se necesiten — coord. módulo 12.
