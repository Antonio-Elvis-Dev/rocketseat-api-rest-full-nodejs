import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.text('title').notNullable()
    table.dropColumns('description', 'session_id')
    // table.text('session_id').after('id')
  })
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
