# Spec-001: Obtención de Cursos por Docente

## 🎯 Objetivo
Implementar un endpoint que permita a un docente autenticado obtener la lista de cursos y asignaturas que tiene asignados.

## 🛠️ Requerimientos Técnicos (Basado en @rules)

### 1. Gestión de Identidad (JWT)
- Crear un servicio en `src/services/jwt.service.ts` para la decodificación y validación de tokens.
- Utilizar la clave `JWT_SECRET` definida en el entorno.
- **Validación Zod**: El payload del token debe ser validado con un esquema Zod para asegurar que contiene un `docente_id` válido.

### 2. Capa de Datos (Model/Repository)
- Implementar la consulta en `src/models/cursos.repository.ts`.
- La consulta debe realizar un JOIN entre `curso_asignatura_docente`, `cursos` y `asignaturas` para obtener:
    - ID del curso, Nivel, Letra, Año Académico.
    - Nombre y Siglas de la asignatura.
    - ID de la relación (CAD ID).

### 3. Lógica de Negocio (Service)
- Crear `src/services/cursos.service.ts` para orquestar la obtención de datos.
- Debe ser una capa pura, sin conocimiento de la petición HTTP.

### 4. Controlador y Rutas (Express v5)
- Controlador en `src/controllers/cursos.controller.ts`.
- **Express 5 Standard**: No utilizar bloques `try/catch` repetitivos. Aprovechar el manejo nativo de promesas de Express v5.
- Ruta: `GET /api/docentes/cursos`.
- Middleware: Validar la presencia del header `Authorization: Bearer <token>`.

### 5. Documentación
- Documentar el endpoint utilizando Swagger JSDoc en el archivo de rutas.
- Incluir modelos de respuesta exitosa (200) y errores comunes (401, 500).

---

---

## ✅ Realizado — feature/cursos-por-docente (Refactorizado según @rules)

### Archivos creados / modificados

| Archivo | Rol |
|---|---|
| `src/services/jwt.service.ts` | Servicio JWT con **validación Zod** del payload. |
| `src/models/cursos.repository.ts` | Repositorio de datos con consulta SQL optimizada. |
| `src/services/cursos.service.ts` | Capa de negocio pura. |
| `src/controllers/cursos.controller.ts` | Controlador **Express v5** (sin try/catch). |
| `src/middlewares/error.middleware.ts` | Middleware global de errores para Zod y JWT. |
| `src/routes/docentes.routes.ts` | Router + Documentación Swagger JSDoc. |
| `src/app.ts` | Registro del router y middleware de errores. |

### Justificación de cumplimiento de @rules

**1. Express v5 (Manejo Nativo de Promesas)**
Se eliminaron los bloques `try/catch` de los controladores. Al usar Express 5, cualquier error en una función async es capturado automáticamente y enviado al middleware de errores global, manteniendo el código limpio y enfocado en la lógica.

**2. Validación Robusta con Zod**
No solo se tipó el payload del JWT con TypeScript, sino que se implementó un `jwtPayloadSchema` en Zod para validar en tiempo de ejecución que el token contenga un `docente_id` entero y positivo.

**3. Gestión Global de Errores**
Se implementó `errorMiddleware` para centralizar la respuesta ante fallos de validación (400), fallos de autenticación (401) y errores internos (500), garantizando un formato de respuesta consistente.

**4. Arquitectura de Capas y Swagger**
Se mantuvo la separación estricta de responsabilidades y se documentó el endpoint bajo el estándar OpenAPI 3.0, incluyendo definiciones de seguridad BearerAuth.
