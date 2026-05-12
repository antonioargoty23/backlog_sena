# Módulos del proyecto

## Controladores (`app/controllers/`)

### `auth_controller.ts`

Gestiona la autenticación de usuarios mediante Access Tokens.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `login` | `POST /auth/login` | Valida credenciales, crea token, actualiza `ultimo_acceso` |
| `logout` | `DELETE /auth/logout` | Invalida el token actual del usuario |
| `me` | `GET /auth/me` | Retorna el usuario autenticado con su rol y ficha |

**Validación de login** (VineJS):
- `email`: string, trim, formato email
- `password`: string, mínimo 1 carácter

**Respuesta de login exitoso:**
```json
{
  "token": {
    "type": "Bearer",
    "name": null,
    "token": "<token_string>",
    "abilities": ["*"],
    "lastUsedAt": null,
    "expiresAt": "2026-06-10T..."
  },
  "usuario": {
    "id": 1,
    "nombre": "...",
    "apellido": "...",
    "email": "...",
    "rolId": 1,
    "fichaId": null
  }
}
```

---

## Middleware (`app/middleware/`)

### `auth_middleware.ts`

- **Propósito:** Proteger rutas que requieren autenticación.
- **Mecanismo:** Llama `ctx.auth.use('api').authenticate()`. Si falla, responde 401.
- **Respuesta 401:**
```json
{ "mensaje": "Token inválido o sesión expirada", "codigo": "UNAUTHORIZED" }
```

### `role_middleware.ts`

- **Propósito:** Restringir rutas a roles específicos.
- **Mecanismo:** Lee el usuario autenticado desde `ctx.auth.use('api').user`, consulta su rol en la base de datos y verifica si está en la lista de roles permitidos.
- **Parámetro:** array de strings con nombres de roles (`allowedRoles: string[]`)
- **Respuesta 403:**
```json
{
  "mensaje": "No tienes permiso para acceder a este recurso",
  "codigo": "FORBIDDEN",
  "rolActual": "aprendiz",
  "rolesPermitidos": ["instructor"]
}
```

### `container_bindings_middleware.ts`

Generado por AdonisJS. Vincula servicios al contenedor IoC por petición.

### `force_json_response_middleware.ts`

Generado por AdonisJS. Fuerza `Content-Type: application/json` en todas las respuestas.

---

## Modelos (`app/models/`)

### `usuario.ts`
- Tabla: `usuarios`
- Auth: `DbAccessTokensProvider.forModel(Usuario)` — modelo tokenable principal
- Relaciones:
  - `belongsTo(Role, { foreignKey: 'rolId' })`
  - `belongsTo(Ficha)`
  - `hasMany(Proyecto, { foreignKey: 'liderId' })`

### `role.ts`
- Tabla: `roles`
- Sin `updatedAt` (la tabla no tiene esa columna)
- Relaciones: `hasMany(Usuario)`

### `ficha.ts`
- Tabla: `fichas`
- Fechas `fechaInicio` / `fechaFin` usan `@column.date()` (no `dateTime`)
- Relaciones: `hasMany(Usuario)`, `hasMany(Proyecto)`

### `instructor_ficha.ts`
- Tabla: `instructor_ficha`
- Sin timestamps automáticos (tiene `fechaAsignacion` como `@column.date()`)
- Relaciones: `belongsTo(Usuario, { foreignKey: 'instructorId' })`, `belongsTo(Ficha)`

### `proyecto.ts`
- Tabla: `proyectos`
- Relaciones: `belongsTo(Ficha)`, `belongsTo(Usuario, { foreignKey: 'liderId' })`, `hasMany(Epica)`

### `epica.ts`
- Tabla: `epicas`
- Relaciones: `belongsTo(Proyecto)`, `hasMany(Historia)`

### `historia.ts`
- Tabla: `historias`
- Tipos exportados: `PrioridadHistoria = 'Alta' | 'Media' | 'Baja'`, `EstadoHistoria = 'Por hacer' | 'En progreso' | 'Hecho'`
- Relaciones: `belongsTo(Epica)`, `hasMany(Tarea)`

### `tarea.ts`
- Tabla: `tareas`
- Tipos exportados: `TipoTarea = 'RF' | 'RNF' | 'RF/RNF'`, `PrioridadTarea = 'ALTA' | 'MEDIA' | 'BAJA'`
- Relaciones: `belongsTo(Historia)`

---

## Seeders (`database/seeders/`)

| Archivo | Datos que inserta |
|---------|-------------------|
| `role_seeder.ts` | Roles: `instructor`, `aprendiz`, `admin` |
| `ficha_seeder.ts` | Ficha `2758960` — Análisis y Desarrollo de Software |
| `usuario_seeder.ts` | Instructor Demo + Aprendiz Demo (password: `password123`) |

Todos los seeders son **idempotentes**: usan `ON CONFLICT DO NOTHING` vía `db.rawQuery()`.

---

## Configuración (`config/`)

| Archivo | Propósito |
|---------|-----------|
| `auth.ts` | Guard `api` con Access Tokens apuntando al modelo `Usuario` |
| `database.ts` | Conexión PostgreSQL con SSL para Neon |
| `cors.ts` | CORS habilitado para todos los orígenes, con credenciales |
