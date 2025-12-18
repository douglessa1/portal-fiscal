import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { db } from '../../../../lib/db';
import { v4 as uuidv4 } from 'uuid'; // Actually migration uses increments(id), not uuid. So no UUID.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    // AUTH CHECK
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'Você precisa estar logado para criar um tópico.' });
    }

    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    try {
        // Create slug from title (simple version)
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Append random string to ensure uniqueness if needed, or handle catch
        const uniqueSlug = `${slug}-${Date.now()}`;

        // Insert Post
        // Note: db.query returns result differently for PG vs SQLite
        // Using db('posts').insert() knex syntax is safer for cross-db return

        const [id] = await db('posts').insert({
            author_id: session.user.id,
            title,
            content,
            category,
            slug: uniqueSlug,
            created_at: new Date()
        }).returning('id'); // PG supports returning, SQLite might verify

        // Handle SQLite return (it returns [id] usually)

        return res.status(201).json({ id, slug: uniqueSlug });
    } catch (error) {
        console.error('Create Topic Error:', error);
        return res.status(500).json({ error: 'Erro ao criar tópico' });
    }
}
