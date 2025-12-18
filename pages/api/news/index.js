import { db } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Tenta pegar do banco
            const articles = await db('articles').orderBy('created_at', 'desc').limit(20);
            return res.status(200).json(articles);
        } catch (error) {
            // Fallback se a tabela não existir
            console.error(error);
            return res.status(200).json([
                {
                    id: 'mock-1',
                    titulo: 'Reforma Tributária Aprovada: O que muda?',
                    resumo: 'Entenda os principais pontos da PEC 45/2019 e como o IBS vai impactar sua empresa.',
                    categoria: 'Destaque',
                    autor: 'Portal Fiscal',
                    imagem_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
                    created_at: new Date().toISOString(),
                    slug: 'reforma-tributaria-aprovada'
                },
                {
                    id: 'mock-2',
                    titulo: 'Tabela do Simples Nacional 2025',
                    resumo: 'Novos limites e anexos atualizados para o próximo ano fiscal.',
                    categoria: 'Simples Nacional',
                    autor: 'Portal Fiscal',
                    imagem_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=1000',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    slug: 'tabela-simples-2025'
                }
            ]);
        }
    }

    if (req.method === 'POST') {
        try {
            const { titulo, conteudo, resumo, imagem_url, categoria, slug } = req.body;

            // Simples validação
            if (!titulo || !slug) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }

            // Inserir
            // Usando SQLite compatible ID generation if needed, or simply letting DB handle it if UUID
            // For now, let's assume UUID gen in migration or pass one
            const id = Date.now().toString(); // Fallback ID

            await db('articles').insert({
                id, // Remove if auto-generated
                titulo,
                conteudo,
                resumo,
                imagem_url,
                categoria,
                slug,
                autor: 'Admin',
                publicado: true
            });

            return res.status(201).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao salvar notícia' });
        }
    }

    return res.status(405).end();
}
