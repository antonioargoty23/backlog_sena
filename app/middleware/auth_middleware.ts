import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Protege rutas privadas exigiendo un Access Token válido en el header:
 *   Authorization: Bearer <token>
 *
 * Retorna 401 si el token no existe, es inválido o está expirado.
 */
export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.use('api').authenticate()
    } catch {
      return ctx.response.unauthorized({
        mensaje: 'Token de autenticación requerido o inválido',
        codigo: 'UNAUTHORIZED',
      })
    }

    await next()
  }
}
