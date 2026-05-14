import vine from '@vinejs/vine'

export const proyectoValidator = vine.compile(
  vine.object({
    nombre: vine.string().trim().maxLength(150),
    descripcion:  vine.string().trim().optional(),
    integrantes:  vine.string().trim().optional(),
    ficha_id: vine.number().positive(),
    dueno_id: vine.number().positive(),
  })
)

export const proyectoMessages = {
  'nombre.required': 'El nombre del proyecto es obligatorio',
  'nombre.string': 'El nombre debe ser texto',
  'nombre.maxLength': 'El nombre no puede superar los 150 caracteres',
  'descripcion.string':  'La descripción debe ser texto',
  'integrantes.string':  'Los integrantes deben ser texto',
  'ficha_id.required': 'La ficha es obligatoria',
  'ficha_id.number': 'La ficha debe ser un número válido',
  'ficha_id.positive': 'El ID de ficha debe ser un número positivo',
  'dueno_id.required': 'El dueño del proyecto es obligatorio',
  'dueno_id.number': 'El dueño debe ser un número válido',
  'dueno_id.positive': 'El ID de dueño debe ser un número positivo',
}
