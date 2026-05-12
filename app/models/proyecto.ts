import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Ficha from '#models/ficha'
import Usuario from '#models/usuario'
import Epica from '#models/epica'

export default class Proyecto extends BaseModel {
  static table = 'proyectos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fichaId: number

  @column()
  declare liderId: number

  @column()
  declare nombre: string

  @column()
  declare dueno: string

  @column()
  declare descripcion: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Ficha)
  declare ficha: BelongsTo<typeof Ficha>

  @belongsTo(() => Usuario, { foreignKey: 'liderId' })
  declare lider: BelongsTo<typeof Usuario>

  @hasMany(() => Epica)
  declare epicas: HasMany<typeof Epica>
}
