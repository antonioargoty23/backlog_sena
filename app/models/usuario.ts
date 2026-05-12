import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from '#models/role'
import Ficha from '#models/ficha'
import Proyecto from '#models/proyecto'

export default class Usuario extends BaseModel {
  static table = 'usuarios'
  static accessTokens = DbAccessTokensProvider.forModel(Usuario)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rolId: number

  @column()
  declare fichaId: number | null

  @column()
  declare nombre: string

  @column()
  declare apellido: string

  @column()
  declare email: string

  @column()
  declare documento: string

  @column({ serializeAs: null })
  declare passwordHash: string

  @column()
  declare activo: boolean

  @column.dateTime()
  declare ultimoAcceso: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Role, { foreignKey: 'rolId' })
  declare rol: BelongsTo<typeof Role>

  @belongsTo(() => Ficha)
  declare ficha: BelongsTo<typeof Ficha>

  @hasMany(() => Proyecto, { foreignKey: 'liderId' })
  declare proyectos: HasMany<typeof Proyecto>
}
