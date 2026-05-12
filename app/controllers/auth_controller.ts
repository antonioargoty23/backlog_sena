import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Usuario from '#models/usuario'

// ── Validator ────────────────────────────────────────────────────────────────

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(1),
  })
)

// ── Controller ───────────────────────────────────────────────────────────────

export default class AuthController {
  /**
   * POST /auth/login
   * Recibe email y password, retorna el token de acceso.
   */
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const usuario = await Usuario.query()
      .where('email', payload.email)
      .where('activo', true)
      .first()

    if (!usuario) {
      return response.unauthorized({ mensaje: 'Credenciales inválidas' })
    }

    const passwordValido = await hash.verify(usuario.passwordHash, payload.password)
    if (!passwordValido) {
      return response.unauthorized({ mensaje: 'Credenciales inválidas' })
    }

    const token = await Usuario.accessTokens.create(usuario, ['*'], {
      expiresIn: '30 days',
    })

    await usuario.merge({ ultimoAcceso: DateTime.now() }).save()

    return response.ok({
      token: token.toJSON(),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rolId: usuario.rolId,
        fichaId: usuario.fichaId,
      },
    })
  }

  /**
   * POST /api/auth/logout
   * Invalida el token si está presente y es válido. Responde 200 en cualquier caso.
   */
  async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      await auth.use('api').invalidateToken()
    } catch {
      // Token ausente o ya inválido — se trata como sesión ya cerrada
    }
    return response.ok({ mensaje: 'Sesión cerrada correctamente' })
  }

  /**
   * GET /auth/me
   * Retorna el usuario autenticado con su rol y ficha.
   * AuthMiddleware ya autenticó, re-autenticamos para obtener el objeto Usuario.
   */
  async me({ auth, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()

    const usuario = await Usuario.query()
      .where('id', authUser.id)
      .preload('rol')
      .preload('ficha')
      .firstOrFail()

    return response.ok({ usuario })
  }
}
