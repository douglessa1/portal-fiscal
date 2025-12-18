import { db } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        // Query posts com join em users para pegar nome do autor
        // Retorna os 50 mais recentes
        // Se posts table não tiver slug, usar ID. Tabela tem slug segundo migration.

        const posts = await db.query(`
            SELECT 
                p.id, p.title, p.slug, p.category, p.views, p.created_at, p.is_solved,
                u.name as author_name,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as reply_count
            FROM posts p
            JOIN users u ON p.author_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 50
        `);

        return res.status(200).json(posts.rows);
    } catch (error) {
        console.error('Forum Index Error:', error);
        return res.status(500).json({ error: 'Erro ao carregar tópicos' });
    }
}
