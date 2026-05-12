# Domain Model

## Business context

SENA (Servicio Nacional de Aprendizaje) is Colombia's vocational training institution. This system manages software project backlogs for SENA training programs, specifically for the **Análisis y Desarrollo de Software** (ADSO) program.

## Core entities

### Ficha

A **ficha** is a training cohort — a numbered group of students enrolled in a specific program. Each ficha has:
- A unique numeric code (e.g. `2758960`)
- A program name
- Start and end dates
- An active status

A ficha is the organizational unit that groups both students (aprendices) and instructors.

### Users (Usuarios)

All system users live in the `usuarios` table. A user belongs to exactly one role and optionally to one ficha directly (via `ficha_id`).

Instructors can be associated with multiple fichas through the `instructor_ficha` join table, which also records whether the instructor is the lead (`es_lider`) for that ficha.

### Proyecto

A **project** belongs to a single ficha and has one lead instructor (`lider_id`). It also records a `dueno` (product owner) — typically the name of the client or stakeholder the students are building for.

Each project has its own backlog structured as a hierarchy:

```
Proyecto
  └── Épica (Epic)
        └── Historia (User Story)
              └── Tarea (Task)
```

### Épica (Epic)

An epic groups related user stories within a project. It follows the standard agile user story format:
- **Rol:** the persona who benefits
- **Deseo:** what they want ("I want to...")
- **Para:** the goal ("So that...")

Epics have a display `orden` (order) and a `codigo` unique within the project.

### Historia (User Story)

A user story inherits the epic format (rol/deseo/para) and adds:
- `criterios` — acceptance criteria
- `prioridad` — `Alta`, `Media`, or `Baja`
- `story_points` — effort estimate
- `sprint` — sprint number
- `estado` — `Por hacer`, `En progreso`, or `Hecho`
- `responsable` — assigned person's name

### Tarea (Task)

A task is the most granular unit of work. It belongs to a user story and adds:
- `tipo` — `RF` (functional requirement), `RNF` (non-functional requirement), or `RF/RNF`
- `estimacion_dias` — time estimate in days (decimal, e.g. 0.5)
- `prioridad` — `ALTA`, `MEDIA`, or `BAJA` (uppercase, distinct from Historia's)
- `estado_pct` — completion percentage (0–100)
- `aprobado` / `aprobado_por` — approval tracking

## Relationships

```
Ficha (2758960 - ADSO)
  │
  ├── Instructores (via instructor_ficha)
  │     └── es_lider = true → lead instructor
  │
  ├── Aprendices (usuarios.ficha_id)
  │
  └── Proyectos
        ├── lider_id → Instructor
        └── Épicas
              └── Historias
                    └── Tareas
```

## Auditing

The `auditoria` table records INSERT/UPDATE/DELETE operations on any table. It stores:
- Which user performed the action (`usuario_id`, nullable for system actions)
- The table and record affected
- Before/after JSON snapshots (`valores_antes`, `valores_despues`)
- Source IP

Audit records are not written automatically by the ORM — a controller or service layer must write them explicitly (not yet implemented).

## Sessions table

The `sesiones` table exists for tracking active sessions with expiry and IP tracking. It is separate from `auth_access_tokens` (which is managed by the auth framework). The `sesiones` table is not yet used by any application code — it is available for future session management features.
