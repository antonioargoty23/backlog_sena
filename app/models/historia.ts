import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Epica from '#models/epica'
import Tarea from '#models/tarea'

export type PrioridadHistoria = 'Alta' | 'Media' | 'Baja'
export type EstadoHistoria = 'Por hacer' | 'En progreso' | 'Hecho'

export default class Historia extends BaseModel {
  static table = 'historias'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare epicaId: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare rol: string | null

  @column()
  declare deseo: string | null

  @column()
  declare para: string | null

  @column()
  declare criterios: string | null

  @column()
  declare prioridad: PrioridadHistoria

  @column()
  declare storyPoints: number | null

  @column()
  declare sprint: number | null

  @column()
  declare estado: EstadoHistoria

  @column()
  declare responsable: string | null

  @column()
  declare comentarios: string | null

  @column()
  declare orden: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Epica)
  declare epica: BelongsTo<typeof Epica>

  @hasMany(() => Tarea)
  declare tareas: HasMany<typeof Tarea>
}
