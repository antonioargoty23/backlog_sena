import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Drop FK that points to users.id
    this.schema.table('auth_access_tokens', (table) => {
      table.dropForeign(['tokenable_id'])
    })
    // Add FK pointing to usuarios.id instead
    this.schema.table('auth_access_tokens', (table) => {
      table.foreign('tokenable_id').references('id').inTable('usuarios').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.table('auth_access_tokens', (table) => {
      table.dropForeign(['tokenable_id'])
    })
    this.schema.table('auth_access_tokens', (table) => {
      table.foreign('tokenable_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }
}
