import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        const { status } = req.body; // 'closed', 'resolved'
        try {
            await db.query("UPDATE reports SET status = ? WHERE id = ?", [status, id]);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
