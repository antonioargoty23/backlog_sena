import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

// ── Regla personalizada: valores Fibonacci ───────────────────────────────────

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]
// prettier-ignore
const fibonacciRule = vine.createRule((value: unknown, _options: undefined, field: FieldContext) => {
  if (typeof value !== 'number') return
  if (!FIBONACCI.includes(value)) {
    field.report(
      'El campo {{ field }} debe ser un story point de Fibonacci válido: 1, 2, 3, 5, 8, 13 o 21',
      'fibonacci',
      field
    )
  }
})

// ── Validator ────────────────────────────────────────────────────────────────

export const historiaValidator = vine.compile(
  vine.object({
    codigo: vine.string().trim(),
    titulo: vine.string().trim(),
    sp: vine.number().withoutDecimals().use(fibonacciRule()),
    prioridad: vine.enum(['alta', 'media', 'baja'] as const),
    criterios_aceptacion: vine.string().trim().optional(),
  })
)

export const historiaMessages = {
  'codigo.required': 'El código de la historia es obligatorio',
  'codigo.string': 'El código debe ser texto',
  'titulo.required': 'El título de la historia es obligatorio',
  'titulo.string': 'El título debe ser texto',
  'sp.required': 'Los story points son obligatorios',
  'sp.number': 'Los story points deben ser un número',
  'sp.withoutDecimals': 'Los story points deben ser un número entero',
  'sp.fibonacci': 'Los story points deben ser un número de Fibonacci: 1, 2, 3, 5, 8, 13 o 21',
  'prioridad.required': 'La prioridad es obligatoria',
  'prioridad.enum': 'La prioridad debe ser: alta, media o baja',
  'criterios_aceptacion.string': 'Los criterios de aceptación deben ser texto',
}
