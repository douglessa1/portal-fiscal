import db from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
        // Verificar se usuário já existe
        const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Inserir novo usuário
        // Determinar role: primeiro admin APENAS se explicitamente permitido
        const countUsers = await db.query('SELECT count(*) as count FROM users');
        const isFirstUser = countUsers.rows[0].count === 0 || countUsers.rows[0].count === '0';

        // SEGURANÇA: Primeiro usuário só vira admin se ALLOW_FIRST_ADMIN=true
        // Em produção, essa variável deve estar DESLIGADA por padrão
        const allowFirstAdmin = process.env.ALLOW_FIRST_ADMIN === 'true';
        const role = (isFirstUser && allowFirstAdmin) ? 'admin' : 'user';

        // Inserção compatível com PG e SQLite
        // SQLite não retorna RETURNING id por padrão em todas as versões/drivers no knex raw facilmente
        // Mas vamos tentar usar o knex builder se possível, mas aqui estamos usando raw query wrapper
        // Vamos usar raw insert

        await db.query(
            `INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [name, email, passwordHash, role]
        );

        return res.status(201).json({ message: 'Usuário criado com sucesso!', role });

    } catch (error) {
        console.error('Erro no registro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}
