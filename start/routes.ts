import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProyectosController = () => import('#controllers/proyectos_controller')
const EpicasController = () => import('#controllers/epicas_controller')
const HistoriasController = () => import('#controllers/historias_controller')
const TareasController = () => import('#controllers/tareas_controller')
const InstructorController = () => import('#controllers/instructor_controller')
const FichasController = () => import('#controllers/fichas_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')

// ── Health check ──────────────────────────────────────────────────────────────

router.get('/', async () => ({ status: 'ok', app: 'Backlog Builder SENA API' }))

// ── /api ──────────────────────────────────────────────────────────────────────

router
  .group(() => {
    // ── Rutas públicas ───────────────────────────────────────────────────────
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/logout', [AuthController, 'logout'])

    // ── Rutas privadas (requieren token) ─────────────────────────────────────
    router
      .group(() => {
        // Auth
        router.get('/auth/me', [AuthController, 'me'])

        // ── Proyectos ───────────────────────────────────────────────────────
        router.get('/proyectos', [ProyectosController, 'index'])
        router.post('/proyectos', [ProyectosController, 'store'])
        router.get('/proyectos/:id', [ProyectosController, 'show'])
        router.put('/proyectos/:id', [ProyectosController, 'update'])
        router.delete('/proyectos/:id', [ProyectosController, 'destroy'])
        router.get('/proyectos/:id/backlog', [ProyectosController, 'backlog'])
        router.get('/proyectos/:id/resumen', [ProyectosController, 'resumen'])
        router.get('/proyectos/:id/excel', [ProyectosController, 'excel'])

        // ── Épicas  /api/proyectos/:proyectoId/epicas ───────────────────────
        router
          .group(() => {
            router.get('/epicas', [EpicasController, 'index'])
            router.post('/epicas', [EpicasController, 'store'])
            router.get('/epicas/:id', [EpicasController, 'show'])
            router.put('/epicas/:id', [EpicasController, 'update'])
            router.delete('/epicas/:id', [EpicasController, 'destroy'])

            // ── Historias  .../epicas/:epicaId/historias ──────────────────
            router
              .group(() => {
                router.get('/historias', [HistoriasController, 'index'])
                router.post('/historias', [HistoriasController, 'store'])
                router.get('/historias/:id', [HistoriasController, 'show'])
                router.put('/historias/:id', [HistoriasController, 'update'])
                router.delete('/historias/:id', [HistoriasController, 'destroy'])

                // ── Tareas  .../historias/:historiaId/tareas ──────────────
                router
                  .group(() => {
                    router.get('/tareas', [TareasController, 'index'])
                    router.post('/tareas', [TareasController, 'store'])
                    router.get('/tareas/:id', [TareasController, 'show'])
                    router.put('/tareas/:id', [TareasController, 'update'])
                    router.delete('/tareas/:id', [TareasController, 'destroy'])
                  })
                  .prefix('/historias/:historiaId')
              })
              .prefix('/epicas/:epicaId')
          })
          .prefix('/proyectos/:proyectoId')

        // ── Fichas ─────────────────────────────────────────────────────────
        router.get('/fichas', [FichasController, 'index'])
        router.post('/fichas', [FichasController, 'store'])

        // ── Usuarios ────────────────────────────────────────────────────────
        router.get('/usuarios', [UsuariosController, 'index'])
        router.post('/usuarios', [UsuariosController, 'store'])

        // ── Instructor ──────────────────────────────────────────────────────
        router
          .get('/instructor/ficha-proyectos', [InstructorController, 'fichaProyectos'])
          .use(middleware.role(['instructor']))
      })
      .use(middleware.auth())
  })
  .prefix('/api')
