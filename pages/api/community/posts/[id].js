import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // Get Post
            const postRes = await db.query(`
                SELECT p.*, u.name as author_name, u.role as author_role
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
            `, [id]);

            if (postRes.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const post = postRes.rows[0];

            // Get Comments
            const commentsRes = await db.query(`
                SELECT c.*, u.name as author_name, u.role as author_role
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
            `, [id]);

            res.status(200).json({ post, comments: commentsRes.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'POST') {
        // Add Comment (Answer)
        if (!session) return res.status(401).json({ error: 'Unauthorized' });

        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

        try {
            await db.query(
                "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
                [id, session.user.id, content]
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
