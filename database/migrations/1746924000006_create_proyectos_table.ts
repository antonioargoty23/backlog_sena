import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proyectos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('ficha_id').notNullable().unsigned().references('id').inTable('fichas').onDelete('RESTRICT')
      table.integer('lider_id').notNullable().unsigned().references('id').inTable('usuarios').onDelete('RESTRICT')
      table.string('nombre', 200).notNullable()
      table.string('dueno', 150).notNullable()
      table.text('descripcion').nullable()
      table.boolean('activo').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.index(['ficha_id'])
      table.index(['lider_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
