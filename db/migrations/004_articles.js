/**
 * Migration: Tabela de artigos do blog
 * Adaptado para SQLite/Postgres
 */

exports.up = function (knex) {
    return knex.schema.createTable('articles', function (table) {
        if (knex.client.config.client === 'sqlite3') {
            table.string('id').primary(); // ID string gerado pelo app
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        } else {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }

        table.string('titulo').notNullable();
        table.string('slug').unique().notNullable();
        table.text('conteudo').notNullable();
        table.string('categoria').notNullable();
        table.string('autor').defaultTo('Portal Fiscal');
        table.text('resumo');
        table.string('imagem_url');
        table.boolean('publicado').defaultTo(true);

        table.index('slug');
        table.index('categoria');
        table.index(['publicado', 'created_at']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('articles');
};
