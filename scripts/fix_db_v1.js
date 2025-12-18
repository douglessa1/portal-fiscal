const db = require('../lib/db');

async function fix() {
    console.log("Fixing DB for Forum V1...");

    // 1. Create Posts if missing
    try {
        await db.query('SELECT 1 FROM posts LIMIT 1');
        console.log('Posts table exists.');
    } catch (e) {
        console.log('Posts table missing. Creating...');
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    author_id INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    content TEXT NOT NULL,
                    category VARCHAR(255) NOT NULL,
                    views INTEGER DEFAULT 0,
                    is_solved BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);
            console.log('Posts table created.');
        } catch (err) {
            console.error('Error creating posts:', err.message);
        }
    }

    // 2. Create Comments if missing
    try {
        await db.query('SELECT 1 FROM comments LIMIT 1');
        console.log('Comments table exists.');
    } catch (e) {
        console.log('Comments table missing. Creating...');
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    author_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    is_accepted BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);
            console.log('Comments table created.');
        } catch (err) {
            console.error('Error creating comments:', err.message);
        }
    }

    console.log("DB Fix Complete.");
}

fix();
