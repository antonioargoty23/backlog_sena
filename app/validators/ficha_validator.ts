import vine from '@vinejs/vine'

export const fichaValidator = vine.compile(
  vine.object({
    codigo:   vine.string().trim().minLength(1).maxLength(20),
    programa: vine.string().trim().minLength(1).maxLength(200),
  })
)

export const fichaMessages = {
  'codigo.required':   'El código de la ficha es obligatorio',
  'codigo.string':     'El código debe ser texto',
  'codigo.minLength':  'El código no puede estar vacío',
  'codigo.maxLength':  'El código no puede superar los 20 caracteres',
  'programa.required': 'El nombre del programa es obligatorio',
  'programa.string':   'El nombre del programa debe ser texto',
  'programa.minLength':'El nombre del programa no puede estar vacío',
  'programa.maxLength':'El nombre del programa no puede superar los 200 caracteres',
}
