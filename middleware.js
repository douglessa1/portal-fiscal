import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/register',
    '/planos',
    '/api-docs',
    '/noticias',
    '/termos',
    '/privacidade',
    '/contato'
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. Allow static files and API auth routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api/auth') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 2. Check strict public routes (exact match or subpaths for news)
    const isPublic = PUBLIC_ROUTES.some(route =>
        pathname === route ||
        (route !== '/' && pathname.startsWith(route))
    );

    if (isPublic) {
        return NextResponse.next();
    }

    // 3. Check Authentication
    // 'next-auth.session-token' is used in dev (http), '__Secure-' prefix in prod (https)
    // We use getToken helper which handles this automatically
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'dev_secret_key_123' });

    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // 4. Admin Protection
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
