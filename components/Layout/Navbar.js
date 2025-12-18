import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { NotificationPanel } from '../Notifications/NotificationPanel';
import {
    User, LogOut, LayoutDashboard, Settings, ChevronDown,
    Calculator, FileSearch, TrendingUp, Zap, Briefcase, Newspaper,
    CreditCard, Menu, X, Building2, Bell
} from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

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
        { name: 'Auditor SPED Fiscal', href: '/ferramentas/auditor-sped', badge: 'AUDITOR' },
        { name: 'Validador SPED', href: '/ferramentas/validador-sped', badge: 'PRO' },
        { name: 'Monitor de NFe', href: '/ferramentas/monitor-nfe', badge: 'PRO' },
        { name: 'Relatórios Técnicos', href: '/auditoria/relatorios', badge: 'AUDITOR' },
    ];

    const inteligenciaMenu = [
        { name: 'BI Fiscal', href: '/ferramentas/bi-fiscal', badge: 'PRO' },
        { name: 'Comparador de Regimes', href: '/ferramentas/comparador-regimes', badge: 'PRO' },
        { name: 'Impacto Tributário', href: '/inteligencia/impacto', badge: 'PRO' },
    ];

    const reformaMenu = [
        { name: 'Transição 2026-2033', href: '/ferramentas/transicao', badge: 'FREE' },
        { name: 'IBS / CBS', href: '/ferramentas/ibs-cbs', badge: 'PRO' },
        { name: 'Split Payment', href: '/ferramentas/split-payment', badge: 'PRO' },
    ];

    const meiMenu = [
        { name: 'DAS', href: '/ferramentas/mei-das', badge: 'FREE' },
        { name: 'Controle de Receitas', href: '/ferramentas/mei-receitas', badge: 'FREE' },
        { name: 'Relatório Mensal', href: '/ferramentas/mei-relatorio', badge: 'PRO' },
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="flex items-center justify-between h-[70px] px-6 max-w-[1920px] mx-auto">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Branding / Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight tracking-tight text-foreground">Portal Fiscal</span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest hidden sm:block">Inteligência Tributária</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav - Mega Dropdowns */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Início
                    </Link>

                    <NavDropdown title="Ferramentas" icon={Calculator} items={ferramentasMenu} grouped={true} />
                    <NavDropdown title="Auditoria" icon={FileSearch} items={auditoriaMenu} />
                    <NavDropdown title="Inteligência" icon={TrendingUp} items={inteligenciaMenu} />
                    <NavDropdown title="Reforma" icon={Zap} items={reformaMenu} />
                    <NavDropdown title="MEI" icon={Briefcase} items={meiMenu} />

                    <Link href="/forum" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <Newspaper className="w-4 h-4 text-primary" />
                        Fórum Fiscal
                    </Link>

                    <Link href="/noticias" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <Newspaper className="w-4 h-4 text-primary" />
                        Notícias
                    </Link>
                    <Link href="/planos" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Planos
                    </Link>
                    <Link href="/api-docs" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        API
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:block">
                        <ThemeToggle />
                    </div>

                    <div className="h-6 w-px bg-border hidden sm:block"></div>

                    {session ? (
                        <>
                            <NotificationPanel />

                            <div className="relative">
                                <button onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10">
                                        <span className="text-sm font-bold text-primary">
                                            {user?.name?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <div className="hidden lg:block text-left mr-1">
                                        <div className="text-sm font-medium text-foreground truncate max-w-[100px]">
                                            {user?.name?.split(' ')[0]}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-5 py-3 border-b border-border bg-muted/30">
                                                <div className="text-sm font-semibold text-foreground">{user?.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                            </div>

                                            <div className="p-2 space-y-1">
                                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link href="/configuracoes" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                                                    <Settings className="w-4 h-4" /> Configurações
                                                </Link>
                                            </div>

                                            <div className="border-t border-border mt-1 pt-2 px-2">
                                                <button onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                                                    <LogOut className="w-4 h-4" /> Sair
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hover:bg-muted rounded-md hidden sm:block">
                                Entrar
                            </Link>
                            <Link href="/auth/register" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95">
                                Criar conta
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="p-4 space-y-2">
                        {/* Mobile interactions */}
                        <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Início
                        </Link>
                        <Link href="/ferramentas" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            Ferramentas
                        </Link>
                        {/* Add more mobile links as needed */}
                    </div>
                </div>
            )}
        </header>
    );
}
