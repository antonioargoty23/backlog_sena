import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await db.table('roles').multiInsert([
      {
        nombre: 'aprendiz',
        descripcion: 'Aprendiz SENA líder de proyecto',
        activo: true,
        created_at: new Date(),
      },
      {
        nombre: 'instructor',
        descripcion: 'Instructor SENA supervisa fichas',
        activo: true,
        created_at: new Date(),
      },
    ])
  }
}
