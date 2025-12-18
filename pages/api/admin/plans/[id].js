import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            await db.query("DELETE FROM plans WHERE id = ?", [id]);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'PUT') {
        const { name, slug, price, interval, features, active } = req.body;
        try {
            await db.query(
                "UPDATE plans SET name = ?, slug = ?, price = ?, interval = ?, features = ?, active = ? WHERE id = ?",
                [name, slug, price, interval, JSON.stringify(features), active ? 1 : 0, id]
            );
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
