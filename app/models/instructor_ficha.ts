import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'
import Ficha from '#models/ficha'

export default class InstructorFicha extends BaseModel {
  static table = 'instructor_ficha'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare instructorId: number

  @column()
  declare fichaId: number

  @column()
  declare esLider: boolean

  @column.date()
  declare fechaAsignacion: DateTime

  @column()
  declare activo: boolean

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Usuario, { foreignKey: 'instructorId' })
  declare instructor: BelongsTo<typeof Usuario>

  @belongsTo(() => Ficha)
  declare ficha: BelongsTo<typeof Ficha>
}
