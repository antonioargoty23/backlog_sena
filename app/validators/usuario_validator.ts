import vine from '@vinejs/vine'

export const usuarioValidator = vine.compile(
  vine.object({
    nombre:    vine.string().trim().minLength(1).maxLength(100),
    apellido:  vine.string().trim().minLength(1).maxLength(100),
    email:     vine.string().trim().email().maxLength(150),
    documento: vine.string().trim().minLength(1).maxLength(20),
    password:  vine.string().minLength(6).maxLength(100),
    rol:       vine.string().trim().optional(),
    ficha_id:  vine.number().positive().optional(),
  })
)

export const usuarioMessages = {
  'nombre.required':    'El nombre es obligatorio',
  'nombre.string':      'El nombre debe ser texto',
  'apellido.required':  'El apellido es obligatorio',
  'apellido.string':    'El apellido debe ser texto',
  'email.required':     'El correo electrónico es obligatorio',
  'email.email':        'El correo electrónico no tiene un formato válido',
  'email.unique':       'Este correo ya está registrado',
  'documento.required': 'El documento es obligatorio',
  'documento.string':   'El documento debe ser texto',
  'password.required':  'La contraseña es obligatoria',
  'password.minLength': 'La contraseña debe tener al menos 6 caracteres',
  'ficha_id.number':    'La ficha debe ser un número válido',
  'ficha_id.positive':  'El ID de ficha debe ser un número positivo',
}
