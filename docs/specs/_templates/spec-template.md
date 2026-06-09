# Spec — <Nombre del módulo>

- **ID módulo:** `<COD>` (ej. CAT)
- **Estado:** Borrador | En revisión | Aprobada | Implementada
- **MVP:** Sí / No (post-MVP)
- **Depende de:** <otros módulos>

## 1. Propósito
Una o dos frases: qué problema de negocio resuelve este módulo.

## 2. Actores involucrados
Lista de actores (ver [`00-vision-y-alcance.md`](../00-vision-y-alcance.md)) que interactúan con el módulo y en qué rol.

## 3. Historias de usuario
- Como **<actor>** quiero **<acción>** para **<beneficio>**.

## 4. Requisitos funcionales
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-<COD>-1 | … | Debe / Debería / Podría |

## 5. Reglas de negocio
Restricciones y lógica que el sistema debe respetar (validaciones, límites, cálculos).

## 6. Entidades de datos involucradas
Qué datos maneja (a nivel conceptual, no esquema SQL aún). Marca cuáles son **nativos de Medusa** y cuáles son **extensiones propias**.

## 7. Interfaces / puntos de integración
APIs (Store/Admin de Medusa), eventos, webhooks, servicios externos.

## 8. Criterios de aceptación
Condiciones verificables para considerar el requisito cumplido (referencian RF-…).

## 9. Fuera de alcance
Lo que este módulo explícitamente NO cubre.

## 10. Preguntas abiertas
Decisiones pendientes del negocio o técnicas.
