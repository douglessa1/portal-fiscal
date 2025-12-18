import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { db } from '../../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    // AUTH CHECK
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'Você precisa estar logado para responder.' });
    }

    const { id } = req.query; // Post ID
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo da resposta é obrigatório.' });
    }

    try {
        // Insert Comment
        await db('comments').insert({
            post_id: id,
            author_id: session.user.id,
            content,
            created_at: new Date()
        });

        return res.status(201).json({ success: true });
    } catch (error) {
        console.error('Create Reply Error:', error);
        return res.status(500).json({ error: 'Erro ao salvar resposta' });
    }
}
