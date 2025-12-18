// pages/api/simples/history.js
const db = require('../../../lib/db');

export default async function handler(req, res) {
    try {
        const result = await db.query('SELECT id, rbt12, aliquota_efetiva, fator_r, data_calculo FROM simples_history ORDER BY data_calculo DESC LIMIT 200');
        return res.status(200).json({ rows: result.rows || [] });
    } catch (err) {
        console.error('history handler error:', err);
        return res.status(500).json({ rows: [] });
    }
}
