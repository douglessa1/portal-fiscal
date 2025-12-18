/**
 * Migração: Adicionar colunas para posts estruturados
 * Execute com: node lib/migrations/add_structured_posts.js
 */

const db = require('../db');

async function migrate() {
    console.log('🔄 Iniciando migração: posts estruturados...');

    try {
        // Verificar se as colunas já existem
        const existingColumns = await db.query(`PRAGMA table_info(posts)`);
        const columnNames = existingColumns.map(c => c.name);

        const columnsToAdd = [
            { name: 'post_type', sql: 'ALTER TABLE posts ADD COLUMN post_type TEXT' },
            { name: 'reforma_tag', sql: 'ALTER TABLE posts ADD COLUMN reforma_tag TEXT' },
            { name: 'tributo', sql: 'ALTER TABLE posts ADD COLUMN tributo TEXT' },
            { name: 'regime', sql: 'ALTER TABLE posts ADD COLUMN regime TEXT' },
            { name: 'uf_origem', sql: 'ALTER TABLE posts ADD COLUMN uf_origem TEXT' },
            { name: 'uf_destino', sql: 'ALTER TABLE posts ADD COLUMN uf_destino TEXT' },
            { name: 'tipo_operacao', sql: 'ALTER TABLE posts ADD COLUMN tipo_operacao TEXT' },
            { name: 'base_legal', sql: 'ALTER TABLE posts ADD COLUMN base_legal TEXT' },
            { name: 'structured_data', sql: 'ALTER TABLE posts ADD COLUMN structured_data TEXT' } // JSON as TEXT for SQLite
        ];

        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name)) {
                console.log(`  ➕ Adicionando coluna: ${col.name}`);
                await db.query(col.sql);
            } else {
                console.log(`  ✓ Coluna já existe: ${col.name}`);
            }
        }

        // Criar índices para busca
        console.log('  📊 Criando índices...');

        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type)',
            'CREATE INDEX IF NOT EXISTS idx_posts_reforma_tag ON posts(reforma_tag)',
            'CREATE INDEX IF NOT EXISTS idx_posts_tributo ON posts(tributo)',
            'CREATE INDEX IF NOT EXISTS idx_posts_uf_origem ON posts(uf_origem)'
        ];

        for (const idx of indexes) {
            await db.query(idx);
        }

        console.log('✅ Migração concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    migrate().then(() => process.exit(0));
}

module.exports = { migrate };
