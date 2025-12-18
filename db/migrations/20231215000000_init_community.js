/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table.string('role').defaultTo('user'); // user, moderator, admin
            table.integer('reputation').defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('posts', function (table) {
            table.increments('id').primary();
            table.integer('author_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('title').notNullable();
            table.string('slug').notNullable().unique();
            table.text('content').notNullable();
            table.string('category').notNullable();
            table.integer('views').defaultTo(0);
            table.boolean('is_solved').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('comments', function (table) {
            table.increments('id').primary();
            table.integer('post_id').unsigned().notNullable().references('id').inTable('posts').onDelete('CASCADE');
            table.integer('author_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.text('content').notNullable();
            table.boolean('is_accepted').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('comments')
        .dropTableIfExists('posts')
        .dropTableIfExists('users');
};
