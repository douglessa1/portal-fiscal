import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/Button';
import Badge from './ui/Badge';
import {
    User, LogOut, LayoutDashboard, Settings, Bell, ChevronDown,
    Calculator, FileSearch, TrendingUp, Zap, Briefcase, Newspaper,
    CreditCard, Menu, X
} from 'lucide-react';

export default function Header() {
    const { data: session } = useSession();
    const user = session?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        if (session) {
            fetch('/api/notifications')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setUnreadCount(data.filter(n => !n.is_read).length);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [session]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
            setMenuOpen(false);
        };

        if (activeDropdown || menuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeDropdown, menuOpen]);

    const ferramentasMenu = [
        {
            title: 'ICMS',
            items: [
                { name: 'DIFAL', href: '/ferramentas/difal', badge: 'FREE', star: true },
                { name: 'ICMS-ST', href: '/ferramentas/icms-st', badge: 'FREE' },
                { name: 'MVA Ajustada', href: '/ferramentas/mva-ajustada', badge: 'FREE' },
            ]
        },
        {
            title: 'Tributos Federais',
            items: [
                { name: 'PIS/COFINS', href: '/ferramentas/pis-cofins', badge: 'PRO' },
                { name: 'Retenções', href: '/ferramentas/retencoes', badge: 'PRO' },
            ]
        },
        {
            title: 'Regimes',
            items: [
                { name: 'Comparador de Regimes', href: '/ferramentas/comparador-regimes', badge: 'PRO' },
            ]
        },
    ];

    const auditoriaMenu = [
        { name: 'Auditor SPED Fiscal', href: '/auditoria/sped-fiscal', badge: 'AUDITOR' },
        { name: 'Validador SPED', href: '/auditoria/validador', badge: 'PRO' },
        { name: 'Monitor de NFe', href: '/auditoria/monitor-nfe', badge: 'PRO' },
        { name: 'Relatórios Técnicos', href: '/auditoria/relatorios', badge: 'AUDITOR' },
    ];

    const inteligenciaMenu = [
        { name: 'BI Fiscal', href: '/inteligencia/bi-fiscal', badge: 'PRO' },
        { name: 'Comparador de Regimes', href: '/ferramentas/comparador-regimes', badge: 'PRO' },
        { name: 'Impacto Tributário', href: '/inteligencia/impacto', badge: 'PRO' },
    ];

    const reformaMenu = [
        { name: 'Transição 2026-2033', href: '/reforma/transicao', badge: 'FREE' },
        { name: 'IBS / CBS', href: '/reforma/ibs-cbs', badge: 'PRO' },
        { name: 'Split Payment', href: '/reforma/split-payment', badge: 'PRO' },
    ];

    const meiMenu = [
        { name: 'DAS', href: '/mei/das', badge: 'FREE' },
        { name: 'Controle de Receitas', href: '/mei/receitas', badge: 'FREE' },
        { name: 'Relatório Mensal', href: '/mei/relatorio', badge: 'PRO' },
    ];

    const NavDropdown = ({ title, items, icon: Icon, grouped = false }) => {
        const isOpen = activeDropdown === title;

        return (
            <div
                className="relative"
                onMouseEnter={() => setActiveDropdown(title)}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${isOpen
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                    onClick={() => setActiveDropdown(isOpen ? null : title)}
                >
                    {Icon && <Icon className={`w-4 h-4 ${isOpen ? 'text-primary' : ''}`} />}
                    {title}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {grouped ? (
                            items.map((group, idx) => (
                                <div key={idx}>
                                    {idx > 0 && <div className="my-2 border-t border-border" />}
                                    <div className="px-3 py-1">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                            {group.title}
                                        </div>
                                        {group.items.map((item, itemIdx) => (
                                            <Link
                                                key={itemIdx}
                                                href={item.href}
                                                className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors group"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {item.star && <span className="text-yellow-500">⭐</span>}
                                                    {item.name}
                                                </span>
                                                <Badge variant={item.badge}>{item.badge}</Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            items.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                    onClick={() => setActiveDropdown(null)}
                                >
                                    <span>{item.name}</span>
                                    <Badge variant={item.badge}>{item.badge}</Badge>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded flex items-center justify-center text-primary-foreground font-bold text-sm bg-gradient-to-br from-primary to-blue-600 shadow-sm">
                            PF
                        </div>
                        <span className="font-semibold transition text-foreground">
                            Portal Fiscal
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Início
                        </Link>

                        <NavDropdown
                            title="Ferramentas"
                            icon={Calculator}
                            items={ferramentasMenu}
                            grouped={true}
                        />

                        <NavDropdown
                            title="Auditoria"
                            icon={FileSearch}
                            items={auditoriaMenu}
                        />

                        <NavDropdown
                            title="Inteligência"
                            icon={TrendingUp}
                            items={inteligenciaMenu}
                        />

                        <NavDropdown
                            title="Reforma"
                            icon={Zap}
                            items={reformaMenu}
                        />

                        <NavDropdown
                            title="MEI"
                            icon={Briefcase}
                            items={meiMenu}
                        />

                        <Link href="/noticias" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <Newspaper className="w-4 h-4 text-primary" />
                            Notícias
                        </Link>

                        <Link href="/planos" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-primary" />
                            Planos
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle - Desktop only */}
                        <div className="hidden lg:block">
                            <ThemeToggle />
                        </div>

                        {user ? (
                            <>
                                {/* Notifications - Desktop only */}
                                <Link href="/notificacoes" className="hidden lg:flex relative text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-primary/10">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-background"></span>
                                    )}
                                </Link>

                                {/* User Menu - Desktop */}
                                <div className="hidden lg:block relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen(!menuOpen);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                                            {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {user.name || user.email}
                                        </span>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <Link href="/dashboard"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Link>

                                                <Link href={`/perfil/${user.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    <User className="w-4 h-4" /> Meu Perfil
                                                </Link>

                                                {user.role === 'admin' && (
                                                    <Link href="/admin"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
                                                        onClick={() => setMenuOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" /> Painel Admin
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-border py-1">
                                                <button
                                                    onClick={() => {
                                                        signOut({ callbackUrl: '/auth/login' });
                                                        setMenuOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sair
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link href="/auth/login" passHref legacyBehavior>
                                    <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                        Entrar
                                    </Button>
                                </Link>
                                <Link href="/auth/register" passHref legacyBehavior>
                                    <Button variant="default" size="sm" className="text-white shadow-md">
                                        Criar conta
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-border bg-background">
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                        <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Início
                        </Link>
                        <Link href="/ferramentas/difal" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Ferramentas
                        </Link>
                        <Link href="/noticias" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Notícias
                        </Link>
                        <Link href="/comunidade" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Comunidade
                        </Link>
                        <Link href="/planos" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Planos
                        </Link>

                        {user ? (
                            <>
                                <div className="border-t border-border my-2 pt-2">
                                    <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <Link href={`/perfil/${user.id}`} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                                        Meu Perfil
                                    </Link>
                                    <Link href="/notificacoes" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                                        Notificações {unreadCount > 0 && `(${unreadCount})`}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut({ callbackUrl: '/auth/login' });
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-border my-2 pt-2 space-y-2">
                                <Link href="/auth/login" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                                    Entrar
                                </Link>
                                <Link href="/auth/register" className="block px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setMobileMenuOpen(false)}>
                                    Criar conta
                                </Link>
                            </div>
                        )}

                        <div className="border-t border-border pt-2">
                            <div className="px-3 py-2">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
