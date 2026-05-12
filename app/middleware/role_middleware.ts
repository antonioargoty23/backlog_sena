import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'
import type Usuario from '#models/usuario'

/**
 * Verifica que el usuario autenticado tenga uno de los roles permitidos.
 * Debe usarse después de AuthMiddleware (requiere usuario ya autenticado).
 *
 * Uso en rutas:
 *   .use([middleware.auth(), middleware.role(['instructor'])])
 *
 * Retorna 403 si el usuario no tiene el rol requerido.
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    const usuario = ctx.auth.use('api').user as Usuario | undefined

    if (!usuario) {
      return ctx.response.unauthorized({
        mensaje: 'Token de autenticación requerido o inválido',
        codigo: 'UNAUTHORIZED',
      })
    }

    const rol = await db.from('roles').where('id', usuario.rolId).select('nombre').first()

    if (!rol || !allowedRoles.includes(rol.nombre)) {
      return ctx.response.forbidden({
        mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
        codigo: 'FORBIDDEN',
        rolActual: rol?.nombre ?? null,
        rolesPermitidos: allowedRoles,
      })
    }

    await next()
  }
}
