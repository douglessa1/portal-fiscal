import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { usePlan } from '../Permissions/PlanProvider';
import { PLANS } from '../../lib/permissions/featureFlags';
import {
    BarChart3, User, LayoutDashboard, FileCode,
    ArrowRightLeft, Menu, ChevronLeft, ChevronRight,
    ChevronDown, ShieldCheck, Lock, Calculator
} from 'lucide-react';

/**
 * Sidebar - Menu lateral profissional (SaaS / Notion Style)
 * Refactored for Robustness (Dec '25)
 */
export default function Sidebar() {
    const { data: session } = useSession();
    const { plan } = usePlan();
    const [isOpen, setIsOpen] = useState(true);
    const [openCategories, setOpenCategories] = useState(new Set());
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem('sidebar_open');
        if (saved !== null) setIsOpen(saved === 'true');
    }, []);

    // Auto-expand category based on current route
    useEffect(() => {
        const menuStructure = [
            { id: 'inicio', paths: ['/dashboard', '/ferramentas/calendario-fiscal'] },
            { id: 'calculadoras', paths: ['/ferramentas/difal', '/ferramentas/icms-st', '/ferramentas/pis-cofins', '/ferramentas/simples-nacional', '/ferramentas/retencoes', '/ferramentas/calculadora-margem'] },
            { id: 'mei', paths: ['/ferramentas/mei-das', '/ferramentas/mei-receitas', '/ferramentas/mei-relatorio'] },
            { id: 'reform', paths: ['/ferramentas/ibs-cbs', '/ferramentas/transicao', '/ferramentas/split-payment'] },
            { id: 'utils', paths: ['/ferramentas/xml-viewer', '/ferramentas/danfe-generator', '/ferramentas/nfe-validator', '/ferramentas/cfop-consulta', '/ferramentas/ncm-consulta'] },
            { id: 'inteligencia', paths: ['/ferramentas/bi-fiscal', '/ferramentas/ncm-finder', '/ferramentas/comparador-regimes'] },
            { id: 'auditoria', paths: ['/ferramentas/auditor-sped', '/ferramentas/validador-sped', '/ferramentas/monitor-nfe'] },
            { id: 'admin', paths: ['/admin', '/admin/plans', '/admin/finance', '/admin/reports', '/admin/users', '/admin/noticias/criar'] }
        ];

        const currentPath = router.pathname;
        const matchingCategory = menuStructure.find(cat => cat.paths.includes(currentPath));

        if (matchingCategory) {
            setOpenCategories(prev => {
                const next = new Set(prev);
                next.add(matchingCategory.id);
                return next;
            });
        }
    }, [router.pathname]);

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem('sidebar_open', newState.toString());
    };

    const toggleCategory = (category) => {
        setOpenCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    const isActive = (path) => router.pathname === path;
    const isCategoryOpen = (categoryId) => openCategories.has(categoryId);
    const isAdmin = session?.user?.role === 'admin';

    // MENU STRUCTURE - Ícones neutros por padrão (SaaS Style)
    const menuItems = [
        {
            id: 'inicio',
            icon: <LayoutDashboard className="w-4 h-4" />,
            label: 'Início',
            items: [
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/ferramentas/calendario-fiscal', label: 'Calendário Fiscal' }
            ]
        },
        {
            id: 'calculadoras',
            icon: <Calculator className="w-4 h-4" />,
            label: 'Calculadoras',
            items: [
                { path: '/ferramentas/difal', label: 'DIFAL' },
                { path: '/ferramentas/icms-st', label: 'ICMS-ST / MVA' },
                { path: '/ferramentas/pis-cofins', label: 'PIS/COFINS' },
                { path: '/ferramentas/simples-nacional', label: 'Simples Nacional' },
                { path: '/ferramentas/retencoes', label: 'Retenções na Fonte' },
                { path: '/ferramentas/calculadora-margem', label: 'Margem de Lucro' }
            ]
        },
        {
            id: 'mei',
            icon: <User className="w-4 h-4" />,
            label: 'MEI',
            items: [
                { path: '/ferramentas/mei-das', label: 'Cálculo de DAS' },
                { path: '/ferramentas/mei-receitas', label: 'Controle de Receitas', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/mei-relatorio', label: 'Relatório Mensal', badge: 'PRO', requiredPlan: 'pro' }
            ]
        },
        {
            id: 'reform',
            icon: <ArrowRightLeft className="w-4 h-4" />,
            label: 'Reforma Tributária',
            items: [
                { path: '/ferramentas/ibs-cbs', label: 'Cálculo IBS/CBS' },
                { path: '/ferramentas/transicao', label: 'Transição 2026-2033' },
                { path: '/ferramentas/split-payment', label: 'Split Payment' }
            ]
        },
        {
            id: 'utils',
            icon: <FileCode className="w-4 h-4" />,
            label: 'Utilitários',
            items: [
                { path: '/ferramentas/xml-viewer', label: 'Visualizador XML' },
                { path: '/ferramentas/danfe-generator', label: 'Gerador DANFE' },
                { path: '/ferramentas/nfe-validator', label: 'Validador NF-e' },
                { path: '/ferramentas/cfop-consulta', label: 'Consulta CFOP' },
                { path: '/ferramentas/ncm-consulta', label: 'Consulta NCM/CEST' }
            ]
        },
        {
            id: 'inteligencia',
            icon: <BarChart3 className="w-4 h-4" />,
            label: 'Inteligência',
            badge: 'PRO',
            items: [
                { path: '/ferramentas/bi-fiscal', label: 'BI Fiscal', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/ncm-finder', label: 'Classificador IA' },
                { path: '/ferramentas/comparador-regimes', label: 'Comparador Regimes', badge: 'PRO', requiredPlan: 'pro' }
            ]
        },
        {
            id: 'auditoria',
            icon: <ShieldCheck className="w-4 h-4" />,
            label: 'Auditoria',
            badge: 'PRO',
            items: [
                { path: '/ferramentas/auditor-sped', label: 'Auditor SPED', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/validador-sped', label: 'Validador SPED' },
                { path: '/ferramentas/monitor-nfe', label: 'Monitor de NF-e', badge: 'PRO', requiredPlan: 'pro' }
            ]
        }
    ];

    if (isAdmin) {
        menuItems.push({
            id: 'admin',
            icon: <ShieldCheck className="w-4 h-4 text-red-500" />,
            label: 'Admin',
            items: [
                { path: '/admin', label: 'Painel Geral' },
                { path: '/admin/plans', label: 'Planos' },
                { path: '/admin/users', label: 'Usuários' },
                { path: '/admin/noticias/criar', label: 'Criar Notícia' }
            ]
        });
    }

    const getBadgeClasses = (badge, isItemActive, isLocked) => {
        if (isItemActive) return 'bg-primary/10 text-primary border border-primary/20';
        if (isLocked) return 'bg-muted/50 text-muted-foreground border border-border';

        // Semantic variables
        if (badge === 'NOVO') return 'bg-[var(--badge-free-bg)] text-[var(--badge-free)] border border-transparent';
        if (badge === 'PRO') return 'bg-[var(--badge-pro-bg)] text-[var(--badge-pro)] border border-transparent';

        return 'bg-muted text-muted-foreground border border-border';
    };

    const isItemLocked = (item) => {
        if (!item.requiredPlan) return false;
        if (item.requiredPlan === 'pro') return plan === PLANS.FREE;
        if (item.requiredPlan === 'auditor') return plan !== PLANS.AUDITOR;
        return false;
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col`}
                style={{ paddingTop: '70px' }}
            >
                {/* Toggle Button Clean */}
                <button onClick={toggleSidebar}
                    className="absolute -right-3 top-24 bg-card border border-border text-muted-foreground hover:text-foreground rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-sm z-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
                    {menuItems.map((category) => {
                        const hasActiveItem = category.items.some(item => isActive(item.path));
                        const isOpenCat = isCategoryOpen(category.id);

                        return (
                            <div key={category.id} className="mb-1">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group relative
                                        ${hasActiveItem ? 'text-foreground font-medium'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-colors ${hasActiveItem ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {category.icon}
                                        </span>
                                        {isOpen && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{category.label}</span>
                                                {category.badge && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${getBadgeClasses(category.badge, false, false)}`}>
                                                        {category.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isOpen && (
                                        <span className={`text-muted-foreground/40 transition-transform duration-200 ${isOpenCat ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </span>
                                    )}
                                </button>

                                {isOpen && isOpenCat && (
                                    <div className="mt-1 space-y-0.5 relative">
                                        {/* Notion-style guide line */}
                                        <div className="absolute left-[1.1rem] top-0 bottom-0 w-px bg-border/40" />

                                        {category.items.map((item) => {
                                            const locked = isItemLocked(item);
                                            const active = isActive(item.path);
                                            return (
                                                <Link key={item.path} href={item.path}
                                                    className={`group flex items-center justify-between pl-10 pr-3 py-1.5 rounded-md text-sm transition-all duration-200 relative
                                                        ${active ? 'bg-primary/5 text-primary font-medium'
                                                            : locked ? 'text-muted-foreground/50 cursor-pointer'
                                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                        }`}>
                                                    <span className={`truncate ${locked ? 'opacity-60' : ''}`} title={item.label}>{item.label}</span>
                                                    <div className="flex items-center gap-1">
                                                        {locked && <Lock className="w-3 h-3 text-muted-foreground/40" />}
                                                        {item.badge && (
                                                            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 ${getBadgeClasses(item.badge, active, locked)}`}>
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity" onClick={() => setIsOpen(false)} />}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-72 bg-background border-r border-border transform transition-transform duration-300 z-50 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ paddingTop: '70px' }}>
                <nav className="p-4 overflow-y-auto h-full space-y-2">
                    {menuItems.map((category) => (
                        <div key={category.id} className="mb-2">
                            <button onClick={() => toggleCategory(category.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isCategoryOpen(category.id) ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:bg-muted/30'}`}>
                                <span className={isCategoryOpen(category.id) ? 'text-primary' : 'text-muted-foreground'}>{category.icon}</span>
                                <span className="flex-1 text-left text-sm font-medium">{category.label}</span>
                                <span className="text-muted-foreground/50">
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen(category.id) ? 'rotate-180' : ''}`} />
                                </span>
                            </button>
                            {isCategoryOpen(category.id) && (
                                <div className="ml-9 mt-1 space-y-1">
                                    {category.items.map((item) => {
                                        const locked = isItemLocked(item);
                                        return (
                                            <Link key={item.path} href={item.path}
                                                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isActive(item.path) ? 'text-primary font-medium bg-primary/5'
                                                    : locked ? 'text-muted-foreground/50'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                    }`} onClick={() => setIsOpen(false)}>
                                                <span>{item.label}</span>
                                                {locked && <Lock className="w-3 h-3 text-muted-foreground/50" />}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:hidden bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform active:scale-95 z-50">
                {isOpen ? <ChevronDown className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </>
    );
}
