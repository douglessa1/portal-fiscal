const db = require('../lib/db');
const bcrypt = require('bcryptjs'); // Need bcrypt for password if using auth logic later

async function fix() {
    console.log("Fixing DB V3 (Users + Posts + Comments)...");

    // 1. Users
    const hasUsers = await db.schema.hasTable('users');
    if (!hasUsers) {
        console.log("Creating users table...");
        await db.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table.string('role').defaultTo('user');
            table.integer('reputation').defaultTo(0);
            table.timestamp('created_at').defaultTo(db.fn.now());
            // Add other columns from enhanced migration to be safe?
            table.string('avatar_url');
        });

        // Seed Admin
        console.log("Seeding Admin User...");
        const hash = await bcrypt.hash('admin123', 10);
        await db('users').insert({
            name: 'Admin',
            email: 'admin@portalfiscal.com',
            password_hash: hash,
            role: 'admin'
        });
    } else {
        console.log("Users table exists.");
    }

    // 2. Posts
    const hasPosts = await db.schema.hasTable('posts');
    if (!hasPosts) {
        console.log("Creating posts table...");
        await db.schema.createTable('posts', (table) => {
            table.increments('id').primary();
            table.integer('author_id').notNullable(); // FK to users
            table.string('title').notNullable();
            table.string('slug').notNullable().unique();
            table.text('content').notNullable();
            table.string('category').notNullable();
            table.integer('views').defaultTo(0);
            table.boolean('is_solved').defaultTo(false);
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    } else {
        console.log("Posts table exists.");
    }

    // 3. Comments
    const hasComments = await db.schema.hasTable('comments');
    if (!hasComments) {
        console.log("Creating comments table...");
        await db.schema.createTable('comments', (table) => {
            table.increments('id').primary();
            table.integer('post_id').notNullable(); // FK
            table.integer('author_id').notNullable(); // FK
            table.text('content').notNullable();
            table.boolean('is_accepted').defaultTo(false);
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    } else {
        console.log("Comments table exists.");
    }

    // 4. Seed Post
    const count = await db('posts').count('id as count').first();
    if (count.count == 0) {
        console.log("Seeding Welcome Post...");
        const admin = await db('users').where('email', 'admin@portalfiscal.com').first();
        if (admin) {
            await db('posts').insert({
                title: 'Bem-vindo ao Fórum Fiscal',
                slug: 'bem-vindo',
                content: 'Bem-vindo à primeira versão do Fórum Fiscal. Espaço profissional para debates.',
                category: 'Geral',
                author_id: admin.id
            });
        }
    }

    console.log("DB Fix V3 Complete. Restart server might be needed if connections cached, but usually knex handles it.");
    process.exit(0);
}

fix().catch(err => {
    console.error(err);
    process.exit(1);
});
