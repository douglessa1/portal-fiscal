import db from "../../lib/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await db.query("SELECT * FROM plans WHERE active = 1 ORDER BY price ASC");
            const plans = result.rows.map(p => ({
                ...p,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
            }));
            res.status(200).json(plans);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    } else {
        res.status(405).end();
    }
}
