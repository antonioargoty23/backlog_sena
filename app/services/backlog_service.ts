import Proyecto from '#models/proyecto'

export default class BacklogService {
  // ── Query interna reutilizada por otros servicios ─────────────────────────────

  static async cargarProyecto(proyectoId: number) {
    return Proyecto.query()
      .where('id', proyectoId)
      .where('activo', true)
      .preload('ficha')
      .preload('epicas', (eq) => {
        eq.orderBy('orden', 'asc').preload('historias', (hq) => {
          hq.orderBy('orden', 'asc').preload('tareas', (tq) => tq.orderBy('created_at', 'asc'))
        })
      })
      .firstOrFail()
  }

  // ── API pública ───────────────────────────────────────────────────────────────

  static async obtenerBacklogCompleto(proyectoId: number) {
    const proyecto = await BacklogService.cargarProyecto(proyectoId)

    let sp_total = 0

    const epicas = proyecto.epicas.map((epica) => {
      const sp = epica.historias.reduce((acc, h) => acc + (h.storyPoints ?? 0), 0)
      sp_total += sp

      return {
        id: epica.id,
        codigo: epica.codigo,
        titulo: epica.titulo,
        orden: epica.orden,
        sp,
        historias: epica.historias.map((historia) => ({
          id: historia.id,
          codigo: historia.codigo,
          nombre: historia.nombre,
          prioridad: historia.prioridad,
          storyPoints: historia.storyPoints,
          sprint: historia.sprint,
          estado: historia.estado,
          responsable: historia.responsable,
          criterios: historia.criterios,
          tareas: historia.tareas.map((tarea) => ({
            id: tarea.id,
            codigo: tarea.codigo,
            nombre: tarea.nombre,
            tipo: tarea.tipo,
            responsable: tarea.responsable,
            estadoPct: tarea.estadoPct,
            aprobado: tarea.aprobado,
          })),
        })),
      }
    })

    return {
      id: proyecto.id,
      nombre: proyecto.nombre,
      dueno: proyecto.dueno,
      ficha: proyecto.ficha
        ? { id: proyecto.ficha.id, codigo: proyecto.ficha.codigo, nombre: proyecto.ficha.nombre }
        : null,
      sp_total,
      epicas,
    }
  }
}
