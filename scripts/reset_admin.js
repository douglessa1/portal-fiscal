const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev_v2.sqlite3');
const db = new sqlite3.Database(dbPath);

const SALT_ROUNDS = 10;
const ADMIN_EMAIL = 'admin@portal.com';
const NEW_PASSWORD = 'password123'; // Simple, robust password

async function resetAdmin() {
    console.log(`[RESET] Connecting to ${dbPath}...`);

    // 1. Hash new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, SALT_ROUNDS);
    console.log(`[RESET] Generated hash for '${NEW_PASSWORD}'`);

    // 2. Update DB
    db.run(
        `UPDATE users SET password_hash = ? WHERE email = ?`,
        [hashedPassword, ADMIN_EMAIL],
        function (err) {
            if (err) {
                return console.error('[ERROR]', err.message);
            }
            if (this.changes === 0) {
                console.log('[WARNING] Admin user not found. Creating one...');
                // Insert if not exists
                db.run(
                    `INSERT INTO users (name, email, password_hash, role, subscription_tier, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
                    ['Admin Force', ADMIN_EMAIL, hashedPassword, 'admin', 'auditor'],
                    function (insertErr) {
                        if (insertErr) console.error('[ERROR] Insert failed:', insertErr.message);
                        else console.log('[SUCCESS] Admin created with ID:', this.lastID);
                    }
                );
            } else {
                console.log(`[SUCCESS] Admin password reset. Rows affected: ${this.changes}`);
            }
        }
    );

    // 3. Verify
    db.all(`SELECT id, email, role, password_hash FROM users WHERE email = ?`, [ADMIN_EMAIL], (err, rows) => {
        if (err) console.error(err);
        console.log('[VERIFY] User in DB:', rows);
    });
}

resetAdmin();
