import Head from 'next/head';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';

export default function AppLayout({ children, title = 'Portal Fiscal' }) {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-background">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Head>
                <title>{title}</title>
            </Head>

            {/* Top Navigation */}
            <Navbar />

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            {/* Added padding-left to account for Sidebar (lg:pl-64) and top (pt-[70px]) */}
            <main className="pt-[70px] transition-all duration-300 md:pl-20 lg:pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
