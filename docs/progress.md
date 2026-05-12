# Progress

## COMPLETADO

### Infraestructura
- [x] AdonisJS 6 project initialized (API kit, TypeScript, ESM)
- [x] PostgreSQL connection configured (Neon serverless, SSL)
- [x] Environment variable validation (`start/env.ts`)
- [x] CORS middleware configured
- [x] `.gitignore` and `.env.example`
- [x] `README.md`

### Base de datos — Migraciones (13 archivos)
- [x] `users` table (AdonisJS auth kit)
- [x] `auth_access_tokens` table
- [x] `roles` table
- [x] `fichas` table
- [x] `usuarios` table (domain users with password_hash)
- [x] `instructor_ficha` table
- [x] `proyectos` table
- [x] `epicas` table
- [x] `historias` table (with enum columns)
- [x] `tareas` table (with enum columns)
- [x] `sesiones` table
- [x] `auditoria` table (jsonb columns)
- [x] Fix migration: `auth_access_tokens.tokenable_id` FK → `usuarios.id`
- [x] All migrations applied to Neon (production DB)

### Seeders
- [x] `role_seeder.ts` — roles: instructor, aprendiz, admin
- [x] `ficha_seeder.ts` — ficha 2758960 (ADSO)
- [x] `usuario_seeder.ts` — Instructor Demo + Aprendiz Demo (password: `password123`)
- [x] All seeders idempotent (ON CONFLICT DO NOTHING)
- [x] All seeders executed successfully

### Modelos Lucid (8 modelos)
- [x] `Usuario` — with `DbAccessTokensProvider`, all relationships
- [x] `Role` — with `hasMany(Usuario)`
- [x] `Ficha` — with `hasMany(Usuario)`, `hasMany(Proyecto)`
- [x] `InstructorFicha` — junction model
- [x] `Proyecto` — full relationships
- [x] `Epica`
- [x] `Historia` — with exported TypeScript union types
- [x] `Tarea` — with exported TypeScript union types

### Autenticación
- [x] `config/auth.ts` — Access Tokens guard pointing to `Usuario` model
- [x] `AuthController` — login, logout, me (all endpoints tested)
- [x] `AuthMiddleware` — 401 with Spanish error message
- [x] `RoleMiddleware` — 403 with role information in response
- [x] `InitializeAuthMiddleware` registered in `server.use()`
- [x] Login endpoint tested and working
- [x] Logout endpoint tested and working
- [x] Me endpoint tested and working
- [x] Unauthorized request (no token) tested and working
- [x] Request with revoked token tested and working

### Documentación
- [x] `docs/arquitectura.md`
- [x] `docs/base-de-datos.md`
- [x] `docs/modulos.md`
- [x] `docs/rutas.md`
- [x] `docs/seeders-y-datos-iniciales.md`
- [x] `docs/architecture.md`
- [x] `docs/modules.md`
- [x] `docs/database.md`
- [x] `docs/api-rules.md`
- [x] `docs/roles-permissions.md`
- [x] `docs/domain.md`
- [x] `docs/progress.md`

---

## PENDIENTE

### CRUD — Proyectos
- [ ] `ProjectosController` — index, store, show, update, destroy
- [ ] Routes: `GET/POST /proyectos`, `GET/PUT/DELETE /proyectos/:id`
- [ ] Role guard: only `instructor` can create/edit/delete
- [ ] Validation schemas (VineJS)

### CRUD — Épicas
- [ ] `EpicasController` — index, store, show, update, destroy
- [ ] Routes nested under `/proyectos/:proyectoId/epicas`
- [ ] Reordering endpoint (update `orden`)

### CRUD — Historias de usuario
- [ ] `HistoriasController` — full CRUD
- [ ] Routes nested under `/epicas/:epicaId/historias`
- [ ] Filter by `estado`, `sprint`, `prioridad`
- [ ] Reordering endpoint

### CRUD — Tareas
- [ ] `TareasController` — full CRUD
- [ ] Routes nested under `/historias/:historiaId/tareas`
- [ ] Task approval endpoint (`PATCH /tareas/:id/aprobar`)
- [ ] Progress update endpoint (`PATCH /tareas/:id/progreso`)

### Gestión de usuarios (admin)
- [ ] `UsuariosController` — index, show, store, update, deactivate
- [ ] Routes protected by `middleware.role(['admin'])`
- [ ] Password change endpoint

### Gestión de fichas e instructor_ficha
- [ ] `FichasController` — CRUD
- [ ] Assign/remove instructors from fichas
- [ ] Mark instructor as `es_lider`

### Exportación
- [ ] Export backlog to Excel (`.xlsx`) using `exceljs`
- [ ] Route: `GET /proyectos/:id/export`

### Auditoría
- [ ] AuditService that writes to `auditoria` table on mutations
- [ ] Integrate into controllers for create/update/delete operations

### Sesiones
- [ ] Decide if `sesiones` table will be used alongside `auth_access_tokens` or removed

### Testing
- [ ] Unit tests for validators
- [ ] Integration tests for auth endpoints
- [ ] Integration tests for CRUD endpoints

### DevOps
- [ ] Production environment configuration
- [ ] CI/CD pipeline
- [ ] Rate limiting on auth endpoints
- [ ] Request logging
