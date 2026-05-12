# Backlog Builder SENA API

API REST para la gestión del backlog de proyectos de aprendices SENA. Permite a instructores y aprendices crear proyectos, épicas, historias de usuario y tareas con trazabilidad completa.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20+ |
| Framework | AdonisJS 6 |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL (Neon serverless) |
| ORM | Lucid v21 |
| Autenticación | Access Tokens (JWT-like) |
| Exportación | ExcelJS (.xlsx) |

## Instalación local

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd backlog_sena_backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Neon

# 4. Crear las tablas en la base de datos
node ace migration:run

# 5. Poblar datos iniciales (roles)
node ace db:seed --files database/seeders/role_seeder.ts

# 6. Iniciar el servidor en desarrollo
node ace serve --hmr
```

El servidor queda disponible en `http://localhost:3333`.

## Variables de entorno requeridas

Copia `.env.example` a `.env` y completa cada valor:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `HOST` | Interfaz de red | `0.0.0.0` |
| `PORT` | Puerto del servidor | `3333` |
| `LOG_LEVEL` | Nivel de logs | `info` |
| `APP_KEY` | Clave de cifrado de la app | generada con `node ace generate:key` |
| `DB_HOST` | Host de Neon PostgreSQL | `ep-xxxx.us-east-2.aws.neon.tech` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_USER` | Usuario de la base de datos | `neondb_owner` |
| `DB_PASSWORD` | Contraseña de la base de datos | — |
| `DB_DATABASE` | Nombre de la base de datos | `neondb` |
| `DB_SSL` | SSL requerido por Neon | `true` |

## Estructura de la base de datos

```
roles               → Aprendiz / Instructor
fichas              → Grupos de formación SENA
usuarios            → Aprendices e instructores
instructor_ficha    → Relación instructores ↔ fichas
proyectos           → Proyectos de cada ficha
epicas              → Épicas de cada proyecto
historias           → Historias de usuario por épica
tareas              → Tareas técnicas por historia
sesiones            → Tokens de sesión personalizados
auditoria           → Log de cambios con jsonb
```

## Comandos útiles

```bash
node ace migration:run        # Ejecutar migraciones pendientes
node ace migration:rollback   # Revertir el último batch
node ace migration:status     # Ver estado de todas las migraciones
node ace db:seed --files database/seeders/role_seeder.ts
node ace serve --hmr          # Servidor con hot-reload
node ace build                # Compilar para producción
```

## Endpoints disponibles

> Esta sección se irá completando conforme avance el proyecto.

### Autenticación
_Por definir_

### Roles
_Por definir_

### Fichas
_Por definir_

### Usuarios
_Por definir_

### Proyectos
_Por definir_

### Épicas
_Por definir_

### Historias de usuario
_Por definir_

### Tareas
_Por definir_

### Exportación
_Por definir_ — generación de backlog en `.xlsx`
