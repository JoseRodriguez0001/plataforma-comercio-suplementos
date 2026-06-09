# Plan de implementación — Panel de administración

- **Spec asociada:** [`spec.md`](spec.md)
- **Estado:**   Aprobado

## 1. Enfoque general
Medusa v2 **ya entrega un Admin Dashboard completo en React** sobre las Admin APIs de todos sus módulos: catálogo, inventario, órdenes, clientes, promociones, envío, pagos, impuestos y usuarios admin. La estrategia es **adoptar ese panel nativo** (cubre la mayoría de RF-ADM de fábrica) y **extenderlo con widgets/UI routes** solo para lo custom de este negocio: atributos de suplemento, campos de cumplimiento manual, umbral de stock/vencimiento, configuración de zonas de Panamá y, si hace falta, un dashboard de métricas básicas. Esto maximiza la autonomía del dueño con mínimo desarrollo.

## 2. Primitivas de Medusa usadas
- **Admin Dashboard nativo** + **Admin API**: gestión de todos los módulos.
- **Admin Extensions:** *widgets* (inyectar UI en páginas existentes) y *UI routes* (páginas nuevas) para lo custom.
- **User Module (admin):** usuarios administradores y login de admin.
- **Settings nativos:** regiones, impuestos, envío, pagos, promociones.

## 3. Extensiones propias
- **Widget de atributos de suplemento** en la página de producto (módulo 01).
- **Widget de cumplimiento manual** en la página de orden (módulo 06).
- **Configuración de umbral de stock bajo / vencimiento** (módulo 07).
- **Configuración de zonas de envío Panamá** (si el setting nativo no basta) (módulo 04).
- **Dashboard de métricas básicas** (ventas del período, órdenes por estado, alertas) si lo nativo no alcanza (RF-ADM-10).
- **Auditoría básica** de acciones sensibles (RF-ADM-12).
- **Localización a español** del panel (RF-ADM-14) según soporte nativo.

## 4. Desglose de tareas
- [ ] Verificar Admin nativo: catálogo, inventario, órdenes, clientes, promociones, envío, pagos, impuestos (RF-ADM-2..9).
- [ ] Login/usuarios admin separado del de clientes (RF-ADM-1).
- [ ] Widgets/UI routes custom (atributos suplemento, cumplimiento, umbrales, zonas) (RF-ADM-2,3,4,7).
- [ ] Dashboard de métricas básicas (RF-ADM-10).
- [ ] Auditoría de acciones sensibles (RF-ADM-12).
- [ ] Verificar/ajustar idioma español del panel (RF-ADM-14).
- [ ] Validar usabilidad responsive del admin (RF-ADM-13).

## 5. Orden de trabajo y dependencias
Transversal a casi todos los módulos: cada widget custom acompaña a su módulo (01/04/06/07). Secuencia: adoptar admin nativo + login → widgets custom conforme avanzan sus módulos → dashboard de métricas → auditoría → idioma/responsive.
Es la **interfaz operativa** que valida la autonomía del dueño en pruebas de aceptación de cada módulo.

## 6. Estrategia de pruebas
- **Aceptación con el dueño (clave):** que el dueño realice las tareas críticas (crear producto, ajustar stock, operar una orden, crear cupón, configurar envío) **sin ayuda**.
- **Integración:** cambios en el admin se reflejan en storefront e índice de búsqueda.
- **Seguridad:** admin inaccesible sin credenciales de administrador; acciones sensibles auditadas.

## 7. Riesgos y mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Idioma del panel no 100% en español | Fricción para el dueño | Verificar soporte i18n del admin; complementar etiquetas custom en español. |
| Dashboard nativo insuficiente | Falta visibilidad | Construir vista de métricas básicas a medida solo si hace falta. |
| Curva del dueño con el panel | Baja autonomía | Pruebas de aceptación con el dueño + guía rápida; ajustar widgets a su flujo real. |
| Sobre-personalizar el admin | Costo/mantenimiento | Mantener lo nativo; extender solo lo imprescindible. |

## 8. Definición de "hecho"
- [ ] RF-ADM "Debe" cumplidos y criterios de aceptación verdes.
- [ ] El dueño completa las tareas críticas en el admin sin ayuda técnica.
- [ ] Widgets custom (suplemento, cumplimiento, umbrales, zonas) operativos.
- [ ] Dashboard de métricas básicas disponible.
- [ ] Panel en español y usable en tablet/móvil.
- [ ] Acciones sensibles auditadas.
