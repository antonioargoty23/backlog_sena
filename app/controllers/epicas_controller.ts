import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Epica from '#models/epica'
import Proyecto from '#models/proyecto'
import Usuario from '#models/usuario'
import { epicaValidator, epicaMessages } from '#validators/epica_validator'

export default class EpicasController {
  // ── helpers ──────────────────────────────────────────────────────────────────

  private async resolveProyecto(id: number) {
    return Proyecto.query().where('id', id).where('activo', true).firstOrFail()
  }

  private async nextOrden(proyectoId: number): Promise<number> {
    const ultima = await Epica.query()
      .where('proyecto_id', proyectoId)
      .orderBy('orden', 'desc')
      .first()
    return ultima ? ultima.orden + 1 : 1
  }

  private async puedeEditar(usuario: Usuario, proyecto: Proyecto): Promise<boolean> {
    return proyecto.liderId === usuario.id || usuario.rol.nombre === 'instructor'
  }

  // ── index ─────────────────────────────────────────────────────────────────────

  async index({ params, response }: HttpContext) {
    await this.resolveProyecto(params.proyectoId)

    const epicas = await Epica.query()
      .where('proyecto_id', params.proyectoId)
      .orderBy('orden', 'asc')

    return response.ok({ success: true, data: epicas })
  }

  // ── store ─────────────────────────────────────────────────────────────────────

  async store({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    const proyecto = await this.resolveProyecto(params.proyectoId)

    if (!(await this.puedeEditar(usuario, proyecto))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para agregar épicas a este proyecto',
      })
    }

    const payload = await request.validateUsing(epicaValidator, {
      messagesProvider: new SimpleMessagesProvider(epicaMessages, {}),
    })

    const epica = await Epica.create({
      proyectoId: proyecto.id,
      codigo: payload.codigo,
      titulo: payload.titulo,
      orden: await this.nextOrden(proyecto.id),
    })

    return response.created({ success: true, data: epica })
  }

  // ── show ──────────────────────────────────────────────────────────────────────

  async show({ params, response }: HttpContext) {
    const epica = await Epica.query()
      .where('id', params.id)
      .where('proyecto_id', params.proyectoId)
      .preload('historias', (q) => q.orderBy('orden', 'asc'))
      .firstOrFail()

    return response.ok({ success: true, data: epica })
  }

  // ── update ────────────────────────────────────────────────────────────────────

  async update({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    const proyecto = await this.resolveProyecto(params.proyectoId)

    if (!(await this.puedeEditar(usuario, proyecto))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para editar épicas de este proyecto',
      })
    }

    const epica = await Epica.query()
      .where('id', params.id)
      .where('proyecto_id', proyecto.id)
      .firstOrFail()

    const payload = await request.validateUsing(epicaValidator, {
      messagesProvider: new SimpleMessagesProvider(epicaMessages, {}),
    })

    await epica.merge({ codigo: payload.codigo, titulo: payload.titulo }).save()

    return response.ok({ success: true, data: epica })
  }

  // ── destroy ───────────────────────────────────────────────────────────────────

  async destroy({ auth, params, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    const proyecto = await this.resolveProyecto(params.proyectoId)

    if (!(await this.puedeEditar(usuario, proyecto))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para eliminar épicas de este proyecto',
      })
    }

    const epica = await Epica.query()
      .where('id', params.id)
      .where('proyecto_id', proyecto.id)
      .firstOrFail()

    await epica.delete()

    return response.ok({ success: true, data: { mensaje: 'Épica eliminada correctamente' } })
  }
}
