# Arquitectura del Proyecto

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Runtime | Node.js | ≥ 18.16.0 |
| Framework | AdonisJS | 6.x |
| Lenguaje | TypeScript | 5.8 |
| ORM | Lucid (AdonisJS) | 21.x |
| Base de datos | PostgreSQL (Neon serverless) | 16 |
| Autenticación | Access Tokens (`DbAccessTokensProvider`) | — |
| Validación | VineJS | 3.x |
| Hashing | Argon2 (via `@adonisjs/core/services/hash`) | — |

## Estructura de carpetas

```
backlog_sena_backend/
├── app/
│   ├── controllers/
│   │   └── auth_controller.ts        # Login, logout, me
│   ├── middleware/
│   │   ├── auth_middleware.ts         # 401 si no hay token válido
│   │   ├── role_middleware.ts         # 403 si el rol no está permitido
│   │   ├── container_bindings_middleware.ts
│   │   └── force_json_response_middleware.ts
│   └── models/
│       ├── usuario.ts
│       ├── role.ts
│       ├── ficha.ts
│       ├── instructor_ficha.ts
│       ├── proyecto.ts
│       ├── epica.ts
│       ├── historia.ts
│       └── tarea.ts
├── config/
│   ├── auth.ts                        # Guard api → Access Tokens → modelo Usuario
│   ├── cors.ts
│   └── database.ts                    # PostgreSQL + SSL para Neon
├── database/
│   ├── migrations/                    # 13 migraciones ordenadas cronológicamente
│   └── seeders/
│       ├── role_seeder.ts
│       ├── ficha_seeder.ts
│       └── usuario_seeder.ts
├── docs/                              # Esta carpeta
├── start/
│   ├── env.ts                         # Validación de variables de entorno
│   ├── kernel.ts                      # Middleware global + middleware nombrado
│   └── routes.ts                      # Definición de rutas
├── .env                               # Variables de entorno (no versionado)
├── .env.example
├── adonisrc.ts
└── package.json
```

## Flujo de una petición HTTP

```
Cliente
  │
  ▼
server.use() — middleware global (orden de ejecución):
  1. ContainerBindingsMiddleware   — vincula servicios al contenedor IoC
  2. ForceJsonResponseMiddleware   — fuerza Content-Type: application/json
  3. CorsMiddleware                — cabeceras CORS
  4. InitializeAuthMiddleware      — inicializa ctx.auth (necesario para guards)
  │
  ▼
router.use() — middleware de router:
  5. BodyParserMiddleware          — parsea JSON body
  │
  ▼
Middleware nombrado (solo rutas protegidas):
  6. AuthMiddleware                — valida Bearer token, retorna 401 si inválido
  7. RoleMiddleware (opcional)     — valida rol del usuario, retorna 403 si no autorizado
  │
  ▼
Controller → respuesta JSON
```

## Convenciones de código

- Nombres de tablas en PostgreSQL: `snake_case` plural (ej. `instructor_ficha`)
- Propiedades en modelos Lucid: `camelCase` (ej. `fichaId`, `passwordHash`)
- Lucid mapea automáticamente `camelCase` ↔ `snake_case`
- Relaciones `belongsTo`: FK explícita cuando el nombre del modelo no coincide con el nombre de la columna (ej. `{ foreignKey: 'rolId' }` porque el modelo se llama `Role` pero la columna es `rol_id`)
- Mensajes de error en español, campo `mensaje` (sin `e`)
- Respuestas de éxito: `response.ok()` (200) con objeto JSON

## Autenticación

El sistema usa **Access Tokens** de AdonisJS Auth:

1. `POST /auth/login` → valida credenciales contra tabla `usuarios`, crea token en `auth_access_tokens`
2. Rutas protegidas → cliente envía `Authorization: Bearer <token>`
3. `AuthMiddleware` → llama `ctx.auth.use('api').authenticate()` que verifica el token en la tabla
4. `DELETE /auth/logout` → invalida el token actual (`auth.use('api').invalidateToken()`)

El modelo `Usuario` (tabla `usuarios`) es el tokenable, no el modelo `User` (tabla `users`).
