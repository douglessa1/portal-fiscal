import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { usePlan } from '../Permissions/PlanProvider';
import { PLANS } from '../../lib/permissions/featureFlags';
import {
    BarChart3, Building2, User, LayoutDashboard, FileCode,
    ArrowRightLeft, Menu, ChevronLeft, ChevronRight,
    ChevronDown, ChevronRight as ChevronRightSmall, ShieldCheck, Lock, FileText, Calculator
} from 'lucide-react';

/**
 * Sidebar - Menu lateral organizado por tipo de acesso
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
        // Define menu structure inline to detect which category contains current path
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

    // MENU STRUCTURE - Organizdo por tipo de ferramenta e plano
    const menuItems = [
        {
            id: 'inicio',
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: 'Início',
            items: [
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/ferramentas/calendario-fiscal', label: 'Calendário Fiscal' }
            ]
        },
        {
            id: 'calculadoras',
            icon: <Calculator className="w-5 h-5 text-blue-500" />,
            label: 'Calculadoras Fiscais',
            description: 'Ferramentas de cálculo tributário',
            items: [
                { path: '/ferramentas/difal', label: 'DIFAL' },
                { path: '/ferramentas/icms-st', label: 'ICMS-ST / MVA' },
                { path: '/ferramentas/pis-cofins', label: 'PIS/COFINS' },
                { path: '/ferramentas/simples-nacional', label: 'Simples Nacional' },
                { path: '/ferramentas/retencoes', label: 'Retenções na Fonte' },
                { path: '/ferramentas/calculadora-margem', label: 'Calculadora de Margem' }
            ]
        },
        {
            id: 'mei',
            icon: <User className="w-5 h-5 text-green-600" />,
            label: 'MEI',
            items: [
                { path: '/ferramentas/mei-das', label: 'Cálculo de DAS' },
                { path: '/ferramentas/mei-receitas', label: 'Controle de Receitas', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/mei-relatorio', label: 'Relatório Mensal', badge: 'PRO', requiredPlan: 'pro' }
            ]
        },
        {
            id: 'reform',
            icon: <ArrowRightLeft className="w-5 h-5 text-purple-500" />,
            label: 'Reforma Tributária',
            items: [
                { path: '/ferramentas/ibs-cbs', label: 'Cálculo IBS/CBS' },
                { path: '/ferramentas/transicao', label: 'Transição 2026-2033' },
                { path: '/ferramentas/split-payment', label: 'Split Payment' }
            ]
        },
        {
            id: 'utils',
            icon: <FileCode className="w-5 h-5 text-orange-500" />,
            label: 'Utilitários XML/NF-e',
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
            icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
            label: 'Inteligência Fiscal',
            badge: 'PRO',
            items: [
                { path: '/ferramentas/bi-fiscal', label: 'BI Fiscal (Dashboards)', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/ncm-finder', label: 'Classificador NCM (IA)' },
                { path: '/ferramentas/comparador-regimes', label: 'Comparador de Regimes', badge: 'PRO', requiredPlan: 'pro' }
            ]
        },
        {
            id: 'auditoria',
            icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
            label: 'Auditoria',
            badge: 'PRO',
            items: [
                { path: '/ferramentas/auditor-sped', label: 'Auditor SPED Fiscal', badge: 'PRO', requiredPlan: 'pro' },
                { path: '/ferramentas/validador-sped', label: 'Validador SPED' },
                { path: '/ferramentas/monitor-nfe', label: 'Monitor de NF-e', badge: 'PRO', requiredPlan: 'pro' }
            ]
        }
    ];

    if (isAdmin) {
        menuItems.push({
            id: 'admin',
            icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
            label: 'Administração',
            items: [
                { path: '/admin', label: 'Painel Geral' },
                { path: '/admin/plans', label: 'Configurar Planos' },
                { path: '/admin/finance', label: 'Financeiro' },
                { path: '/admin/reports', label: 'Bugs & Reports' },
                { path: '/admin/users', label: 'Gerenciar Usuários' },
                { path: '/admin/noticias/criar', label: 'Criar Notícia' }
            ]
        });
    }

    const getBadgeClasses = (badge, isItemActive, isLocked) => {
        if (isItemActive) return 'bg-white/20 text-white border border-white/30';
        if (isLocked) return 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700';
        if (badge === 'NOVO') return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border border-green-300/50';
        if (badge === 'PRO') return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border border-purple-300/50';
        if (badge === 'AUDITOR') return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border border-amber-300/50';
        return 'bg-purple-100 text-purple-700 border border-purple-200';
    };

    const isItemLocked = (item) => {
        if (!item.requiredPlan) return false;
        if (item.requiredPlan === 'pro') return plan === PLANS.FREE;
        if (item.requiredPlan === 'auditor') return plan !== PLANS.AUDITOR;
        return false;
    };

    return (
        <>
            {/* Sidebar Desktop */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'} hidden md:block shadow-sm`}
                style={{ paddingTop: '70px' }}
            >
                <button onClick={toggleSidebar}
                    className="absolute -right-3 top-24 bg-background border border-border text-foreground rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-sm hover:bg-muted"
                    title={isOpen ? 'Recolher menu' : 'Expandir menu'}>
                    {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((category) => {
                        const hasActiveItem = category.items.some(item => isActive(item.path));
                        return (
                            <div key={category.id} className="mb-2">
                                <button onClick={() => toggleCategory(category.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${hasActiveItem ? 'bg-primary/5 text-primary border-l-2 border-primary'
                                        : isCategoryOpen(category.id) ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                        }`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-colors ${hasActiveItem || isCategoryOpen(category.id) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {category.icon}
                                        </span>
                                        {isOpen && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{category.label}</span>
                                                {category.badge && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shadow-sm ${getBadgeClasses(category.badge, false, false)}`}>
                                                        {category.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {isOpen && (
                                        <span className="text-muted-foreground/50">
                                            {isCategoryOpen(category.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRightSmall className="w-4 h-4" />}
                                        </span>
                                    )}
                                </button>

                                {isOpen && isCategoryOpen(category.id) && (
                                    <div className="mt-1 ml-4 pl-3 border-l border-border space-y-1">
                                        {category.items.map((item) => {
                                            const locked = isItemLocked(item);
                                            return (
                                                <Link key={item.path} href={item.path}
                                                    className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 border-l-4 ${isActive(item.path) ? 'bg-primary text-primary-foreground font-medium shadow-sm border-primary-foreground/30'
                                                        : locked ? 'text-muted-foreground/50 hover:bg-muted/30 border-transparent cursor-pointer'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/20 border-transparent hover:translate-x-0.5'
                                                        }`}>
                                                    <span className={`truncate ${locked ? 'opacity-60' : ''}`} title={item.label}>{item.label}</span>
                                                    <div className="flex items-center gap-1">
                                                        {locked && <Lock className="w-3 h-3 text-muted-foreground/50" />}
                                                        {item.badge && (
                                                            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 shadow-sm ${getBadgeClasses(item.badge, isActive(item.path), locked)}`}>
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
            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />}

            {/* Sidebar Mobile */}
            <aside className={`fixed top-0 left-0 h-screen w-72 bg-card border-r border-border transform transition-transform duration-300 z-40 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ paddingTop: '70px' }}>
                <nav className="p-4 overflow-y-auto h-full space-y-2">
                    {menuItems.map((category) => (
                        <div key={category.id} className="mb-2">
                            <button onClick={() => toggleCategory(category.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isCategoryOpen(category.id) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                                <span>{category.icon}</span>
                                <span className="flex-1 text-left text-sm font-semibold">{category.label}</span>
                                {category.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getBadgeClasses(category.badge, false, false)}`}>{category.badge}</span>}
                                <span className="text-muted-foreground/50">
                                    {isCategoryOpen(category.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRightSmall className="w-4 h-4" />}
                                </span>
                            </button>
                            {isCategoryOpen(category.id) && (
                                <div className="ml-4 mt-1 pl-4 border-l border-border space-y-1">
                                    {category.items.map((item) => {
                                        const locked = isItemLocked(item);
                                        return (
                                            <Link key={item.path} href={item.path}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.path) ? 'bg-primary text-primary-foreground font-semibold'
                                                    : locked ? 'text-muted-foreground/50 hover:bg-muted/30'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                    }`} onClick={() => setIsOpen(false)}>
                                                <span className={locked ? 'opacity-60' : ''}>{item.label}</span>
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

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:hidden bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-primary/90 transition-transform active:scale-95 z-50">
                {isOpen ? <ChevronDown className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </>
    );
}
