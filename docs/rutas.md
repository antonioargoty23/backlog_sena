# Rutas de la API

## Formato general

- Todas las respuestas son JSON (`Content-Type: application/json`)
- Base URL: `http://localhost:3333` (desarrollo)
- Rutas protegidas requieren cabecera: `Authorization: Bearer <token>`

---

## Rutas públicas

### `GET /`

Verificación de estado del servidor.

**Respuesta 200:**
```json
{ "status": "ok", "app": "Backlog Builder SENA API" }
```

---

### `POST /auth/login`

Inicia sesión y obtiene un token de acceso.

**Body:**
```json
{
  "email": "instructor@sena.edu.co",
  "password": "password123"
}
```

**Respuesta 200:**
```json
{
  "token": {
    "type": "Bearer",
    "name": null,
    "token": "oat_abc123...",
    "abilities": ["*"],
    "lastUsedAt": null,
    "expiresAt": "2026-06-10T00:00:00.000Z"
  },
  "usuario": {
    "id": 1,
    "nombre": "Instructor",
    "apellido": "Demo",
    "email": "instructor@sena.edu.co",
    "rolId": 1,
    "fichaId": null
  }
}
```

**Respuesta 401 (credenciales incorrectas o usuario inactivo):**
```json
{ "mensaje": "Credenciales inválidas" }
```

**Respuesta 422 (validación):**
```json
{
  "errors": [
    { "message": "...", "rule": "...", "field": "email" }
  ]
}
```

---

## Rutas protegidas (requieren `Authorization: Bearer <token>`)

### `DELETE /auth/logout`

Invalida el token actual.

**Respuesta 200:**
```json
{ "mensaje": "Sesión cerrada correctamente" }
```

**Respuesta 401 (sin token o token inválido):**
```json
{ "mensaje": "Token inválido o sesión expirada", "codigo": "UNAUTHORIZED" }
```

---

### `GET /auth/me`

Retorna el perfil del usuario autenticado con su rol y ficha.

**Respuesta 200:**
```json
{
  "usuario": {
    "id": 1,
    "rolId": 1,
    "fichaId": null,
    "nombre": "Instructor",
    "apellido": "Demo",
    "email": "instructor@sena.edu.co",
    "documento": "11111111",
    "activo": true,
    "ultimoAcceso": "2026-05-10T12:00:00.000Z",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-10T12:00:00.000Z",
    "rol": {
      "id": 1,
      "nombre": "instructor",
      "descripcion": "Instructor SENA",
      "activo": true,
      "createdAt": "..."
    },
    "ficha": null
  }
}
```

---

## Tabla resumen

| Método | Ruta | Pública | Middleware |
|--------|------|---------|------------|
| GET | `/` | Sí | — |
| POST | `/auth/login` | Sí | — |
| DELETE | `/auth/logout` | No | `auth` |
| GET | `/auth/me` | No | `auth` |

## Rutas futuras (pendientes de implementar)

Las siguientes rutas están documentadas en el código como ejemplos de uso del middleware de roles, pero aún no implementadas:

```typescript
// Solo instructores
router.group(() => {
  // ...
}).use([middleware.auth(), middleware.role(['instructor'])])

// Instructores o aprendices
router.group(() => {
  // ...
}).use([middleware.auth(), middleware.role(['instructor', 'aprendiz'])])
```

Las rutas CRUD para `proyectos`, `epicas`, `historias` y `tareas` están pendientes de implementación.
