import vine from '@vinejs/vine'
// prettier-ignore
export const epicaValidator = vine.compile(
  vine.object({
    codigo: vine.string().trim().regex(/^EP\d{2}$/),
    titulo: vine.string().trim().maxLength(200),
    descripcion: vine.string().trim().optional(),
  })
)

export const epicaMessages = {
  'codigo.required': 'El código de la épica es obligatorio',
  'codigo.string': 'El código debe ser texto',
  'codigo.regex': 'El código debe tener el formato EPnn (ej. EP01, EP12)',
  'titulo.required': 'El título de la épica es obligatorio',
  'titulo.string': 'El título debe ser texto',
  'titulo.maxLength': 'El título no puede superar los 200 caracteres',
  'descripcion.string': 'La descripción debe ser texto',
}
