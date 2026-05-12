import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Tarea from '#models/tarea'
import Historia from '#models/historia'
import Epica from '#models/epica'
import Proyecto from '#models/proyecto'
import Usuario from '#models/usuario'
import { tareaValidator, tareaMessages } from '#validators/tarea_validator'

export default class TareasController {
  // ── helpers ──────────────────────────────────────────────────────────────────

  private async resolveHistoria(historiaId: number) {
    return Historia.query().where('id', historiaId).firstOrFail()
  }

  private async puedeEditar(usuario: Usuario, historiaId: number): Promise<boolean> {
    const historia = await Historia.query().where('id', historiaId).firstOrFail()
    const epica = await Epica.query().where('id', historia.epicaId).firstOrFail()
    const proyecto = await Proyecto.query().where('id', epica.proyectoId).firstOrFail()
    return proyecto.liderId === usuario.id || usuario.rol.nombre === 'instructor'
  }

  private async nextCodigo(historiaId: number): Promise<string> {
    const ultima = await Tarea.query()
      .where('historia_id', historiaId)
      .orderBy('created_at', 'desc')
      .first()

    if (!ultima) return 'T001'

    const match = ultima.codigo.match(/\d+$/)
    const numero = match ? Number.parseInt(match[0], 10) + 1 : 1
    return `T${String(numero).padStart(3, '0')}`
  }

  // ── index ─────────────────────────────────────────────────────────────────────

  async index({ params, response }: HttpContext) {
    await this.resolveHistoria(params.historiaId)

    const tareas = await Tarea.query()
      .where('historia_id', params.historiaId)
      .orderBy('created_at', 'asc')

    return response.ok({ success: true, data: tareas })
  }

  // ── store ─────────────────────────────────────────────────────────────────────

  async store({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveHistoria(params.historiaId)

    if (!(await this.puedeEditar(usuario, params.historiaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para agregar tareas a esta historia',
      })
    }

    const payload = await request.validateUsing(tareaValidator, {
      messagesProvider: new SimpleMessagesProvider(tareaMessages, {}),
    })

    let responsableNombre: string | undefined
    if (payload.responsable_id) {
      const responsable = await Usuario.find(payload.responsable_id)
      if (!responsable) {
        return response.notFound({ success: false, message: 'El usuario responsable no existe' })
      }
      responsableNombre = `${responsable.nombre} ${responsable.apellido}`
    }

    const tarea = await Tarea.create({
      historiaId: Number(params.historiaId),
      codigo: await this.nextCodigo(Number(params.historiaId)),
      nombre: payload.titulo,
      tipo: payload.tipo,
      estadoPct: payload.estado_pct,
      responsable: responsableNombre,
    })

    return response.created({ success: true, data: tarea })
  }

  // ── show ──────────────────────────────────────────────────────────────────────

  async show({ params, response }: HttpContext) {
    const tarea = await Tarea.query()
      .where('id', params.id)
      .where('historia_id', params.historiaId)
      .firstOrFail()

    return response.ok({ success: true, data: tarea })
  }

  // ── update ────────────────────────────────────────────────────────────────────

  async update({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveHistoria(params.historiaId)

    if (!(await this.puedeEditar(usuario, params.historiaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para editar tareas de esta historia',
      })
    }

    const tarea = await Tarea.query()
      .where('id', params.id)
      .where('historia_id', params.historiaId)
      .firstOrFail()

    const payload = await request.validateUsing(tareaValidator, {
      messagesProvider: new SimpleMessagesProvider(tareaMessages, {}),
    })

    let responsableNombre: string | undefined = tarea.responsable ?? undefined
    if (payload.responsable_id) {
      const responsable = await Usuario.find(payload.responsable_id)
      if (!responsable) {
        return response.notFound({ success: false, message: 'El usuario responsable no existe' })
      }
      responsableNombre = `${responsable.nombre} ${responsable.apellido}`
    }

    await tarea
      .merge({
        nombre: payload.titulo,
        tipo: payload.tipo,
        estadoPct: payload.estado_pct,
        responsable: responsableNombre,
      })
      .save()

    return response.ok({ success: true, data: tarea })
  }

  // ── destroy ───────────────────────────────────────────────────────────────────

  async destroy({ auth, params, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()
    await this.resolveHistoria(params.historiaId)

    if (!(await this.puedeEditar(usuario, params.historiaId))) {
      return response.forbidden({
        success: false,
        message: 'No tienes permiso para eliminar tareas de esta historia',
      })
    }

    const tarea = await Tarea.query()
      .where('id', params.id)
      .where('historia_id', params.historiaId)
      .firstOrFail()

    await tarea.delete()

    return response.ok({ success: true, data: { mensaje: 'Tarea eliminada correctamente' } })
  }
}
