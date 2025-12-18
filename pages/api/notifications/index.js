import { getSession } from "next-auth/react";
import db from "../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        try {
            const notifications = await db.query(`
                SELECT n.*, u.name as actor_name 
                FROM notifications n
                LEFT JOIN users u ON u.id = n.reference_id AND n.type = 'follow'
                WHERE n.user_id = ?
                ORDER BY n.created_at DESC
                LIMIT 50
            `, [session.user.id]);

            res.status(200).json(notifications.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'PUT') {
        // Mark as read
        try {
            await db.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [session.user.id]);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
