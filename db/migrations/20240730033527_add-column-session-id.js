"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('transactions', (tabele) => {
        tabele.uuid('session_id').after('id').notNullable();
    });
}
async function down(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id');
    });
}
