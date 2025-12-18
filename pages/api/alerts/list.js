// pages/api/alerts/list.js
const db = require('../../../lib/db');

export default async function handler(req, res) {
    try {
        const result = await db.query('SELECT id, type, payload, created_at, read FROM fiscal_alerts ORDER BY created_at DESC LIMIT 100');
        return res.status(200).json({ rows: result.rows || [] });
    } catch (err) {
        console.error('alerts list error:', err);
        return res.status(500).json({ rows: [] });
    }
}
