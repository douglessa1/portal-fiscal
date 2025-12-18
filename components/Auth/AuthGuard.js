import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = session?.user;

    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            const path = router.pathname;
            // Public paths that don't require login
            // Note: Update this list as we add public pages like /comunidade (public view)
            const publicPaths = [
                '/',
                '/auth/login',
                '/auth/register',
                '/noticias',
                '/noticias/[slug]',
                '/termos',
                '/privacidade',
                '/simulador-gratuito',
                '/ferramentas/nfe-validator', // Often public
                '/ferramentas/danfe-generator', // Often public
                '/noticias',
                '/noticias/[slug]'
            ];

            // Paths that are accessible to everyone, but if logged in, prevent access to auth pages like login
            const authPaths = ['/auth/login', '/auth/register'];

            // Check if current path is public
            // We allow direct match or subpaths (partially)
            const isPublic = publicPaths.includes(path) || path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/static');

            if (!user && !isPublic) {
                // Not logged in and trying to access protected route
                setAuthorized(false);
                router.push({
                    pathname: '/auth/login',
                    query: { returnUrl: router.asPath }
                });
            } else if (user && authPaths.includes(path)) {
                // Logged in and trying to access login/register
                setAuthorized(true);
                router.push('/dashboard');
            } else {
                setAuthorized(true);
            }
        }
    }, [user, loading, router.pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return authorized ? children : null;
}
