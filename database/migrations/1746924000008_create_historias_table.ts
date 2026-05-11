import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'historias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('epica_id').notNullable().unsigned().references('id').inTable('epicas').onDelete('CASCADE')
      table.string('codigo', 10).notNullable()
      table.string('nombre', 250).notNullable()
      table.string('rol', 150).nullable()
      table.text('deseo').nullable()
      table.text('para').nullable()
      table.text('criterios').nullable()
      table.enum('prioridad', ['Alta', 'Media', 'Baja']).notNullable().defaultTo('Media')
      table.smallint('story_points').nullable()
      table.smallint('sprint').nullable()
      table.enum('estado', ['Por hacer', 'En progreso', 'Hecho']).notNullable().defaultTo('Por hacer')
      table.string('responsable', 100).nullable()
      table.text('comentarios').nullable()
      table.smallint('orden').notNullable().defaultTo(1)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.unique(['epica_id', 'codigo'])
      table.index(['epica_id'])
      table.index(['estado'])
      table.index(['sprint'])
      table.index(['prioridad'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
