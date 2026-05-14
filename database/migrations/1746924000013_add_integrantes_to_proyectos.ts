import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proyectos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('integrantes').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('integrantes')
    })
  }
}
