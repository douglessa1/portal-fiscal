import { db } from '../../../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        // 1. Get Topic Details
        const topicResult = await db.query(`
            SELECT 
                p.*,
                u.name as author_name, u.role as author_role
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `, [id]);

        const topic = topicResult.rows[0];

        if (!topic) {
            return res.status(404).json({ error: 'Tópico não encontrado' });
        }

        // 2. Increment Views (Async, dont await strict)
        db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]).catch(console.error);

        // 3. Get Replies
        const repliesResult = await db.query(`
            SELECT 
                c.*,
                u.name as author_name, u.role as author_role, u.avatar_url
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.is_accepted DESC, c.created_at ASC
        `, [id]);

        return res.status(200).json({
            topic,
            replies: repliesResult.rows
        });

    } catch (error) {
        console.error('Topic Details Error:', error);
        return res.status(500).json({ error: 'Erro ao carregar tópico' });
    }
}
