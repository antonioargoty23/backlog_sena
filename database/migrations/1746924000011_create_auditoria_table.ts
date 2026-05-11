import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auditoria'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table.integer('usuario_id').nullable().unsigned().references('id').inTable('usuarios').onDelete('SET NULL')
      table.string('tabla_afectada', 50).notNullable()
      table.integer('registro_id').notNullable()
      table.enum('accion', ['INSERT', 'UPDATE', 'DELETE']).notNullable()
      table.jsonb('valores_antes').nullable()
      table.jsonb('valores_despues').nullable()
      table.string('ip_origen', 45).nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      table.index(['tabla_afectada', 'registro_id'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
