import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sesiones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('usuario_id').notNullable().unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.string('token', 255).notNullable().unique()
      table.string('ip_origen', 45).nullable()
      table.string('user_agent', 250).nullable()
      table.dateTime('expira_en').notNullable()
      table.boolean('activa').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      table.index(['token'])
      table.index(['expira_en'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
