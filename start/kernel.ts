import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))

server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

router.use([() => import('@adonisjs/core/bodyparser_middleware')])

/**
 * Named middleware — se asignan explícitamente a rutas o grupos de rutas.
 *
 * middleware.auth()              → exige token válido (401 si no lo hay)
 * middleware.role(['instructor']) → exige rol específico (403 si no lo tiene)
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  role: () => import('#middleware/role_middleware'),
})
