import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'epicas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('proyecto_id').notNullable().unsigned().references('id').inTable('proyectos').onDelete('CASCADE')
      table.string('codigo', 10).notNullable()
      table.string('titulo', 200).notNullable()
      table.string('rol', 200).nullable()
      table.text('deseo').nullable()
      table.text('para').nullable()
      table.smallint('orden').notNullable().defaultTo(1)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.unique(['proyecto_id', 'codigo'])
      table.index(['proyecto_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
