import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdminGuard({ children }) {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            // Se não estiver logado, manda pro login
            if (!session) {
                router.push('/auth/login');
                return;
            }

            // Se logado mas não for admin, manda pro dashboard normal e avisa (opcional)
            if (session.user.role !== 'admin') {
                router.push('/dashboard');
                return;
            }

            // Se for admin, libera
            setAuthorized(true);
        }
    }, [session, status, router]);

    if (loading || !authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground animate-pulse">Verificando privilégios de administrador...</p>
                </div>
            </div>
        );
    }

    return children;
}
