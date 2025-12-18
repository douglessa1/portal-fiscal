const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries for this specific user to avoid duplicates
    const email = 'admin@portal.com';

    // Check if exists
    const exists = await knex('users').where({ email }).first();
    if (exists) {
        console.log('Admin user already exists.');
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    // Inserts seed entries
    await knex('users').insert([
        {
            name: 'Administrador',
            email: email,
            password_hash: passwordHash,
            role: 'admin',
            reputation: 1000,
            created_at: knex.raw('CURRENT_TIMESTAMP')
        }
    ]);

    console.log('Admin user created: admin@portal.com / admin123');
};
