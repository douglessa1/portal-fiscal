import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// In-memory store (replace with database in production)
const sharedCalculations = new Map();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Create shared link
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        // Check if user has AUDITOR access (for sharing)
        const userPlan = session.user?.plan || 'free';
        const isAdmin = session.user?.role === 'admin';

        if (userPlan !== 'auditor' && !isAdmin) {
            return res.status(403).json({ error: 'Compartilhamento disponível apenas para plano AUDITOR' });
        }

        try {
            const { hash, type, data, expiresIn = 7 } = req.body;

            if (!hash || !type || !data) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }

            // Calculate expiration date
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + expiresIn);

            // Store calculation
            const sharedData = {
                hash,
                type,
                data,
                createdBy: session.user.email,
                createdAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString(),
                views: 0
            };

            sharedCalculations.set(hash, sharedData);

            // Generate share URL
            const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/calculo/${hash}`;

            return res.status(201).json({
                success: true,
                hash,
                shareUrl,
                expiresAt: expiresAt.toISOString()
            });
        } catch (error) {
            console.error('Error creating share:', error);
            return res.status(500).json({ error: 'Erro ao criar compartilhamento' });
        }
    }

    if (req.method === 'GET') {
        // Get shared calculation by hash
        const { hash } = req.query;

        if (!hash) {
            return res.status(400).json({ error: 'Hash não informado' });
        }

        const sharedData = sharedCalculations.get(hash);

        if (!sharedData) {
            return res.status(404).json({ error: 'Cálculo não encontrado ou expirado' });
        }

        // Check expiration
        if (new Date(sharedData.expiresAt) < new Date()) {
            sharedCalculations.delete(hash);
            return res.status(410).json({ error: 'Link expirado' });
        }

        // Increment views
        sharedData.views += 1;
        sharedCalculations.set(hash, sharedData);

        return res.status(200).json({
            success: true,
            type: sharedData.type,
            data: sharedData.data,
            hash: sharedData.hash,
            createdAt: sharedData.createdAt,
            expiresAt: sharedData.expiresAt,
            views: sharedData.views
        });
    }

    return res.status(405).json({ error: 'Método não permitido' });
}
