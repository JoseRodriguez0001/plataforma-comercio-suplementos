# Plan de implementación — Diseño UI, branding y responsive

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:** Borrador

## 1. Enfoque general
Construir un **sistema de diseño** sobre **Tailwind CSS + shadcn/ui** (componentes accesibles y headless que se estilizan con los tokens de marca). Se define primero la **base** (tokens de color/tipografía/espaciado a partir del branding del dueño) y los **componentes compartidos**, y luego cada módulo del storefront los consume. Enfoque **mobile-first** y **accesible** desde el inicio, no como retoque final. Si el branding definitivo no está listo, se arranca con una identidad base provisional y se ajusta sin reescribir componentes (los tokens centralizan el cambio).

## 2. Primitivas / tecnologías usadas
- **Next.js (App Router)** como host del storefront.
- **Tailwind CSS** para estilos por tokens.
- **shadcn/ui** + Radix para componentes accesibles (foco, teclado, ARIA de base).
- **next/image** + CDN para imágenes optimizadas.

## 3. Componentes a construir
- **Layout:** header (logo, buscador, carrito, cuenta), footer, navegación móvil.
- **Catálogo:** tarjeta de producto, grilla, filtros/orden (módulo 02), badges (agotado/destacado).
- **Producto:** galería, selector de variante, bloque de precio/disponibilidad, atributos de suplemento, CTA.
- **Carrito y checkout:** línea de carrito, resumen/totales, pasos de checkout, formularios de dirección/pago.
- **Cuenta:** formularios de login/registro, listas de pedidos/direcciones.
- **Transversales:** botones, inputs, selects, modales, toasts, skeletons de carga, estados vacío/error.
- **Confianza:** sellos de pago, bloque de garantías/contacto.

## 4. Desglose de tareas
- [ ] Definir tokens de diseño desde el branding (RF-UI-1,2).
- [ ] Configurar Tailwind + shadcn/ui con los tokens (RF-UI-1).
- [ ] Layout responsive (header/footer/nav móvil) (RF-UI-3,4).
- [ ] Componentes de catálogo y producto (RF-UI-4,7).
- [ ] Componentes de carrito y checkout (RF-UI-4).
- [ ] Componentes de cuenta (RF-UI-4).
- [ ] Estados de UI (carga/vacío/error/éxito) (RF-UI-6).
- [ ] Accesibilidad básica + auditoría (RF-UI-5).
- [ ] Elementos de confianza (sellos/garantías/contacto) (RF-UI-8).
- [ ] Documentación de componentes (RF-UI-11).

## 5. Orden de trabajo y dependencias
**Va en paralelo** al backend (decisión de arquitectura: frontend al final o en paralelo). Secuencia: tokens + setup → layout → componentes de catálogo/producto → carrito/checkout → cuenta → estados/accesibilidad/confianza → documentación.
Es **dependencia visual** de los módulos 01–04, 08 y 11.

## 6. Estrategia de pruebas
- **Responsive:** verificación en breakpoints móvil/tablet/escritorio de las páginas clave.
- **Accesibilidad:** auditoría (axe/Lighthouse) — contraste, foco, teclado, etiquetas.
- **Rendimiento:** Core Web Vitals (coord. módulo 11).
- **Aceptación de marca:** el dueño valida la identidad visual.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Branding tardío | Retrabajo visual | Tokens centralizados → cambiar marca sin reescribir componentes; identidad base provisional. |
| Accesibilidad como "extra" | Excluir usuarios / retrabajo | Usar shadcn/Radix (accesible de base) y auditar temprano. |
| Inconsistencia de estilos | Imagen poco profesional | Un único sistema de componentes; prohibido estilo ad-hoc. |
| Rendimiento por imágenes pesadas | Mala UX móvil | next/image + CDN + tamaños responsivos. |

## 8. Definición de "hecho"
- [ ] RF-UI "Debe" cumplidos y criterios de aceptación verdes.
- [ ] Sistema de diseño con branding aplicado y documentado.
- [ ] Páginas clave responsive en móvil/tablet/escritorio.
- [ ] Auditoría de accesibilidad sin issues críticos.
- [ ] Estados de UI e imágenes optimizadas en su lugar.
- [ ] El dueño valida que refleja su marca.
