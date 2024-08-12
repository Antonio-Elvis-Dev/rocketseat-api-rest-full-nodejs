"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.text('title').notNullable();
        table.dropColumns('description', 'session_id');
        // table.text('session_id').after('id')
    });
}
async function down(knex) {
    await knex.schema.dropTable('transactions');
}
