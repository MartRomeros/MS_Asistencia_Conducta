- Genera la logica para que segun el id del curso te traiga los alumnos
- el id se debe rescatar la siguiente manera por ej: api/some/curso/1, donde 1 es el id del curso
- el endpoint presentado fue de ejemplo, en la realidad debe ser acorde al `contexto` del proyecto
- Genera la documentacion en swagger

---

### Implementación y Justificación (Realizado por Gemini)

**1. Rama de desarrollo**
- Se creó y utilizó la rama `feature/spec-002-get-students-by-course` según el flujo definido en `/do_spec`.

**2. Contexto y Rutas**
- Basado en el `contexto` del proyecto (`script.sql.md` y estructura de la API), el endpoint real elegido es `GET /api/cursos/:id/alumnos`.
- Se creó el archivo `src/routes/cursos.routes.ts` que monta la ruta, y se integró en `src/app.ts` bajo el path `/api/cursos`.

**3. Controlador (`cursos.controller.ts`)**
- Se implementó la función `getAlumnosCurso` para manejar la petición HTTP. Esta función:
  - Valida el token JWT del usuario utilizando `jwt.service.ts` para extraer la identidad.
  - Comprueba que el usuario que accede tenga el rol `"Docente"` para asegurar control de acceso.
  - Verifica y transforma el parámetro `id` de la URL al tipo numérico (cursoId).

**4. Servicio y Repositorio (`cursos.service.ts` y `cursos.repository.ts`)**
- En el servicio se añadió `getAlumnosDelCurso(cursoId)`, que se encarga de orquestar la llamada a la base de datos.
- En el repositorio se añadió la query SQL en la función `getAlumnosByCurso(cursoId)`. Esta query realiza un `INNER JOIN` entre la tabla `estudiantes` y `usuarios` para obtener el perfil completo del alumno asegurando que la cuenta esté activa (`u.activo = true`).

**5. Swagger**
- En el mismo archivo `cursos.routes.ts` se generó la documentación con `@openapi` para el endpoint, especificando respuestas, códigos HTTP (200, 400, 401, 403, 500), y definiendo el schema `Alumno`.