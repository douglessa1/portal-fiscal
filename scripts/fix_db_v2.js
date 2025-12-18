const db = require('../lib/db');

async function fix() {
    console.log("Fixing DB via Knex Schema...");

    // 1. Posts
    const hasPosts = await db.schema.hasTable('posts');
    if (!hasPosts) {
        console.log("Creating posts table...");
        await db.schema.createTable('posts', (table) => {
            table.increments('id').primary();
            table.integer('author_id').notNullable();
            table.string('title').notNullable();
            table.string('slug').notNullable().unique();
            table.text('content').notNullable();
            table.string('category').notNullable();
            table.integer('views').defaultTo(0);
            table.boolean('is_solved').defaultTo(false);
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    } else {
        console.log("Posts table already exists (Knex).");
    }

    // 2. Comments
    const hasComments = await db.schema.hasTable('comments');
    if (!hasComments) {
        console.log("Creating comments table...");
        await db.schema.createTable('comments', (table) => {
            table.increments('id').primary();
            table.integer('post_id').notNullable();
            table.integer('author_id').notNullable();
            table.text('content').notNullable();
            table.boolean('is_accepted').defaultTo(false);
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    } else {
        console.log("Comments table already exists (Knex).");
    }

    // 3. Insert Default Post if empty
    const posts = await db('posts').select('id');
    if (posts.length === 0) {
        console.log("Seeding initial post...");
        // Need a user. Check users.
        const users = await db('users').select('id').limit(1);
        let authorId = 1;
        if (users.length > 0) authorId = users[0].id;
        else {
            // Create user? No, too risky.
            // If no users, we can't create post efficiently with FK?
            // SQLite might enforce FK.
            // Assume 'admin' seed exists?
        }

        if (users.length > 0) {
            await db('posts').insert({
                title: 'Bem-vindo ao Fórum Fiscal',
                slug: 'bem-vindo-forum',
                content: 'Este é o primeiro tópico oficial. O Fórum está aberto para discussões profissionais.',
                category: 'Geral',
                author_id: authorId
            });
        }
    }

    console.log("DB Fix V2 Complete.");
    process.exit(0);
}

fix().catch(err => {
    console.error(err);
    process.exit(1);
});
