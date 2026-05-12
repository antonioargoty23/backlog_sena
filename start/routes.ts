import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

// ── Salud ────────────────────────────────────────────────────────────────────

router.get('/', async () => ({ status: 'ok', app: 'Backlog Builder SENA API' }))

// ── Autenticación ─────────────────────────────────────────────────────────────

router.post('/auth/login', [AuthController, 'login'])

router.group(() => {
  router.delete('/auth/logout', [AuthController, 'logout'])
  router.get('/auth/me', [AuthController, 'me'])
}).use(middleware.auth())

// ── Rutas protegidas por rol (ejemplos de uso) ────────────────────────────────
// router.group(() => {
//   // Solo instructores
// }).use([middleware.auth(), middleware.role(['instructor'])])
//
// router.group(() => {
//   // Instructores o aprendices
// }).use([middleware.auth(), middleware.role(['instructor', 'aprendiz'])])
