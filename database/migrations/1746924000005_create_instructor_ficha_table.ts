import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'instructor_ficha'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('instructor_id').notNullable().unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.integer('ficha_id').notNullable().unsigned().references('id').inTable('fichas').onDelete('CASCADE')
      table.boolean('es_lider').notNullable().defaultTo(false)
      table.date('fecha_asignacion').notNullable().defaultTo(this.now())
      table.boolean('activo').notNullable().defaultTo(true)

      table.unique(['instructor_id', 'ficha_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
