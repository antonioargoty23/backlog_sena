import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Proyecto from '#models/proyecto'
import Historia from '#models/historia'

export default class Epica extends BaseModel {
  static table = 'epicas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare proyectoId: number

  @column()
  declare codigo: string

  @column()
  declare titulo: string

  @column()
  declare rol: string | null

  @column()
  declare deseo: string | null

  @column()
  declare para: string | null

  @column()
  declare orden: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Proyecto)
  declare proyecto: BelongsTo<typeof Proyecto>

  @hasMany(() => Historia)
  declare historias: HasMany<typeof Historia>
}
