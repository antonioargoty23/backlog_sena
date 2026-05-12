import BacklogService from '#services/backlog_service'

export default class EstadisticasService {
  static async resumenProyecto(proyectoId: number) {
    const backlog = await BacklogService.obtenerBacklogCompleto(proyectoId)

    let total_historias = 0
    let total_tareas = 0
    let sp_total = backlog.sp_total
    const sp_por_prioridad: Record<'Alta' | 'Media' | 'Baja', number> = {
      Alta: 0,
      Media: 0,
      Baja: 0,
    }

    const historias_sin_tareas: { codigo: string; nombre: string; epica: string }[] = []
    const estadosPct: number[] = []

    for (const epica of backlog.epicas) {
      for (const historia of epica.historias) {
        total_historias++

        // SP por prioridad
        if (historia.prioridad && historia.prioridad in sp_por_prioridad) {
          sp_por_prioridad[historia.prioridad as 'Alta' | 'Media' | 'Baja'] +=
            historia.storyPoints ?? 0
        }

        // Historias sin tareas
        if (historia.tareas.length === 0) {
          historias_sin_tareas.push({
            codigo: historia.codigo,
            nombre: historia.nombre,
            epica: `${epica.codigo} – ${epica.titulo}`,
          })
        }

        // Recolectar estado_pct de todas las tareas
        for (const tarea of historia.tareas) {
          total_tareas++
          estadosPct.push(tarea.estadoPct)
        }
      }
    }

    const porcentaje_completado =
      estadosPct.length > 0
        ? Math.round(estadosPct.reduce((acc, v) => acc + v, 0) / estadosPct.length)
        : 0

    return {
      proyecto: { id: backlog.id, nombre: backlog.nombre },
      total_epicas: backlog.epicas.length,
      total_historias,
      total_tareas,
      sp_total,
      sp_por_prioridad,
      porcentaje_completado,
      historias_sin_tareas,
    }
  }
}
