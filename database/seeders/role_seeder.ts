import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    const roles = [
      { nombre: 'aprendiz', descripcion: 'Aprendiz SENA líder de proyecto' },
      { nombre: 'instructor', descripcion: 'Instructor SENA supervisa fichas' },
    ]

    for (const rol of roles) {
      await db.rawQuery(
        `INSERT INTO roles (nombre, descripcion, activo, created_at)
         VALUES (?, ?, true, NOW())
         ON CONFLICT (nombre) DO NOTHING`,
        [rol.nombre, rol.descripcion]
      )
    }
  }
}
