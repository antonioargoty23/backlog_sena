# Seeders y datos iniciales

## Comando para ejecutar

```bash
node ace db:seed
```

Para ejecutar un seeder específico:

```bash
node ace db:seed --files=database/seeders/role_seeder.ts
node ace db:seed --files=database/seeders/ficha_seeder.ts
node ace db:seed --files=database/seeders/usuario_seeder.ts
```

Todos los seeders son **idempotentes**: si los datos ya existen, no generan error ni duplicados (usan `ON CONFLICT DO NOTHING`).

---

## Roles (`role_seeder.ts`)

| id | nombre | descripcion | activo |
|----|--------|-------------|--------|
| — | instructor | Instructor SENA | true |
| — | aprendiz | Aprendiz SENA | true |
| — | admin | Administrador del sistema | true |

> Los IDs son asignados automáticamente por PostgreSQL.

---

## Fichas (`ficha_seeder.ts`)

| codigo | nombre | fecha_inicio | fecha_fin | activa |
|--------|--------|--------------|-----------|--------|
| 2758960 | Análisis y Desarrollo de Software | 2024-01-15 | 2025-12-15 | true |

---

## Usuarios de prueba (`usuario_seeder.ts`)

### Instructor Demo

| Campo | Valor |
|-------|-------|
| nombre | Instructor |
| apellido | Demo |
| email | `instructor@sena.edu.co` |
| documento | `11111111` |
| password | `password123` |
| rol | instructor |
| ficha | null |
| activo | true |

### Aprendiz Demo

| Campo | Valor |
|-------|-------|
| nombre | Aprendiz |
| apellido | Demo |
| email | `aprendiz@sena.edu.co` |
| documento | `22222222` |
| password | `password123` |
| rol | aprendiz |
| ficha | 2758960 |
| activo | true |

---

## Notas técnicas

- Las contraseñas son hasheadas con **Argon2** mediante `hash.make('password123')` antes de insertar.
- La resolución de FKs es dinámica: el seeder consulta `roles.id` donde `nombre = 'instructor'` y `fichas.id` donde `codigo = '2758960'` antes de insertar, por lo que el orden de ejecución importa:
  1. `role_seeder.ts`
  2. `ficha_seeder.ts`
  3. `usuario_seeder.ts`
- El campo en la tabla es `password_hash`, no `password`. El seeder inserta el hash directamente vía raw query.
