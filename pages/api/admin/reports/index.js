import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const reports = await db.query("SELECT r.*, u.name as user_name FROM reports r LEFT JOIN users u ON r.user_id = u.id ORDER BY created_at DESC");
            res.status(200).json(reports.rows);
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
