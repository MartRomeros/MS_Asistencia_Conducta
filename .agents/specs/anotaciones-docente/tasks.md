# Tasks: Registro y visualizacion de anotaciones por docente creador

## Task 1: Crear schemas de anotaciones
- Objetivo: validar entrada de registro y filtros de listado.
- Archivos esperados: `src/schemas/anotaciones.schema.ts`.
- Tests requeridos: validar body correcto, rechazo de campos extra, rechazo de tipo invalido, paginacion fuera de rango.
- Criterio de finalizacion: schemas exportan tipos TypeScript y son compatibles con `validate.middleware.ts`.

## Task 2: Crear repository de anotaciones
- Objetivo: encapsular queries SQL para crear, listar y validar acceso.
- Archivos esperados: `src/models/anotaciones.repository.ts`.
- Tests requeridos: si hay tests unitarios con mocks, cubrir parametros de queries principales; si no, cubrir desde integracion.
- Criterio de finalizacion: repository expone funciones para crear anotacion, listar por docente, contar resultados, verificar estudiante activo y verificar acceso docente-estudiante.

## Task 3: Crear service de anotaciones
- Objetivo: aplicar reglas de negocio sin depender de Express.
- Archivos esperados: `src/services/anotaciones.service.ts`.
- Tests requeridos: estudiante inexistente, estudiante fuera de cursos del docente, creacion exitosa, listado forzado por docente.
- Criterio de finalizacion: service nunca acepta `docente_id` desde cliente; siempre lo recibe desde el caller autenticado.

## Task 4: Crear controller de anotaciones
- Objetivo: manejar requests/responses HTTP y validar JWT docente.
- Archivos esperados: `src/controllers/anotaciones.controller.ts`.
- Tests requeridos: 401 sin token, 403 rol no docente, 201 registro exitoso, 200 listado exitoso.
- Criterio de finalizacion: respuestas mantienen formato `{ success, data/message/meta }`.

## Task 5: Crear rutas y Swagger
- Objetivo: exponer `POST /api/anotaciones` y `GET /api/anotaciones`.
- Archivos esperados: `src/routes/anotaciones.routes.ts`, `src/app.ts`.
- Tests requeridos: endpoints disponibles bajo `/api/anotaciones`.
- Criterio de finalizacion: Swagger documenta headers, body, query params, respuestas y security bearer.

## Task 6: Agregar tests de integracion
- Objetivo: cubrir comportamiento observable de la API.
- Archivos esperados: `src/tests/anotaciones.test.ts` o equivalente segun convencion del repo.
- Tests requeridos: registro exitoso, listado por ownership, filtros, errores 400/401/403/404.
- Criterio de finalizacion: `npm test` pasa.

## Task 7: Validacion final
- Objetivo: confirmar que la funcionalidad no rompe el microservicio.
- Archivos esperados: sin archivos nuevos salvo ajustes necesarios.
- Tests requeridos: `npm run build` y `npm test`.
- Criterio de finalizacion: build y tests pasan; no hay cambios fuera del alcance del spec.
