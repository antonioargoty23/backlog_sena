import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Usuario from '#models/usuario'
import Role from '#models/role'
import { usuarioValidator, usuarioMessages } from '#validators/usuario_validator'

export default class UsuariosController {
  /**
   * GET /api/usuarios?rol=instructor
   * Devuelve usuarios activos. Si se pasa ?rol=<nombre> filtra por ese rol.
   */
  async index({ request, response }: HttpContext) {
    const rol = request.qs().rol as string | undefined

    const query = Usuario.query()
      .where('activo', true)
      .preload('rol')
      .orderBy('apellido', 'asc')
      .orderBy('nombre', 'asc')

    if (rol) {
      query.whereHas('rol', (q) => q.where('nombre', rol))
    }

    const usuarios = await query

    return response.ok({
      success: true,
      data: usuarios.map((u) => ({
        id:       u.id,
        nombre:   u.nombre,
        apellido: u.apellido,
        email:    u.email,
        rol:      u.rol.nombre,
      })),
    })
  }

  /**
   * POST /api/usuarios
   * Crea un nuevo usuario con rol instructor.
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(usuarioValidator, {
      messagesProvider: new SimpleMessagesProvider(usuarioMessages, {}),
    })

    const emailExiste = await Usuario.query().where('email', payload.email).first()
    if (emailExiste) {
      return response.unprocessableEntity({
        success: false,
        errors: [{ field: 'email', message: 'Este correo ya está registrado' }],
      })
    }

    const rolNombre = payload.rol ?? 'instructor'
    const rol = await Role.query().where('nombre', rolNombre).firstOrFail()

    const usuario = await Usuario.create({
      nombre:       payload.nombre,
      apellido:     payload.apellido,
      email:        payload.email,
      documento:    payload.documento,
      passwordHash: await hash.make(payload.password),
      rolId:        rol.id,
      fichaId:      payload.ficha_id ?? null,
      activo:       true,
    })

    return response.created({
      success: true,
      data: {
        id:       usuario.id,
        nombre:   usuario.nombre,
        apellido: usuario.apellido,
        email:    usuario.email,
        rol:      rol.nombre,
      },
    })
  }

  async destroy({ params, response }: HttpContext) {
    const usuario = await Usuario.findOrFail(params.id)
    await usuario.delete()
    return response.ok({ success: true })
  }

  async toggleActivo({ params, response }: HttpContext) {
    const usuario = await Usuario.findOrFail(params.id)
    await usuario.merge({ activo: !usuario.activo }).save()
    return response.ok({ success: true, activo: usuario.activo })
  }
}
