/**
 * Migration: Tabela de Planos de Assinatura
 */

exports.up = function (knex) {
    return knex.schema
        .createTable('plans', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable(); // 'Free', 'Pro', 'Enterprise'
            table.string('slug').unique().notNullable(); // 'free', 'pro', 'enterprise'
            table.decimal('price', 10, 2).notNullable();
            table.string('interval').defaultTo('monthly'); // 'monthly', 'yearly'
            table.json('features').notNullable(); // Array de strings com features
            table.boolean('active').defaultTo(true);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('plans');
};
