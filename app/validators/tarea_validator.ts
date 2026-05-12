import vine from '@vinejs/vine'

export const tareaValidator = vine.compile(
  vine.object({
    titulo: vine.string().trim(),
    tipo: vine.enum(['RF', 'RNF', 'RF/RNF'] as const),
    estado_pct: vine.number().withoutDecimals().min(0).max(100),
    responsable_id: vine.number().positive().optional(),
  })
)

export const tareaMessages = {
  'titulo.required': 'El título de la tarea es obligatorio',
  'titulo.string': 'El título debe ser texto',
  'tipo.required': 'El tipo de tarea es obligatorio',
  'tipo.enum': 'El tipo debe ser: RF, RNF o RF/RNF',
  'estado_pct.required': 'El estado de avance es obligatorio',
  'estado_pct.number': 'El estado de avance debe ser un número',
  'estado_pct.withoutDecimals': 'El estado de avance debe ser un número entero',
  'estado_pct.min': 'El estado de avance no puede ser menor a 0',
  'estado_pct.max': 'El estado de avance no puede ser mayor a 100',
  'responsable_id.number': 'El responsable debe ser un número válido',
  'responsable_id.positive': 'El ID del responsable debe ser un número positivo',
}
