---
trigger: always_on
---

Este microservicio se trata sobre la gestion de asistencia y conducta

## 🚀 Tecnologías y Dependencias

A continuación se detallan las dependencias principales del proyecto y su justificación técnica:

### Dependencias de Producción

| Dependencia | Propósito | Justificación Técnica |
| :--- | :--- | :--- |
| **express (v5.2.1)** | Framework Web | Versión más reciente que soporta de forma nativa la gestión de promesas en los controladores, eliminando la necesidad de bloques `try/catch` repetitivos o envoltorios para errores asíncronos. |
| **typescript** | Tipado Estático | Garantiza la integridad del código, reduce errores en tiempo de ejecución y mejora la productividad mediante el autocompletado y la documentación en tiempo real. |
| **pg (node-postgres)** | Cliente Base de Datos | Cliente oficial y eficiente para PostgreSQL. Permite la gestión de pools de conexión, fundamental para el rendimiento en microservicios. |
| **zod** | Validación de Esquemas | Librería de declaración y validación de esquemas con inferencia de tipos de TypeScript de primera clase. Se utiliza para validar cuerpos de peticiones (Body), parámetros y entornos. |
| **jsonwebtoken (JWT)** | Autenticación | Estándar de la industria para la creación de tokens de acceso seguros y sin estado (stateless), permitiendo la escalabilidad horizontal. |
| **bcrypt** | Seguridad de Contraseñas | Implementa hashing de contraseñas con sal (salt), protegiendo las credenciales de los usuarios contra ataques de fuerza bruta y tablas de arcoíris. |
| **helmet** | Seguridad HTTP | Middleware que ayuda a proteger la aplicación configurando varios encabezados HTTP de seguridad (XSS protection, Content Security Policy, etc.). |
| **cors** | Gestión de Recursos | Habilita el Intercambio de Recursos de Origen Cruzado (CORS), necesario para permitir que clientes (Frontend) desde otros dominios consuman la API. |
| **serverless-http** | Adaptador Serverless | Permite envolver la aplicación Express para que pueda ejecutarse en AWS Lambda sin modificar la lógica central del microservicio. |
| **swagger-jsdoc / ui** | Documentación API | Genera documentación interactiva basada en el estándar OpenAPI (Swagger), facilitando la integración con otros equipos y el testing manual. |
| **morgan** | Logging | Logger de peticiones HTTP para el desarrollo y monitoreo de las interacciones con la API. |
| **dotenv** | Configuración | Carga variables de entorno desde un archivo `.env` para separar la configuración del código fuente (siguiendo los principios de *The Twelve-Factor App*). |

### Dependencias de Desarrollo

*   **vitest**: Framework de testing moderno y extremadamente rápido, compatible con el ecosistema de TypeScript.
*   **supertest**: Utilizado para realizar tests de integración de los endpoints HTTP.
*   **ts-node-dev**: Herramienta de desarrollo que reinicia el servidor automáticamente tras cambios en el código TypeScript.
*   **rimraf**: Utilidad para limpiar el directorio de compilación (`dist`) de forma multiplataforma.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura de capas para asegurar la separación de responsabilidades y facilitar el mantenimiento:

```text
src/
├── app.ts              # Configuración central de Express y Middlewares
├── index.ts            # Punto de entrada (Servidor local y Handler Lambda)
├── config/             # Configuraciones de DB, Swagger y entorno
├── controllers/        # Controladores de tráfico (Orquestan Req/Res)
├── services/           # Lógica de negocio (Capa pura de procesos)
├── models/             # Interacción con la base de datos (Data Access)
├── middlewares/        # Filtros de seguridad.
├── schemas/            # Definiciones de esquemas Zod (Validación de datos)
├── routes/             # Definición de rutas y documentación OpenAPI
├── utils/              # Funciones de ayuda (JWT, Bcrypt, Helpers)
└── tests/              # Tests unitarios y de integración
```

## Consideraciones

- Antes de ejecutar un spec dentro de la carpeta `specs/` es necesario echar un vistazo a la carpeta `context/` para saber que se esta construyendo.

- No instalar dependencias sin preguntar primero.

- Siempre despues terminar un spec, abajo de este se debe indicar lo realizado con su justificacion

- Cuando estes creando las funcionalidades separar las cosas por carpetas y dentro de estas por archivos

- Utilizar las skills necesarias para lograr la tarea

- Cada vez que implementes nuevas funcionalidades deberas crear una rama para esa funcionalidad
al terminar no debes hacer un merge sino una pull requests

- Esto microservicio estara en un lambda de aws, esta lambda usara una imagen de este# Microservicio de Autenticación (ms_authentication)
