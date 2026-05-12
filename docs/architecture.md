# Architecture

## Overview

Backlog Builder SENA API is a RESTful JSON API built with AdonisJS 6. It manages project backlogs for SENA (Colombian vocational training institution), organizing work across fichas (training cohorts), projects, epics, user stories, and tasks.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ≥ 18.16.0 |
| Framework | AdonisJS | 6.x |
| Language | TypeScript | 5.8 (ESM) |
| ORM | Lucid (AdonisJS) | 21.x |
| Database | PostgreSQL 16 (Neon serverless) | — |
| Auth | Access Tokens (`DbAccessTokensProvider`) | — |
| Validation | VineJS | 3.x |
| Password hashing | Argon2 | via `@adonisjs/core/services/hash` |

## Project Layout

```
app/
  controllers/     Route handlers (thin — delegate to models/services)
  middleware/      HTTP middleware (auth, role, cors, json)
  models/          Lucid ORM models with relationships
config/            Framework config (auth, cors, database)
database/
  migrations/      Ordered schema migrations (13 files)
  seeders/         Idempotent seed data
docs/              This documentation
start/
  env.ts           Environment variable schema and validation
  kernel.ts        Global + named middleware registration
  routes.ts        All route definitions
```

## Request Lifecycle

```
HTTP Request
    │
    ├─ ContainerBindingsMiddleware   (IoC bindings per request)
    ├─ ForceJsonResponseMiddleware   (forces JSON content-type)
    ├─ CorsMiddleware                (CORS headers)
    ├─ InitializeAuthMiddleware      (sets up ctx.auth)
    ├─ BodyParserMiddleware          (parses JSON body)
    │
    ├─ [protected routes only]
    │   ├─ AuthMiddleware            (validates Bearer token → 401)
    │   └─ RoleMiddleware            (checks role → 403)
    │
    └─ Controller method → JSON response
```

## Auth Flow

1. Client sends `POST /auth/login` with `{ email, password }`
2. Server queries `usuarios` table, verifies Argon2 hash
3. Server creates a token in `auth_access_tokens` (valid for 30 days)
4. Client stores the token and sends it as `Authorization: Bearer <token>` on subsequent requests
5. `AuthMiddleware` calls `ctx.auth.use('api').authenticate()` to validate
6. On `DELETE /auth/logout`, the token is invalidated in the database

The tokenable model is `Usuario` (table `usuarios`), not the AdonisJS-generated `User` model (table `users`).

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| PostgreSQL tables | `snake_case` plural | `instructor_ficha` |
| PostgreSQL columns | `snake_case` | `password_hash`, `rol_id` |
| Lucid model properties | `camelCase` | `passwordHash`, `rolId` |
| TypeScript types | `PascalCase` | `PrioridadHistoria` |
| Error messages | Spanish, field `mensaje` | `{ "mensaje": "..." }` |

Lucid automatically maps `camelCase` ↔ `snake_case` between model and database.

## Key Design Decisions

**Explicit foreign key on `belongsTo(Role)`** — Lucid infers FK from the related model name: `Role` → `roleId`. But the actual column is `rol_id` (mapped to `rolId`). Explicit `{ foreignKey: 'rolId' }` is required.

**Raw queries for seeders** — Lucid v21 does not expose `.onConflict()` on `insert()` or `multiInsert()`. Idempotent inserts use `db.rawQuery()` with PostgreSQL `ON CONFLICT (column) DO NOTHING`.

**`auth_access_tokens` FK fix** — AdonisJS auth kit generates the `auth_access_tokens` table with `tokenable_id` pointing to `users.id`. Since domain auth uses `usuarios`, a corrective migration drops the old FK and creates a new one pointing to `usuarios.id`.

**ESM imports in relationships** — Lucid relationship callbacks are lazy-evaluated, so standard top-level ESM imports work. No `require()` or dynamic `import()` needed inside callbacks.
