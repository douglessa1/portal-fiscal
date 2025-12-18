import React from 'react';
import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import {
    LayoutDashboard, Wrench, Users, Newspaper, Settings,
    BarChart3, CreditCard, DollarSign, FileText, Bell
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Sidebar({ type = 'user' }) {
    const router = useRouter();

    const userNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Ferramentas', href: '/ferramentas', icon: Wrench },
        { name: 'Comunidade', href: '/comunidade', icon: Users },
        { name: 'Notícias', href: '/noticias', icon: Newspaper },
        { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    ];

    const adminNav = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Usuários', href: '/admin/users', icon: Users },
        { name: 'Planos', href: '/admin/plans', icon: CreditCard },
        { name: 'Finanças', href: '/admin/finance', icon: DollarSign },
        { name: 'Relatórios', href: '/admin/reports', icon: BarChart3 },
        { name: 'Notícias', href: '/admin/noticias/criar', icon: Newspaper },
        { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ];

    const navItems = type === 'admin' ? adminNav : userNav;

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card overflow-y-auto">
            <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export function DashboardLayout({
    children,
    title,
    description,
    type = 'user' // 'user' or 'admin'
}) {
    return (
        <div className="min-h-screen bg-background">
            <Head>
                <title>{title ? `${title} - Portal Fiscal` : 'Dashboard - Portal Fiscal'}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            <Header />

            <div className="flex">
                <Sidebar type={type} />

                <main className="flex-1 ml-64 p-8 pt-24">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
