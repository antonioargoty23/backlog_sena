# Roles and Permissions

## Roles

The system has three roles, stored in the `roles` table:

| Role | Description |
|------|-------------|
| `instructor` | SENA instructor — creates and manages projects, assigns students |
| `aprendiz` | SENA student — works on assigned projects and tasks |
| `admin` | System administrator — full access |

A user's role is stored as a FK (`rol_id`) in the `usuarios` table.

## Current route permissions

| Method | Route | Auth | Roles |
|--------|-------|------|-------|
| GET | `/` | No | Any |
| POST | `/auth/login` | No | Any |
| DELETE | `/auth/logout` | Yes | Any authenticated |
| GET | `/auth/me` | Yes | Any authenticated |

Currently no routes are restricted by role — the role system is implemented and ready but not yet applied to any routes beyond authentication.

## How role middleware works

The `RoleMiddleware` (`app/middleware/role_middleware.ts`) is a named middleware registered in `start/kernel.ts`:

```typescript
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  role: () => import('#middleware/role_middleware'),
})
```

Apply it to a route group:

```typescript
// Single role
router.group(() => {
  router.post('/projects', [ProjectController, 'store'])
}).use([middleware.auth(), middleware.role(['instructor'])])

// Multiple roles
router.group(() => {
  router.get('/projects', [ProjectController, 'index'])
}).use([middleware.auth(), middleware.role(['instructor', 'aprendiz'])])
```

The middleware receives `allowedRoles` as an array of role name strings. It queries `roles.nombre` from the database (not hardcoded IDs) so role names are the source of truth.

## Planned permissions (future)

Once CRUD routes for the domain entities are implemented, the expected permission model is:

| Action | instructor | aprendiz | admin |
|--------|-----------|---------|-------|
| Create project | Yes | No | Yes |
| View project | Yes | Yes (own ficha) | Yes |
| Edit project | Yes (own) | No | Yes |
| Create epic / story | Yes | No | Yes |
| View epic / story | Yes | Yes | Yes |
| Update task status | Yes | Yes (assigned) | Yes |
| Approve task | Yes | No | Yes |
| Manage users | No | No | Yes |
| Manage fichas | No | No | Yes |

> This table reflects intended design, not implemented routes.

## Role check implementation detail

The middleware does NOT rely on the `rolId` already loaded on `ctx.auth.user`. Instead it issues a fresh query:

```typescript
const usuario = await Usuario.query()
  .where('id', user.id)
  .preload('rol')
  .firstOrFail()

if (!allowedRoles.includes(usuario.rol.nombre)) {
  return response.forbidden({ ... })
}
```

This ensures the role name is always fresh from the database, not a stale value from the token payload.
