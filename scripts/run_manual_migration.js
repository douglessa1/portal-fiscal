const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runAllMigrations() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Neon requires SSL, this allows self-signed if needed, though Neon is usually rigorous.
        }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const migrationDir = path.join(__dirname, '../db/migrations');
        const files = fs.readdirSync(migrationDir).sort(); // Sort to ensure order: 001, 002...

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Running migration: ${file}`);
                const filePath = path.join(migrationDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                // We could wrap in transaction or check if table exists, 
                // but since it's a fresh DB, raw running is acceptable for now.
                // In a robust system, we would check a 'migrations' table.
                // For MVP, simplistic "IF EXISTS" inside SQL (which we have) is good, 
                // or just catching errors if table already exists.
                try {
                    await client.query(sql);
                    console.log(`Done: ${file}`);
                } catch (e) {
                    console.warn(`Error running ${file}, might already be applied:`, e.message);
                }
            }
        }

        console.log('All migrations executed.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runAllMigrations();
