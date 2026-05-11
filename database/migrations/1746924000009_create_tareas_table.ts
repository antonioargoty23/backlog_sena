import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tareas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('historia_id').notNullable().unsigned().references('id').inTable('historias').onDelete('CASCADE')
      table.string('codigo', 10).notNullable()
      table.string('nombre', 250).notNullable()
      table.enum('tipo', ['RF', 'RNF', 'RF/RNF']).notNullable().defaultTo('RF')
      table.decimal('estimacion_dias', 4, 1).nullable()
      table.string('responsable', 100).nullable()
      table.string('dependencias', 200).nullable()
      table.enum('prioridad', ['ALTA', 'MEDIA', 'BAJA']).notNullable().defaultTo('ALTA')
      table.smallint('estado_pct').notNullable().defaultTo(0)
      table.text('condicion_aprobacion').nullable()
      table.boolean('aprobado').notNullable().defaultTo(false)
      table.string('aprobado_por', 100).nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.unique(['historia_id', 'codigo'])
      table.index(['historia_id'])
      table.index(['aprobado'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
