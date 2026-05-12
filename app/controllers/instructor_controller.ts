import type { HttpContext } from '@adonisjs/core/http'
import InstructorFicha from '#models/instructor_ficha'
import Proyecto from '#models/proyecto'
import Usuario from '#models/usuario'

export default class InstructorController {
  /**
   * GET /instructor/ficha-proyectos
   * Lista todos los proyectos de las fichas asignadas al instructor autenticado.
   */
  async fichaProyectos({ auth, response }: HttpContext) {
    const authUser = await auth.use('api').authenticate()
    const usuario = await Usuario.query().where('id', authUser.id).preload('rol').firstOrFail()

    if (usuario.rol.nombre !== 'instructor') {
      return response.forbidden({
        success: false,
        message: 'Solo los instructores pueden acceder a este recurso',
      })
    }

    const asignaciones = await InstructorFicha.query()
      .where('instructor_id', usuario.id)
      .where('activo', true)
      .select('ficha_id')

    const fichaIds = asignaciones.map((a) => a.fichaId)

    if (fichaIds.length === 0) {
      return response.ok({ success: true, data: [] })
    }

    const proyectos = await Proyecto.query()
      .whereIn('ficha_id', fichaIds)
      .where('activo', true)
      .preload('ficha')
      .orderBy('ficha_id', 'asc')
      .orderBy('created_at', 'desc')

    return response.ok({ success: true, data: proyectos })
  }
}
