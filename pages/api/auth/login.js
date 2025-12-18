import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const db = require('../../../lib/db');

/**
 * API Route: Login de usuário
 * POST /api/auth/login
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Buscar usuário no banco
        const result = await db.query(
            'SELECT id, email, password_hash, name FROM users WHERE email = $1',
            [email]
        );

        // Se não houver DB configurado, usar mock para desenvolvimento
        if (result.rows.length === 0 && !process.env.DATABASE_URL) {
            if (email === 'teste@local' && password === 'senha123') {
                const token = jwt.sign(
                    { sub: 'mock-user-id', email },
                    process.env.JWT_SECRET || 'dev_secret_key',
                    { expiresIn: '7d' }
                );
                return res.json({
                    success: true,
                    token,
                    user: { email, name: 'Usuário Teste' }
                });
            }
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { sub: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev_secret_key',
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Erro ao fazer login' });
    }
}
