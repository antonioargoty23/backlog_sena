import ExcelJS from 'exceljs'
import BacklogService from '#services/backlog_service'

// ── Constantes de estilo ──────────────────────────────────────────────────────

const SENA_GREEN = 'FF39A900'
const WHITE = 'FFFFFFFF'

const HEADER_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SENA_GREEN } }
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true, color: { argb: WHITE } }

// Colores alternos por épica (pares, semi-transparentes)
const EPIC_PALETTE = [
  'FFD6E4F0', // azul claro
  'FFD6F0DA', // verde claro
  'FFFFF3D6', // amarillo claro
  'FFF0D6E8', // rosa claro
  'FFE8D6F0', // lila claro
  'FFFFE0CC', // durazno claro
]

function epicFill(epicIndex: number): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: EPIC_PALETTE[epicIndex % EPIC_PALETTE.length] },
  }
}

function applyHeader(row: ExcelJS.Row): void {
  row.height = 20
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }
    cell.border = {
      bottom: { style: 'medium', color: { argb: SENA_GREEN } },
    }
  })
}

// ── Servicio ──────────────────────────────────────────────────────────────────

export default class ExcelService {
  static async generarExcel(proyectoId: number): Promise<Buffer> {
    const backlog = await BacklogService.obtenerBacklogCompleto(proyectoId)

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Backlog Builder SENA'
    workbook.created = new Date()

    // ── Hoja 1: Backlog ───────────────────────────────────────────────────────

    const backlogSheet = workbook.addWorksheet('Backlog', {
      views: [{ state: 'frozen', ySplit: 1 }],
    })

    backlogSheet.columns = [
      { header: 'Épica', key: 'epica', width: 24 },
      { header: 'Código', key: 'codigo', width: 12 },
      { header: 'Historia', key: 'historia', width: 45 },
      { header: 'SP', key: 'sp', width: 6 },
      { header: 'Prioridad', key: 'prioridad', width: 12 },
      { header: 'Estado', key: 'estado', width: 16 },
    ]

    applyHeader(backlogSheet.getRow(1))

    for (const [epicIdx, epica] of backlog.epicas.entries()) {
      const fill = epicFill(epicIdx)

      for (const historia of epica.historias) {
        const row = backlogSheet.addRow({
          epica: `${epica.codigo} – ${epica.titulo}`,
          codigo: historia.codigo,
          historia: historia.nombre,
          sp: historia.storyPoints ?? '',
          prioridad: historia.prioridad ?? '',
          estado: historia.estado ?? '',
        })

        // Toda la fila en el color de la épica
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = fill
          cell.alignment = { vertical: 'middle' }
        })

        // Alineaciones específicas
        row.getCell('codigo').alignment = { horizontal: 'center' }
        row.getCell('sp').alignment = { horizontal: 'center' }
        row.getCell('prioridad').alignment = { horizontal: 'center' }
        row.getCell('estado').alignment = { horizontal: 'center' }
      }
    }

    // ── Hoja 2: Tareas ────────────────────────────────────────────────────────

    const tareasSheet = workbook.addWorksheet('Tareas', {
      views: [{ state: 'frozen', ySplit: 1 }],
    })

    tareasSheet.columns = [
      { header: 'Historia', key: 'historia', width: 40 },
      { header: 'Tarea', key: 'tarea', width: 40 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Responsable', key: 'responsable', width: 24 },
      { header: 'Avance %', key: 'avance', width: 11 },
    ]

    applyHeader(tareasSheet.getRow(1))

    for (const [epicIdx, epica] of backlog.epicas.entries()) {
      const fill = epicFill(epicIdx)

      for (const historia of epica.historias) {
        for (const tarea of historia.tareas) {
          const row = tareasSheet.addRow({
            historia: `${historia.codigo} – ${historia.nombre}`,
            tarea: `${tarea.codigo} – ${tarea.nombre}`,
            tipo: tarea.tipo ?? '',
            responsable: tarea.responsable ?? '',
            avance: tarea.estadoPct,
          })

          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = fill
            cell.alignment = { vertical: 'middle' }
          })

          row.getCell('tipo').alignment = { horizontal: 'center' }
          row.getCell('avance').alignment = { horizontal: 'center' }
          row.getCell('avance').numFmt = '0"%"'
        }
      }
    }

    const rawBuffer = await workbook.xlsx.writeBuffer()
    return Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer)
  }
}
