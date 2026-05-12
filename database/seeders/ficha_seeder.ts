import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class FichaSeeder extends BaseSeeder {
  async run() {
    await db.rawQuery(
      `INSERT INTO fichas (codigo, nombre, fecha_inicio, fecha_fin, activa, created_at, updated_at)
       VALUES (?, ?, ?, ?, true, NOW(), NOW())
       ON CONFLICT (codigo) DO NOTHING`,
      ['2758960', 'Ficha 2758960', '2024-03-01', '2025-12-31']
    )
  }
}
