import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';

/**
 * Higher-Order Component para proteger rotas
 * Redireciona para login se o usuário não estiver autenticado
 */
export function withAuth(Component) {
    return function ProtectedRoute(props) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.replace('/auth/login');
            }
        }, [user, loading, router]);

        // Mostrar loading enquanto verifica autenticação
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando...</p>
                    </div>
                </div>
            );
        }

        // Se não estiver logado, não renderizar (vai redirecionar)
        if (!user) {
            return null;
        }

        // Usuário autenticado, renderizar componente
        return <Component {...props} />;
    };
}
