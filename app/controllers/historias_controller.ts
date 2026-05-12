import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Historia from '#models/historia'
import type { PrioridadHistoria } from '#models/historia'
import Epica from '#models/epica'
import Proyecto from '#models/proyecto'
import Usuario from '#models/usuario'
import { historiaValidator, historiaMessages } from '#validators/historia_validator'

// Validator sends lowercase; DB enum uses title case
const PRIORIDAD_MAP: Record<string, PrioridadHistoria> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export default class HistoriasController {
  // ── helpers ──────────────────────────────────────────────────────────────────

  private async resolveEpica(epicaId: number) {
    return Epica.query().where('id', epicaId).firstOrFail()
  }

  private async puedeEditar(usuario: Usuario, epicaId: number): Promise<boolean> {
    const epica = await Epica.query().where('id', epicaId).firstOrFail()
    const proyecto = await Proyecto.query().where('id', epica.proyectoId).firstOrFail()
    return proyecto.liderId === usuario.id || usuario.rol.nombre === 'instructor'
  }

  private async nextOrden(epicaId: number): Promise<number> {
    const ultima = await Historia.query()
      .where('epica_id', epicaId)
      .orderBy('orden', 'desc')
      .first()
    return ultima ? ultima.orden + 1 : 1
  }

  // ── index ─────────────────────────────────────────────────────────────────────

  async index({ params, response }: HttpContext) {
    await this.resolveEpica(params.epicaId)

    const historias = await Historia.query()
      .where('epica_id', params.epicaId)
      .orderBy('orden', 'asc')

    return response.ok({ success: true, data: historias })
  }

  // ── store ─────────────────────────────────────────────────────────────────────

  async store({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveEpica(params.epicaId)

    if (!(await this.puedeEditar(usuario, params.epicaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para agregar historias a esta épica',
      })
    }

    const payload = await request.validateUsing(historiaValidator, {
      messagesProvider: new SimpleMessagesProvider(historiaMessages, {}),
    })

    const historia = await Historia.create({
      epicaId: Number(params.epicaId),
      codigo: payload.codigo,
      nombre: payload.titulo,
      prioridad: PRIORIDAD_MAP[payload.prioridad],
      storyPoints: payload.sp,
      criterios: payload.criterios_aceptacion,
      orden: await this.nextOrden(Number(params.epicaId)),
    })

    return response.created({ success: true, data: historia })
  }

  // ── show ──────────────────────────────────────────────────────────────────────

  async show({ params, response }: HttpContext) {
    const historia = await Historia.query()
      .where('id', params.id)
      .where('epica_id', params.epicaId)
      .preload('tareas', (q) => q.orderBy('created_at', 'asc'))
      .firstOrFail()

    return response.ok({ success: true, data: historia })
  }

  // ── update ────────────────────────────────────────────────────────────────────

  async update({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveEpica(params.epicaId)

    if (!(await this.puedeEditar(usuario, params.epicaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para editar historias de esta épica',
      })
    }

    const historia = await Historia.query()
      .where('id', params.id)
      .where('epica_id', params.epicaId)
      .firstOrFail()

    const payload = await request.validateUsing(historiaValidator, {
      messagesProvider: new SimpleMessagesProvider(historiaMessages, {}),
    })

    await historia
      .merge({
        codigo: payload.codigo,
        nombre: payload.titulo,
        prioridad: PRIORIDAD_MAP[payload.prioridad],
        storyPoints: payload.sp,
        criterios: payload.criterios_aceptacion,
      })
      .save()

    return response.ok({ success: true, data: historia })
  }

  // ── destroy ───────────────────────────────────────────────────────────────────

  async destroy({ auth, params, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveEpica(params.epicaId)

    if (!(await this.puedeEditar(usuario, params.epicaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para eliminar historias de esta épica',
      })
    }

    const historia = await Historia.query()
      .where('id', params.id)
      .where('epica_id', params.epicaId)
      .firstOrFail()

    await historia.delete()

    return response.ok({ success: true, data: { mensaje: 'Historia eliminada correctamente' } })
  }
}
