import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * AuthGate - Proteção de rotas que requerem autenticação
 * Uso: Envolver páginas de ferramentas que precisam de login
 */
export default function AuthGate({ children, redirectTo = '/auth/register' }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.replace({
                pathname: redirectTo,
                query: { callbackUrl: router.asPath }
            });
        }
    }, [session, status, router, redirectTo]);

    // Loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-sm">Carregando...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - return null while redirecting
    if (!session) {
        return null;
    }

    // Authenticated - render children
    return <>{children}</>;
}
