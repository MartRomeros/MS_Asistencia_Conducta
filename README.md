# Microservicio de Asistencia y Conducta

Microservicio construido con Node.js, Express y TypeScript, encargado de la gestión de **asistencia**, **anotaciones (conducta)**, **cursos** y **docentes**. Utiliza PostgreSQL como almacenamiento y valida la sesión del usuario mediante JWT (el token es emitido por el microservicio de autenticación; este servicio solo lo verifica).

## Arquitectura y despliegue

Este proyecto se ejecuta como contenedor Docker y está pensado para vivir como **task de un servicio en AWS ECS sobre Fargate** (sin gestión de servidores/EC2). El pipeline de CI/CD (`.github/workflows/deploy.yaml`) corre los tests, construye la imagen Docker y la publica en Docker Hub (`ms-asistencia`) en cada push a `master`; desde ahí ECS toma la nueva imagen para actualizar la task definition/servicio.

## Endpoints principales

| Ruta | Descripción |
| :--- | :--- |
| `GET /health` | Health check del servicio. |
| `GET /api-docs` | Documentación interactiva (Swagger UI). |
| `/api/docentes` | Endpoints relacionados a docentes (p. ej. cursos asignados al docente autenticado). |
| `/api/cursos` | Gestión de cursos. |
| `/api/asistencia` | Registro y consulta de asistencia. |
| `/api/anotaciones` | Registro y consulta de anotaciones de conducta. |

La mayoría de las rutas requieren el header `Authorization: Bearer <token>` y son validadas por el middleware `authenticate` (con soporte de autorización por rol vía `requireRole`).

## Dependencias de Producción

| Dependencia | Uso |
| :--- | :--- |
| **express** | Framework web para la creación de la API y manejo de rutas. |
| **pg** | Cliente de PostgreSQL para interactuar con la base de datos. |
| **jsonwebtoken** | Verificación de JSON Web Tokens para validar la sesión del docente. |
| **zod** | Validación de esquemas (payload del JWT, body/params de las peticiones). |
| **dotenv** | Carga de variables de entorno desde un archivo `.env`. |
| **cors** | Middleware para habilitar el intercambio de recursos de origen cruzado. |
| **helmet** | Middleware de seguridad que ayuda a proteger la app configurando varios encabezados HTTP. |
| **morgan** | Logger de solicitudes HTTP para el monitoreo en desarrollo. |
| **swagger-jsdoc** / **swagger-ui-express** | Generación y exposición de la documentación OpenAPI en `/api-docs`. |

## Dependencias de Desarrollo

| Dependencia | Uso |
| :--- | :--- |
| **typescript** | Lenguaje base que añade tipado estático a JavaScript. |
| **@types/* ** | Definiciones de tipos para las librerías de producción (node, express, pg, etc.). |
| **ts-node-dev** | Herramienta para ejecutar el proyecto en desarrollo con reinicio automático (hot-reload). |
| **rimraf** | Utilidad para eliminar carpetas (usada para limpiar el directorio `dist` antes de compilar). |
| **vitest** / **@vitest/coverage-v8** | Framework de testing y generación de reportes de cobertura. |
| **supertest** | Testing de endpoints HTTP a nivel de integración. |

## Scripts Disponibles

- `pnpm run dev`: Inicia el servidor en modo desarrollo con `ts-node-dev`.
- `pnpm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
- `pnpm start`: Inicia el servidor utilizando el código compilado en `dist`.
- `pnpm test`: Ejecuta los tests en modo watch con Vitest.
- `pnpm run test:run`: Ejecuta los tests una sola vez.
- `pnpm run test:coverage`: Ejecuta los tests generando reporte de cobertura.

## Configuración

Asegúrate de configurar las variables en el archivo `.env` antes de iniciar (ver `.env.example`):

```env
PORT=3001
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=asistencia_db
DB_SSL=false
JWT_SECRET=tu_secreto_para_jwt
```

## Docker

Este proyecto usa un build multi-stage con pnpm (ver `Dockerfile`).

Para construir la imagen:

```sh
docker build -t ms_asistencia .
```

Para levantar el contenedor:

```sh
docker run -d --name ms_asistencia -p 3001:3001 --network devops_default ms_asistencia
```

> En producción, esta misma imagen es la que se despliega como task de ECS Fargate; las variables de entorno anteriores deben configurarse en la task definition (directamente o vía Secrets Manager / Parameter Store).
