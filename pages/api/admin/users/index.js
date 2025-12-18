import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const users = await db.query("SELECT id, name, email, role, plan, subscription_status, created_at FROM users ORDER BY created_at DESC");
            res.status(200).json(users.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
