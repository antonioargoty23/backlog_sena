import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'
import Proyecto from '#models/proyecto'

export default class Ficha extends BaseModel {
  static table = 'fichas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column.date()
  declare fechaInicio: DateTime | null

  @column.date()
  declare fechaFin: DateTime | null

  @column()
  declare activa: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>

  @hasMany(() => Proyecto)
  declare proyectos: HasMany<typeof Proyecto>
}
