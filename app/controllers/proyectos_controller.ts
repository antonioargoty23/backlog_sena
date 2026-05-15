import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Proyecto from '#models/proyecto'
import Usuario from '#models/usuario'
import { proyectoValidator, proyectoMessages } from '#validators/proyecto_validator'
import BacklogService from '#services/backlog_service'
import EstadisticasService from '#services/estadisticas_service'
import ExcelService from '#services/excel_service'

export default class ProyectosController {
  async index({ auth, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()

    let proyectos: Proyecto[]

    if (usuario.rol.nombre === 'instructor') {
      proyectos = await Proyecto.query()
        .where('lider_id', usuario.id)
        .where('activo', true)
        .preload('ficha')
        .orderBy('created_at', 'desc')
    } else {
      if (!usuario.fichaId) return response.ok({ success: true, data: [] })
      proyectos = await Proyecto.query()
        .where('ficha_id', usuario.fichaId)
        .where('activo', true)
        .preload('ficha')
        .orderBy('created_at', 'desc')
    }

    return response.ok({ success: true, data: proyectos })
  }

  async store({ auth, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()

    if (usuario.rol.nombre !== 'instructor') {
      return response.forbidden({
        success: false,
        message: 'Solo los instructores pueden crear proyectos',
      })
    }

    const payload = await request.validateUsing(proyectoValidator, {
      messagesProvider: new SimpleMessagesProvider(proyectoMessages, {}),
    })

    // Resuelve el nombre del dueño: texto libre si viene, o nombre del usuario dueno_id
    let duenoNombre = payload.dueno ?? ''
    if (!duenoNombre && payload.dueno_id) {
      const duenoUsuario = await Usuario.find(payload.dueno_id)
      if (duenoUsuario) duenoNombre = `${duenoUsuario.nombre} ${duenoUsuario.apellido}`
    }

    const proyecto = await Proyecto.create({
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      integrantes: payload.integrantes,
      fichaId: payload.ficha_id,
      liderId: usuario.id,
      dueno: duenoNombre,
    })

    return response.created({ success: true, data: proyecto })
  }

  async show({ params, response }: HttpContext) {
    const proyecto = await Proyecto.query()
      .where('id', params.id)
      .where('activo', true)
      .preload('ficha')
      .preload('epicas', (q) => q.orderBy('orden', 'asc'))
      .firstOrFail()

    return response.ok({ success: true, data: proyecto })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()

    const proyecto = await Proyecto.query()
      .where('id', params.id)
      .where('activo', true)
      .firstOrFail()

    const esLider = proyecto.liderId === usuario.id
    const esInstructor = usuario.rol.nombre === 'instructor'

    if (!esLider && !esInstructor) {
      return response.forbidden({
        success: false,
        message: 'Solo el líder del proyecto o un instructor puede editarlo',
      })
    }

    const payload = await request.validateUsing(proyectoValidator, {
      messagesProvider: new SimpleMessagesProvider(proyectoMessages, {}),
    })

    // Resuelve el nombre del dueño: texto libre si viene, o nombre del usuario dueno_id
    let duenoNombre = payload.dueno ?? proyecto.dueno
    if (payload.dueno_id && !payload.dueno) {
      const duenoUsuario = await Usuario.find(payload.dueno_id)
      if (duenoUsuario) duenoNombre = `${duenoUsuario.nombre} ${duenoUsuario.apellido}`
    }

    await proyecto
      .merge({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        integrantes: payload.integrantes,
        fichaId: payload.ficha_id,
        dueno: duenoNombre,
      })
      .save()

    return response.ok({ success: true, data: proyecto })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()

    if (usuario.rol.nombre !== 'instructor') {
      return response.forbidden({
        success: false,
        message: 'Solo los instructores pueden eliminar proyectos',
      })
    }

    const proyecto = await Proyecto.query()
      .where('id', params.id)
      .where('activo', true)
      .firstOrFail()

    await proyecto.merge({ activo: false }).save()

    return response.ok({ success: true, data: { mensaje: 'Proyecto eliminado correctamente' } })
  }

  // ── Backlog ───────────────────────────────────────────────────────────────────

  async backlog({ params, response }: HttpContext) {
    const data = await BacklogService.obtenerBacklogCompleto(params.id)
    return response.ok({ success: true, data })
  }

  // ── Resumen / estadísticas ────────────────────────────────────────────────────

  async resumen({ params, response }: HttpContext) {
    const data = await EstadisticasService.resumenProyecto(params.id)
    return response.ok({ success: true, data })
  }

  // ── Excel ─────────────────────────────────────────────────────────────────────

  async excel({ params, response }: HttpContext) {
    const buffer = await ExcelService.generarExcel(params.id)

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', `attachment; filename="backlog-${params.id}.xlsx"`)
    return response.send(buffer)
  }
}
