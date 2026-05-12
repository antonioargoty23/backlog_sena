# Modules

## Controllers

### `AuthController` (`app/controllers/auth_controller.ts`)

Handles all authentication endpoints.

| Action | Method | Route | Auth required |
|--------|--------|-------|--------------|
| `login` | POST | `/auth/login` | No |
| `logout` | DELETE | `/auth/logout` | Yes |
| `me` | GET | `/auth/me` | Yes |

Login validates input with a compiled VineJS schema (`email` + `password`). On success it returns `token.toJSON()` and a subset of the user record. The token has a 30-day expiry.

---

## Middleware

### `AuthMiddleware` (`app/middleware/auth_middleware.ts`)

Wraps `ctx.auth.use('api').authenticate()` in a try/catch. Returns HTTP 401 on any failure.

```json
{ "mensaje": "Token inválido o sesión expirada", "codigo": "UNAUTHORIZED" }
```

### `RoleMiddleware` (`app/middleware/role_middleware.ts`)

Accepts an `allowedRoles: string[]` parameter. After the user is authenticated, it loads the user's role from the database and checks membership. Returns HTTP 403 if the role is not in the allowed list.

```json
{
  "mensaje": "No tienes permiso para acceder a este recurso",
  "codigo": "FORBIDDEN",
  "rolActual": "aprendiz",
  "rolesPermitidos": ["instructor"]
}
```

Usage in routes:
```typescript
.use([middleware.auth(), middleware.role(['instructor'])])
.use([middleware.auth(), middleware.role(['instructor', 'aprendiz'])])
```

---

## Models

### `Usuario` (`app/models/usuario.ts`)
- Table: `usuarios`
- The tokenable model for authentication
- Relationships: `rol` (BelongsTo Role), `ficha` (BelongsTo Ficha), `proyectos` (HasMany Proyecto)
- Note: FK for `rol` must be explicit — `{ foreignKey: 'rolId' }` — because Lucid would otherwise infer `roleId`

### `Role` (`app/models/role.ts`)
- Table: `roles`
- No `updatedAt` column
- Relationships: `usuarios` (HasMany Usuario)

### `Ficha` (`app/models/ficha.ts`)
- Table: `fichas`
- `fechaInicio` and `fechaFin` use `@column.date()` (date only, no time)
- Relationships: `usuarios` (HasMany Usuario), `proyectos` (HasMany Proyecto)

### `InstructorFicha` (`app/models/instructor_ficha.ts`)
- Table: `instructor_ficha`
- No auto-timestamps; has `fechaAsignacion` as `@column.date()`
- Relationships: `instructor` (BelongsTo Usuario), `ficha` (BelongsTo Ficha)

### `Proyecto` (`app/models/proyecto.ts`)
- Table: `proyectos`
- Relationships: `ficha` (BelongsTo Ficha), `lider` (BelongsTo Usuario, FK `liderId`), `epicas` (HasMany Epica)

### `Epica` (`app/models/epica.ts`)
- Table: `epicas`
- Relationships: `proyecto` (BelongsTo Proyecto), `historias` (HasMany Historia)

### `Historia` (`app/models/historia.ts`)
- Table: `historias`
- Exports: `PrioridadHistoria` union type, `EstadoHistoria` union type
- Relationships: `epica` (BelongsTo Epica), `tareas` (HasMany Tarea)

### `Tarea` (`app/models/tarea.ts`)
- Table: `tareas`
- Exports: `TipoTarea` union type, `PrioridadTarea` union type
- Relationships: `historia` (BelongsTo Historia)

---

## Seeders

| File | Inserts | Idempotent |
|------|---------|-----------|
| `role_seeder.ts` | 3 roles | Yes — `ON CONFLICT (nombre) DO NOTHING` |
| `ficha_seeder.ts` | 1 ficha (code `2758960`) | Yes — `ON CONFLICT (codigo) DO NOTHING` |
| `usuario_seeder.ts` | 2 users (instructor + aprendiz) | Yes — `ON CONFLICT (email) DO NOTHING` |

Run order matters: `role_seeder` and `ficha_seeder` must run before `usuario_seeder` because it queries their IDs dynamically.
