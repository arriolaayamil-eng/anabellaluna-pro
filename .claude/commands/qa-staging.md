Ejecutá el ciclo completo de QA en staging siguiendo esta secuencia sin pausas ni preguntas:

**FASE 0 — Reconocimiento**
Leé el proyecto: variables de entorno de staging, últimos 20 commits, estructura de directorios, stack tecnológico de cada módulo (sitio/ERP/CRM). Identificá las URLs de staging de los 3 sistemas. Si no están en .env.staging, buscalas en docker-compose, configs de nginx, o cualquier archivo de configuración.

**FASE 1 — Tests de código en paralelo**
Lanzá simultáneamente:
- @agent-qa-site para testear el sitio
- @agent-qa-erp para testear el ERP
- @agent-qa-crm para testear el CRM
- @agent-qa-integration para testear integraciones entre los tres módulos

Esperá que los 4 terminen y consolidá sus reportes.

**FASE 2 — Tests de UI con browser real**
Usá Playwright MCP para navegar y testear cada sistema:
1. Sitio: home, rutas principales, formulario de cotización/contacto, login
2. ERP: login, dashboard, crear orden/cotización de prueba, inventario
3. CRM: login, pipeline de leads, reportes
4. Flujo E2E crítico: completá formulario sitio → verificá en CRM → verificá en ERP
Screenshots en cada paso importante.

**FASE 3 — Aplicá fixes**
Por cada issue encontrado:
- Si podés fixearlo (config, env var, código menor): fixealo, documentá exactamente (archivo + línea), re-testá
- Si no: marcalo BLOQUEANTE, no lo toques

**FASE 4 — Reporte final**
Generá `qa-reports/staging-report-[fecha-hora].md` con:
- Estado: LISTO PARA PRODUCCIÓN o BLOQUEADO + razón
- Tabla de correcciones aplicadas
- Issues bloqueantes con qué se necesita para resolverlos
- Checklist diferencias staging vs producción antes del deploy
- Screenshots listados como evidencia

No me preguntes nada. Si hay ambigüedad, tomá la decisión más conservadora. Al final listá las decisiones autónomas para que yo las revise.
