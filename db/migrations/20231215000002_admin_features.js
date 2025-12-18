/**
 * Migration: Features administrativas (Assinaturas e Reports)
 */

exports.up = function (knex) {
    return knex.schema
        .table('users', function (table) {
            table.string('plan').defaultTo('free'); // 'free', 'pro', 'enterprise'
            table.string('subscription_status').defaultTo('active'); // 'active', 'canceled', 'past_due'
            table.timestamp('subscription_end_date').nullable();
        })
        .createTable('reports', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
            table.string('type').notNullable(); // 'bug', 'feedback', 'abuse'
            table.string('title').notNullable();
            table.text('description').notNullable();
            table.string('status').defaultTo('open'); // 'open', 'in_progress', 'resolved', 'closed'
            table.string('priority').defaultTo('medium'); // 'low', 'medium', 'high', 'critical'
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('reports')
        .table('users', function (table) {
            table.dropColumn('subscription_end_date');
            table.dropColumn('subscription_status');
            table.dropColumn('plan');
        });
};
