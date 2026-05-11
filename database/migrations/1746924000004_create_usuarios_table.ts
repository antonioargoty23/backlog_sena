import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      // prettier-ignore
      table.integer('rol_id').notNullable().unsigned().references('id').inTable('roles').onDelete('RESTRICT')
      // prettier-ignore
      table.integer('ficha_id').nullable().unsigned().references('id').inTable('fichas').onDelete('SET NULL')
      table.string('nombre', 100).notNullable()
      table.string('apellido', 100).notNullable()
      table.string('email', 150).notNullable().unique()
      table.string('documento', 20).notNullable().unique()
      table.string('password_hash', 255).notNullable()
      table.boolean('activo').notNullable().defaultTo(true)
      table.dateTime('ultimo_acceso').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.index(['rol_id'])
      table.index(['ficha_id'])
      table.index(['email'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
