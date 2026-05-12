# Base de datos

## Motor y conexión

- **Motor:** PostgreSQL 16 (Neon serverless)
- **SSL:** requerido (`rejectUnauthorized: false`)
- **Pool:** configurado en `config/database.ts`

## Tablas

### `roles`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| nombre | varchar | NOT NULL, UNIQUE |
| descripcion | text | nullable |
| activo | boolean | NOT NULL, default true |
| created_at | timestamp | NOT NULL |

Valores iniciales: `instructor`, `aprendiz`, `admin`.

---

### `fichas`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| codigo | varchar | NOT NULL, UNIQUE |
| nombre | varchar | NOT NULL |
| fecha_inicio | date | nullable |
| fecha_fin | date | nullable |
| activa | boolean | NOT NULL, default true |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

---

### `usuarios`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| rol_id | integer | NOT NULL, FK → roles.id ON DELETE RESTRICT |
| ficha_id | integer | nullable, FK → fichas.id ON DELETE SET NULL |
| nombre | varchar | NOT NULL |
| apellido | varchar | NOT NULL |
| email | varchar | NOT NULL, UNIQUE |
| documento | varchar | NOT NULL, UNIQUE |
| password_hash | varchar | NOT NULL |
| activo | boolean | NOT NULL, default true |
| ultimo_acceso | timestamp | nullable |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

Índices adicionales: `rol_id`, `ficha_id`, `email`.

---

### `auth_access_tokens`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| tokenable_id | integer | NOT NULL, FK → usuarios.id ON DELETE CASCADE |
| type | varchar | NOT NULL |
| name | varchar | nullable |
| hash | varchar | NOT NULL |
| abilities | text | NOT NULL |
| created_at | timestamp | nullable |
| updated_at | timestamp | nullable |
| last_used_at | timestamp | nullable |
| expires_at | timestamp | nullable |

> La FK originalmente apuntaba a `users.id` (generada por el kit de auth). La migración `1746924000012_fix_auth_access_tokens_fk.ts` la corrigió para apuntar a `usuarios.id`.

---

### `instructor_ficha`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| instructor_id | integer | NOT NULL, FK → usuarios.id ON DELETE CASCADE |
| ficha_id | integer | NOT NULL, FK → fichas.id ON DELETE CASCADE |
| es_lider | boolean | NOT NULL, default false |
| fecha_asignacion | date | NOT NULL |
| activo | boolean | NOT NULL, default true |

Restricción única: `(instructor_id, ficha_id)`.

---

### `proyectos`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| ficha_id | integer | NOT NULL, FK → fichas.id ON DELETE RESTRICT |
| lider_id | integer | NOT NULL, FK → usuarios.id ON DELETE RESTRICT |
| nombre | varchar | NOT NULL |
| dueno | varchar | NOT NULL |
| descripcion | text | nullable |
| activo | boolean | NOT NULL, default true |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

---

### `epicas`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| proyecto_id | integer | NOT NULL, FK → proyectos.id ON DELETE CASCADE |
| codigo | varchar | NOT NULL |
| titulo | varchar | NOT NULL |
| rol | varchar | NOT NULL |
| deseo | text | NOT NULL |
| para | text | NOT NULL |
| orden | integer | NOT NULL, default 0 |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

Restricción única: `(proyecto_id, codigo)`.

---

### `historias`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| epica_id | integer | NOT NULL, FK → epicas.id ON DELETE CASCADE |
| codigo | varchar | NOT NULL |
| nombre | varchar | NOT NULL |
| rol | varchar | NOT NULL |
| deseo | text | NOT NULL |
| para | text | NOT NULL |
| criterios | text | nullable |
| prioridad | enum | `'Alta'`, `'Media'`, `'Baja'` |
| story_points | integer | nullable |
| sprint | integer | nullable |
| estado | enum | `'Por hacer'`, `'En progreso'`, `'Hecho'` |
| responsable | varchar | nullable |
| comentarios | text | nullable |
| orden | integer | NOT NULL, default 0 |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

Restricción única: `(epica_id, codigo)`. Índices: `epica_id`, `estado`, `sprint`, `prioridad`.

---

### `tareas`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| historia_id | integer | NOT NULL, FK → historias.id ON DELETE CASCADE |
| codigo | varchar | NOT NULL |
| nombre | varchar | NOT NULL |
| tipo | enum | `'RF'`, `'RNF'`, `'RF/RNF'` |
| estimacion_dias | decimal(4,1) | nullable |
| responsable | varchar | nullable |
| dependencias | text | nullable |
| prioridad | enum | `'ALTA'`, `'MEDIA'`, `'BAJA'` |
| estado_pct | smallint | NOT NULL, default 0 |
| condicion_aprobacion | text | nullable |
| aprobado | boolean | NOT NULL, default false |
| aprobado_por | varchar | nullable |
| created_at | timestamp | NOT NULL |
| updated_at | timestamp | nullable |

Restricción única: `(historia_id, codigo)`.

---

### `sesiones`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | integer | PK, autoincrement |
| usuario_id | integer | NOT NULL, FK → usuarios.id ON DELETE CASCADE |
| token | varchar | NOT NULL, UNIQUE |
| ip_origen | varchar | nullable |
| user_agent | text | nullable |
| expira_en | timestamp | NOT NULL |
| activa | boolean | NOT NULL, default true |
| created_at | timestamp | NOT NULL |

Índices: `token`, `expira_en`.

---

### `auditoria`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, autoincrement |
| usuario_id | integer | nullable, FK → usuarios.id ON DELETE SET NULL |
| tabla_afectada | varchar | NOT NULL |
| registro_id | integer | NOT NULL |
| accion | enum | `'INSERT'`, `'UPDATE'`, `'DELETE'` |
| valores_antes | jsonb | nullable |
| valores_despues | jsonb | nullable |
| ip_origen | varchar | nullable |
| created_at | timestamp | NOT NULL |

Índice compuesto: `(tabla_afectada, registro_id)`.

---

### `users` (tabla del kit de auth — no usada en dominio)
Generada automáticamente por AdonisJS al crear el proyecto con el kit de auth. Contiene `full_name`, `email`, `password`. No se usa para autenticación de dominio; la autenticación real usa `usuarios`.

---

## Diagrama de relaciones

```
roles ──────────────────< usuarios >──────────────── fichas
                              │
                              │ (lider_id)
                              ▼
                          proyectos >──────── fichas
                              │
                              ▼
                           epicas
                              │
                              ▼
                          historias
                              │
                              ▼
                           tareas

usuarios >──── instructor_ficha ────< fichas

usuarios ──── auth_access_tokens
usuarios ──── sesiones
usuarios ──── auditoria (nullable)
```

## Orden de migración

| # | Archivo | Tabla |
|---|---------|-------|
| 1 | `1746924000000` | `users` |
| 2 | `1746924000001` | `auth_access_tokens` (FK → users) |
| 3 | `1746924000002` | `roles` |
| 4 | `1746924000003` | `fichas` |
| 5 | `1746924000004` | `usuarios` |
| 6 | `1746924000005` | `instructor_ficha` |
| 7 | `1746924000006` | `proyectos` |
| 8 | `1746924000007` | `epicas` |
| 9 | `1746924000008` | `historias` |
| 10 | `1746924000009` | `tareas` |
| 11 | `1746924000010` | `sesiones` |
| 12 | `1746924000011` | `auditoria` |
| 13 | `1746924000012` | fix FK `auth_access_tokens` → `usuarios` |
