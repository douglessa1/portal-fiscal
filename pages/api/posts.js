import knex from '../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Não autenticado' });
    }

    if (req.method === 'POST') {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
        }

        try {
            const [newPost] = await knex('posts')
                .insert({
                    title,
                    content,
                    user_id: session.user.id, // Assumindo que o ID do usuário está na sessão
                })
                .returning('*');

            return res.status(201).json(newPost);
        } catch (error) {
            console.error('Erro ao criar post:', error);
            return res.status(500).json({ error: 'Erro interno ao criar o post.' });
        }
    }

    // Adicionar lógica para GET (listar posts) aqui no futuro
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
}