import { getSession } from "next-auth/react";
import db from "../../../../lib/db";
import { validatePostData, canAccessPostType } from "../../../../lib/community/postTypes";

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (req.method === 'GET') {
        try {
            // Buscar posts com dados do usuário e campos estruturados
            const posts = await db.query(`
                SELECT 
                    p.*, 
                    u.name as author_name, 
                    u.email as author_email,
                    u.role as author_role,
                    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
                LIMIT 50
            `);

            // Parse structured_data JSON para cada post
            const parsedPosts = (posts.rows || posts).map(post => ({
                ...post,
                structured_data: post.structured_data ? JSON.parse(post.structured_data) : null
            }));

            res.status(200).json(parsedPosts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'POST') {
        if (!session) return res.status(401).json({ error: 'Não autenticado' });

        const {
            title,
            content,
            category,
            // Novos campos estruturados
            post_type,
            reforma_tag,
            tributo,
            regime,
            uf_origem,
            uf_destino,
            tipo_operacao,
            base_legal,
            structured_data
        } = req.body;

        // Validar campos obrigatórios básicos
        if (!title || !content) {
            return res.status(400).json({ error: 'Título e conteúdo obrigatórios' });
        }

        // Validar tipo de post se fornecido
        if (post_type) {
            // Verificar acesso ao tipo de post baseado no plano do usuário
            const userPlan = session.user?.plan || 'free';
            if (!canAccessPostType(post_type, userPlan)) {
                return res.status(403).json({
                    error: 'Seu plano não permite criar este tipo de publicação. Faça upgrade para PRO.'
                });
            }

            // Validar campos estruturados do tipo
            const validationError = validatePostData(post_type, req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }
        }

        try {
            // Inserir post com todos os campos estruturados
            await db.query(
                `INSERT INTO posts (
                    user_id, 
                    title, 
                    content, 
                    category,
                    post_type,
                    reforma_tag,
                    tributo,
                    regime,
                    uf_origem,
                    uf_destino,
                    tipo_operacao,
                    base_legal,
                    structured_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    session.user.id,
                    title,
                    content,
                    category || 'Geral',
                    post_type || null,
                    reforma_tag || null,
                    tributo || null,
                    regime || null,
                    uf_origem || null,
                    uf_destino || null,
                    tipo_operacao || null,
                    base_legal || null,
                    structured_data ? JSON.stringify(structured_data) : null
                ]
            );

            res.status(201).json({ success: true });
        } catch (err) {
            console.error('Erro ao criar post:', err);
            res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
        }
    } else {
        res.status(405).end();
    }
}

