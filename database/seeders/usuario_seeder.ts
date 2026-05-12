import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

export default class UsuarioSeeder extends BaseSeeder {
  async run() {
    const rolInstructor = await db.from('roles').where('nombre', 'instructor').firstOrFail()
    const rolAprendiz = await db.from('roles').where('nombre', 'aprendiz').firstOrFail()
    const ficha = await db.from('fichas').where('codigo', '2758960').firstOrFail()

    const passwordHash = await hash.make('password123')

    const usuarios = [
      {
        rol_id: rolInstructor.id,
        ficha_id: ficha.id,
        nombre: 'Instructor',
        apellido: 'Demo',
        email: 'instructor@sena.edu.co',
        documento: '1000000001',
        password_hash: passwordHash,
      },
      {
        rol_id: rolAprendiz.id,
        ficha_id: ficha.id,
        nombre: 'Aprendiz',
        apellido: 'Demo',
        email: 'aprendiz@sena.edu.co',
        documento: '1000000002',
        password_hash: passwordHash,
      },
    ]

    for (const u of usuarios) {
      await db.rawQuery(
        `INSERT INTO usuarios
           (rol_id, ficha_id, nombre, apellido, email, documento, password_hash, activo, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())
         ON CONFLICT (email) DO NOTHING`,
        [u.rol_id, u.ficha_id, u.nombre, u.apellido, u.email, u.documento, u.password_hash]
      )
    }
  }
}
