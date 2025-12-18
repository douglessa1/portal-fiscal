import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                // Buscar usuário no banco (Knex)
                const userResult = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
                const user = userResult.rows[0];

                if (!user) return null;

                // Verificar senha
                const isValid = await bcrypt.compare(credentials.password, user.password_hash);

                if (!isValid) return null;

                // Retornar objeto do usuário (sem senha)
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    subscription_tier: user.subscription_tier
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.subscription_tier = user.subscription_tier;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.subscription_tier = token.subscription_tier;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || 'dev_secret_key_123'
};

export default NextAuth(authOptions);
