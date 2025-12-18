const db = require('../lib/db');

async function check() {
    console.log("Checking DB...");
    try {
        const res = await db.query(`
            SELECT 
                p.id, p.title, p.category, p.created_at
            FROM posts p
            LIMIT 1
        `);
        console.log("Query Success:", res.rows);
    } catch (e) {
        console.error("Query Failed:", e.message);
    }
}

check();
