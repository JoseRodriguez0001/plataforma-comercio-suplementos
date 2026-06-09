# Spec — Diseño UI, branding y responsive

- **ID módulo:** `UI`
- **Estado:** En revisión
- **MVP:** Sí
- **Depende de:** 01, 02, 03, 04, 08, 11 (es la capa visual de todo el storefront)

## 1. Propósito
Definir la **identidad visual y la experiencia de usuario** del storefront: un diseño profesional, moderno y **responsive (mobile-first)** que transmita **confianza** —clave para vender suplementos, donde el cliente compra algo que ingiere— y guíe sin fricción desde el descubrimiento hasta la compra.

## 2. Actores involucrados
- **Visitante / Cliente:** vive toda la experiencia visual e interactiva.
- **Dueño / Administrador:** aporta logo, colores e identidad de marca; valida que refleje su negocio.
- **Desarrollador:** implementa el sistema de diseño y los componentes.

## 3. Historias de usuario
- Como **visitante en móvil** quiero una tienda rápida, clara y fácil de navegar con el pulgar.
- Como **cliente** quiero que el sitio se vea **profesional y confiable** para animarme a comprar.
- Como **cliente** quiero **fichas de producto claras** (foto grande, precio, beneficios, CTA visible).
- Como **cliente** quiero un **checkout limpio** que no me distraiga ni me genere dudas.
- Como **dueño** quiero que la tienda refleje **mi marca** (logo, colores, tono).
- Como **persona con discapacidad** quiero poder usar el sitio (accesibilidad básica).

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-UI-1 | **Sistema de diseño**: tokens (colores, tipografía, espaciado) y componentes reutilizables. | Debe |
| RF-UI-2 | **Branding**: logo, paleta y tipografía del negocio aplicados de forma consistente. | Debe |
| RF-UI-3 | **Responsive mobile-first**: funciona y se ve bien en móvil, tablet y escritorio. | Debe |
| RF-UI-4 | Componentes clave: **header con buscador/carrito, footer, tarjeta de producto, galería, selector de variante, carrito, pasos de checkout**. | Debe |
| RF-UI-5 | **Accesibilidad** básica (WCAG AA razonable): contraste, foco, etiquetas, navegación por teclado. | Debe |
| RF-UI-6 | **Estados de UI**: carga, vacío, error y éxito coherentes en todo el sitio. | Debe |
| RF-UI-7 | **Imágenes optimizadas** y responsivas (coord. módulo 01/CDN). | Debe |
| RF-UI-8 | **Confianza visual**: sellos de pago, reseñas/garantías, claridad de precios e info de contacto. | Debería |
| RF-UI-9 | **Consistencia** con el admin en idioma (español) y tono. | Debería |
| RF-UI-10 | **Modo accesible de rendimiento**: animaciones sutiles, sin bloquear interacción. | Podría |
| RF-UI-11 | **Componentes documentados** (catálogo/guía de uso para mantenibilidad). | Debería |

## 5. Reglas de negocio
- **Mobile-first**: el grueso del tráfico en Panamá es móvil; se diseña y prueba primero en móvil.
- La **confianza** es prioridad de diseño (es venta de productos ingeribles): precios claros, info del negocio visible, proceso de pago que se sienta seguro.
- El diseño usa el **branding provisto por el dueño**; si no está disponible, se parte de una identidad base provisional y se ajusta.
- Consistencia: todos los módulos usan el **mismo sistema de componentes** (no estilos ad-hoc).
- Idioma de la interfaz: **español**.
- **Dirección visual (2026-06-08):** estilo **limpio, serio y confiable**, acorde a productos orientados a **mejorar la salud/bienestar**; paleta sobria que aporte a esa sensación (limpieza, salud). Sin referencias externas: la guía es el carácter "salud" de los productos. El branding definitivo se confirma luego; se parte de esta dirección.

## 6. Entidades de datos involucradas
No aplica entidades de datos. **Artefactos:** sistema de diseño (tokens + componentes), guía de marca, librería de componentes del storefront.

## 7. Interfaces / puntos de integración
- **Next.js + Tailwind CSS + shadcn/ui:** base del sistema de componentes (decisión de arquitectura).
- **Módulos 01–04, 08, 11:** consumen los componentes (catálogo, navegación, carrito, checkout, cuenta, contenido).
- **Módulo 01/CDN:** imágenes optimizadas.
- **Branding del dueño:** logo, colores, tipografía.

## 8. Criterios de aceptación
- [ ] (RF-UI-1/2) Existe un sistema de diseño con branding aplicado de forma consistente.
- [ ] (RF-UI-3) Home, catálogo, ficha, carrito y checkout se ven y funcionan bien en móvil, tablet y escritorio.
- [ ] (RF-UI-4) Los componentes clave están implementados y reutilizados en todo el sitio.
- [ ] (RF-UI-5) Auditoría de accesibilidad básica sin problemas críticos (contraste, foco, teclado).
- [ ] (RF-UI-6/7) Estados de carga/vacío/error coherentes; imágenes optimizadas.
- [ ] (RF-UI-8) Elementos de confianza presentes en home, ficha y checkout.
- [ ] El dueño valida que la tienda refleja su marca.

## 9. Fuera de alcance
- Diseño de **campañas/landing** específicas (post-MVP).
- **Tema oscuro** del storefront (post-MVP).
- Ilustraciones/animaciones avanzadas (post-MVP).
- Rediseño del **admin** (se usa el nativo de Medusa; módulo 09).

## 10. Decisiones y preguntas abiertas
**Resueltas (2026-06-08):**
1. **Dirección visual:** diseño **limpio, serio, salud/bienestar** (ver regla de negocio). Branding definitivo se confirma luego; se itera desde esta base sin reescribir componentes (tokens).
2. **Referencias:** no hay tiendas de referencia; la guía es el carácter "salud" de los productos.
3. **Reseñas/valoraciones:** **sí, desde el MVP** → se crea el **módulo 17 (Reseñas y valoraciones)**. El componente de reseñas en la ficha de producto se diseña aquí (RF-UI-8).

**Pendientes:**
- Entrega de **assets de marca** (logo, paleta, tipografía) por el dueño.
