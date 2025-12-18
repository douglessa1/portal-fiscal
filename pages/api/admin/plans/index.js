import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const result = await db.query("SELECT * FROM plans ORDER BY price ASC");
            const plans = result.rows.map(p => ({
                ...p,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
            }));
            res.status(200).json(plans);
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'POST') {
        const { name, slug, price, interval, features, active } = req.body;
        try {
            await db.query(
                "INSERT INTO plans (name, slug, price, interval, features, active) VALUES (?, ?, ?, ?, ?, ?)",
                [name, slug, price, interval, JSON.stringify(features), active ? 1 : 0]
            );
            res.status(201).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
