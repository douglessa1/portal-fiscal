import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { id: targetUserId } = req.query; // The user to follow/unfollow
    const followerId = session.user.id;

    if (parseInt(targetUserId) === parseInt(followerId)) {
        return res.status(400).json({ error: 'Você não pode seguir a si mesmo' });
    }

    if (req.method === 'POST') {
        try {
            // Toggle Follow
            // Check if exists
            const existing = await db.query(
                "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
                [followerId, targetUserId]
            );

            if (existing.rows.length > 0) {
                // Unfollow
                await db.query(
                    "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
                    [followerId, targetUserId]
                );
                res.status(200).json({ following: false });
            } else {
                // Follow
                await db.query(
                    "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
                    [followerId, targetUserId]
                );

                // Create Notification
                await db.query(
                    "INSERT INTO notifications (user_id, type, reference_id, title, message) VALUES (?, ?, ?, ?, ?)",
                    [targetUserId, 'follow', followerId, 'Novo Seguidor', `${session.user.name} começou a te seguir.`]
                );

                res.status(200).json({ following: true });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
