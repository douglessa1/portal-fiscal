/**
 * Migration: Tabelas para funcionalidades sociais (Follows e Notificações)
 */

exports.up = function (knex) {
    return knex.schema
        .createTable('follows', function (table) {
            table.increments('id').primary();
            table.integer('follower_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.integer('following_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

            // Impedir duplicatas: não pode seguir a mesma pessoa 2x
            table.unique(['follower_id', 'following_id']);
        })
        .createTable('notifications', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('type').notNullable(); // 'reply', 'follow', 'mention', 'like'
            table.integer('reference_id').nullable(); // ID do post ou user relacionado
            table.string('title').nullable();
            table.string('message').nullable();
            table.string('link').nullable();
            table.boolean('read').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

            table.index('user_id');
            table.index('read');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('notifications')
        .dropTableIfExists('follows');
};
