import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'

export default class Role extends BaseModel {
  static table = 'roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>
}
