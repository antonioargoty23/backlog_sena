# API Rules

## Base URL

```
http://localhost:3333   (development)
```

## Request format

- All request bodies must be JSON
- Set header: `Content-Type: application/json`

## Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer oat_abc123...
```

Obtain a token by calling `POST /auth/login`. Tokens expire after **30 days**. Revoke a token with `DELETE /auth/logout`.

## Response format

All responses are JSON. The top-level key varies by endpoint, but error responses follow a consistent shape.

### Success (2xx)

```json
{ "token": { ... }, "usuario": { ... } }
{ "mensaje": "Sesión cerrada correctamente" }
{ "usuario": { ... } }
```

### Validation error (422)

Returned by VineJS when the request body fails schema validation.

```json
{
  "errors": [
    {
      "message": "The email field must be a valid email address",
      "rule": "email",
      "field": "email"
    }
  ]
}
```

### Unauthorized (401)

Returned by `AuthMiddleware` when no token is provided or the token is invalid/expired.

```json
{
  "mensaje": "Token inválido o sesión expirada",
  "codigo": "UNAUTHORIZED"
}
```

### Forbidden (403)

Returned by `RoleMiddleware` when the authenticated user's role is not in the allowed list.

```json
{
  "mensaje": "No tienes permiso para acceder a este recurso",
  "codigo": "FORBIDDEN",
  "rolActual": "aprendiz",
  "rolesPermitidos": ["instructor"]
}
```

### Invalid credentials (401)

Returned by `POST /auth/login` when the email is not found, the user is inactive, or the password is wrong. Both cases return the same message to avoid user enumeration.

```json
{ "mensaje": "Credenciales inválidas" }
```

## HTTP status codes used

| Code | Meaning |
|------|---------|
| 200 | OK — request succeeded |
| 401 | Unauthorized — missing or invalid token, or bad credentials |
| 403 | Forbidden — authenticated but not authorized by role |
| 422 | Unprocessable Entity — validation failed |

## Example: full login flow

**1. Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "instructor@sena.edu.co",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": {
    "type": "Bearer",
    "token": "oat_abc123...",
    "expiresAt": "2026-06-10T00:00:00.000Z"
  },
  "usuario": {
    "id": 1,
    "nombre": "Instructor",
    "rolId": 1
  }
}
```

**2. Authenticated request**
```http
GET /auth/me
Authorization: Bearer oat_abc123...
```

**3. Logout**
```http
DELETE /auth/logout
Authorization: Bearer oat_abc123...
```

## CORS

CORS is enabled for all origins with credentials support. Allowed methods: `GET`, `HEAD`, `POST`, `PUT`, `DELETE`. This is configured in `config/cors.ts` and can be restricted to specific origins in production.
