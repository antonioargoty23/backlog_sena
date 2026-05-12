import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Historia from '#models/historia'

export type TipoTarea = 'RF' | 'RNF' | 'RF/RNF'
export type PrioridadTarea = 'ALTA' | 'MEDIA' | 'BAJA'

export default class Tarea extends BaseModel {
  static table = 'tareas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare historiaId: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare tipo: TipoTarea

  @column()
  declare estimacionDias: number | null

  @column()
  declare responsable: string | null

  @column()
  declare dependencias: string | null

  @column()
  declare prioridad: PrioridadTarea

  @column()
  declare estadoPct: number

  @column()
  declare condicionAprobacion: string | null

  @column()
  declare aprobado: boolean

  @column()
  declare aprobadoPor: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ── Relaciones ──────────────────────────────────────────────────────────────

  @belongsTo(() => Historia)
  declare historia: BelongsTo<typeof Historia>
}
