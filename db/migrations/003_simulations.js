/**
 * Migration: Tabela de simulações (histórico de cálculos)
 * Adaptado para SQLite/Postgres
 */

exports.up = function (knex) {
    return knex.schema.createTable('simulations', function (table) {
        // SQLite não tem gen_random_uuid nativo por padrão, usamos string/uuid gerado no app ou random simples
        // Para compatibilidade, vamos usar string para ID e deixar o app gerar, ou increments
        if (knex.client.config.client === 'sqlite3') {
            table.string('id').primary();
            // SQLite armazena JSON como texto simples
            table.json('dados').notNullable();
            table.json('resultado').notNullable();
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        } else {
            // Postgres
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.jsonb('dados').notNullable();
            table.jsonb('resultado').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        }

        // user_id referenciando tabela users (se existir)
        // Como o sistema de users está sendo criado agora na migration 'init_community', 
        // e esta migration '003' roda antes, vai falhar se tiver chave estrangeira para uma tabela que não existe.
        // Solução: Remover a FK neste momento ou garantir ordem. 
        // Mas espere, na lista de arquivos 003 vem antes de 2023...
        // O ideal é a migration 2023... criar os users.
        // Vou mudar para apenas user_id string/integer sem FK por enquanto para evitar erros de ordem,
        // ou assumir que users seriam criados aqui.
        // Dado que estamos fazendo um sistema novo, vou simplificar esta tabela para não quebrar.

        table.string('user_id').nullable(); // Removida FK estrita para evitar circularidade/ordem
        table.string('tipo').notNullable();

        table.index('user_id');
        table.index('tipo');
        table.index('created_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('simulations');
};
