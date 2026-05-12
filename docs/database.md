# Database

## Connection

- **Engine:** PostgreSQL 16 (Neon serverless)
- **SSL:** required — `rejectUnauthorized: false` (Neon uses a self-signed chain)
- **Config file:** `config/database.ts`
- **Env vars:** `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL`

## Tables

### `roles`
Lookup table for user roles.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| nombre | varchar | UNIQUE |
| descripcion | text | nullable |
| activo | boolean | default true |
| created_at | timestamp | — |

Seed values: `instructor`, `aprendiz`, `admin`.

---

### `fichas`
A ficha is a SENA training cohort — a group of students enrolled in a program.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| codigo | varchar | UNIQUE |
| nombre | varchar | — |
| fecha_inicio | date | nullable |
| fecha_fin | date | nullable |
| activa | boolean | default true |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

---

### `usuarios`
Domain users (instructors, students, admins). This is the tokenable model for authentication.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| rol_id | integer | FK → roles.id RESTRICT |
| ficha_id | integer | nullable, FK → fichas.id SET NULL |
| nombre | varchar | — |
| apellido | varchar | — |
| email | varchar | UNIQUE |
| documento | varchar | UNIQUE |
| password_hash | varchar | Argon2 hash |
| activo | boolean | default true |
| ultimo_acceso | timestamp | nullable, updated on login |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

Indexes on: `rol_id`, `ficha_id`, `email`.

---

### `auth_access_tokens`
Stores API tokens. Managed automatically by `DbAccessTokensProvider`.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| tokenable_id | integer | FK → **usuarios**.id CASCADE |
| type | varchar | always `'bearer'` |
| name | varchar | nullable |
| hash | varchar | SHA-256 hash of the token |
| abilities | text | JSON array (e.g. `["*"]`) |
| created_at | timestamp | nullable |
| updated_at | timestamp | nullable |
| last_used_at | timestamp | nullable |
| expires_at | timestamp | nullable |

> The original kit-generated migration pointed `tokenable_id` to `users.id`. Migration `1746924000012` corrects this to point to `usuarios.id`.

---

### `instructor_ficha`
Many-to-many join between instructors and fichas, with extra attributes.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| instructor_id | integer | FK → usuarios.id CASCADE |
| ficha_id | integer | FK → fichas.id CASCADE |
| es_lider | boolean | default false |
| fecha_asignacion | date | — |
| activo | boolean | default true |

Unique constraint: `(instructor_id, ficha_id)`.

---

### `proyectos`
A project belongs to a ficha and has a lead instructor.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| ficha_id | integer | FK → fichas.id RESTRICT |
| lider_id | integer | FK → usuarios.id RESTRICT |
| nombre | varchar | — |
| dueno | varchar | Product owner name |
| descripcion | text | nullable |
| activo | boolean | default true |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

---

### `epicas`
An epic groups related user stories within a project.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| proyecto_id | integer | FK → proyectos.id CASCADE |
| codigo | varchar | — |
| titulo | varchar | — |
| rol | varchar | User role in the story format |
| deseo | text | "I want to..." |
| para | text | "So that..." |
| orden | integer | display order, default 0 |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

Unique constraint: `(proyecto_id, codigo)`.

---

### `historias`
A user story (historia de usuario) belongs to an epic.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| epica_id | integer | FK → epicas.id CASCADE |
| codigo | varchar | — |
| nombre | varchar | — |
| rol | varchar | — |
| deseo | text | — |
| para | text | — |
| criterios | text | nullable, acceptance criteria |
| prioridad | enum | `'Alta'`, `'Media'`, `'Baja'` |
| story_points | integer | nullable |
| sprint | integer | nullable |
| estado | enum | `'Por hacer'`, `'En progreso'`, `'Hecho'` |
| responsable | varchar | nullable |
| comentarios | text | nullable |
| orden | integer | default 0 |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

Unique constraint: `(epica_id, codigo)`. Indexes: `epica_id`, `estado`, `sprint`, `prioridad`.

---

### `tareas`
A task (tarea) belongs to a user story and represents a concrete unit of work.

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| historia_id | integer | FK → historias.id CASCADE |
| codigo | varchar | — |
| nombre | varchar | — |
| tipo | enum | `'RF'`, `'RNF'`, `'RF/RNF'` |
| estimacion_dias | decimal(4,1) | nullable |
| responsable | varchar | nullable |
| dependencias | text | nullable |
| prioridad | enum | `'ALTA'`, `'MEDIA'`, `'BAJA'` |
| estado_pct | smallint | 0–100, default 0 |
| condicion_aprobacion | text | nullable |
| aprobado | boolean | default false |
| aprobado_por | varchar | nullable |
| created_at | timestamp | — |
| updated_at | timestamp | nullable |

Unique constraint: `(historia_id, codigo)`.

---

### `sesiones`

| Column | Type | Notes |
|--------|------|-------|
| id | integer | PK |
| usuario_id | integer | FK → usuarios.id CASCADE |
| token | varchar | UNIQUE |
| ip_origen | varchar | nullable |
| user_agent | text | nullable |
| expira_en | timestamp | — |
| activa | boolean | default true |
| created_at | timestamp | — |

Indexes: `token`, `expira_en`.

---

### `auditoria`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| usuario_id | integer | nullable, FK → usuarios.id SET NULL |
| tabla_afectada | varchar | — |
| registro_id | integer | — |
| accion | enum | `'INSERT'`, `'UPDATE'`, `'DELETE'` |
| valores_antes | jsonb | nullable |
| valores_despues | jsonb | nullable |
| ip_origen | varchar | nullable |
| created_at | timestamp | — |

Composite index: `(tabla_afectada, registro_id)`.

---

## Entity Relationship Summary

```
roles (1) ──────────────── (N) usuarios (N) ──── (N) fichas
                                    │
                              (lider_id, 1)
                                    │
                                    ▼
fichas (1) ─────────────────── (N) proyectos
                                    │
                                    ▼
                                 epicas
                                    │
                                    ▼
                                historias
                                    │
                                    ▼
                                 tareas

usuarios (N) ─── instructor_ficha ─── (N) fichas
usuarios (1) ─── auth_access_tokens
usuarios (1) ─── sesiones
usuarios (1) ─── auditoria
```
