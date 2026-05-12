import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProyectosController = () => import('#controllers/proyectos_controller')
const EpicasController = () => import('#controllers/epicas_controller')
const HistoriasController = () => import('#controllers/historias_controller')
const TareasController = () => import('#controllers/tareas_controller')
const InstructorController = () => import('#controllers/instructor_controller')

// ── Salud ────────────────────────────────────────────────────────────────────

router.get('/', async () => ({ status: 'ok', app: 'Backlog Builder SENA API' }))

// ── Autenticación ─────────────────────────────────────────────────────────────

router.post('/auth/login', [AuthController, 'login'])

router.group(() => {
  router.delete('/auth/logout', [AuthController, 'logout'])
  router.get('/auth/me', [AuthController, 'me'])
}).use(middleware.auth())

// ── Rutas protegidas ──────────────────────────────────────────────────────────

router
  .group(() => {
    // ── Proyectos ────────────────────────────────────────────────────────────
    router.get('/proyectos', [ProyectosController, 'index'])
    router.post('/proyectos', [ProyectosController, 'store'])
    router.get('/proyectos/:id', [ProyectosController, 'show'])
    router.put('/proyectos/:id', [ProyectosController, 'update'])
    router.delete('/proyectos/:id', [ProyectosController, 'destroy'])

    // ── Épicas (anidadas bajo proyecto) ───────────────────────────────────────
    router.get('/proyectos/:proyectoId/epicas', [EpicasController, 'index'])
    router.post('/proyectos/:proyectoId/epicas', [EpicasController, 'store'])
    router.get('/proyectos/:proyectoId/epicas/:id', [EpicasController, 'show'])
    router.put('/proyectos/:proyectoId/epicas/:id', [EpicasController, 'update'])
    router.delete('/proyectos/:proyectoId/epicas/:id', [EpicasController, 'destroy'])

    // ── Historias (anidadas bajo épica) ───────────────────────────────────────
    router.get('/epicas/:epicaId/historias', [HistoriasController, 'index'])
    router.post('/epicas/:epicaId/historias', [HistoriasController, 'store'])
    router.get('/epicas/:epicaId/historias/:id', [HistoriasController, 'show'])
    router.put('/epicas/:epicaId/historias/:id', [HistoriasController, 'update'])
    router.delete('/epicas/:epicaId/historias/:id', [HistoriasController, 'destroy'])

    // ── Tareas (anidadas bajo historia) ───────────────────────────────────────
    router.get('/historias/:historiaId/tareas', [TareasController, 'index'])
    router.post('/historias/:historiaId/tareas', [TareasController, 'store'])
    router.get('/historias/:historiaId/tareas/:id', [TareasController, 'show'])
    router.put('/historias/:historiaId/tareas/:id', [TareasController, 'update'])
    router.delete('/historias/:historiaId/tareas/:id', [TareasController, 'destroy'])

    // ── Instructor ────────────────────────────────────────────────────────────
    router.get('/instructor/ficha-proyectos', [InstructorController, 'fichaProyectos'])
  })
  .use(middleware.auth())
