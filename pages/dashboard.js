import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import { usePlan } from '../components/Permissions/PlanProvider';
import {
    Calculator, TrendingUp, TrendingDown, Calendar, Bell,
    ArrowRight, Activity, PieChart, Clock, FileText, Star
} from 'lucide-react';

// Obrigações fiscais próximas
const getUpcomingObligations = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const obligations = [];

    // DAS - dia 20
    if (day <= 20) {
        obligations.push({
            name: 'DAS Simples Nacional',
            date: new Date(today.getFullYear(), month, 20),
            daysLeft: 20 - day,
            type: 'simples'
        });
    }

    // EFD - dia 25
    if (day <= 25) {
        obligations.push({
            name: 'EFD ICMS/IPI',
            date: new Date(today.getFullYear(), month, 25),
            daysLeft: 25 - day,
            type: 'estadual'
        });
    }

    // GIA - dia 15 do próximo mês
    obligations.push({
        name: 'GIA',
        date: new Date(today.getFullYear(), month + 1, 15),
        daysLeft: new Date(today.getFullYear(), month + 1, 15) - today > 0
            ? Math.ceil((new Date(today.getFullYear(), month + 1, 15) - today) / (1000 * 60 * 60 * 24))
            : 30,
        type: 'estadual'
    });

    return obligations.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);
};

export default function Dashboard() {
    const { data: session } = useSession();
    const { plan, isPro, isAuditor, planInfo } = usePlan();
    const [stats, setStats] = useState({
        totalCalculations: 0,
        thisMonth: 0,
        savedAmount: 0,
        topTools: []
    });
    const [loading, setLoading] = useState(true);

    // Load stats from localStorage
    useEffect(() => {
        const loadStats = () => {
            try {
                // Aggregate from all tool histories
                const tools = ['difal', 'icms-st', 'pis-cofins', 'simples', 'retencoes', 'ibs-cbs', 'mei'];
                let total = 0;
                let thisMonth = 0;
                const toolCounts = {};

                tools.forEach(tool => {
                    const history = JSON.parse(localStorage.getItem(`${tool}_history`) || '[]');
                    total += history.length;
                    toolCounts[tool] = history.length;

                    // Count this month
                    const now = new Date();
                    history.forEach(item => {
                        const itemDate = new Date(item.timestamp);
                        if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
                            thisMonth++;
                        }
                    });
                });

                // Top tools
                const topTools = Object.entries(toolCounts)
                    .filter(([_, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([tool, count]) => ({
                        name: tool.toUpperCase().replace('-', ' '),
                        count
                    }));

                setStats({
                    totalCalculations: total,
                    thisMonth,
                    savedAmount: total * 12.50, // Estimate
                    topTools
                });
            } catch (e) {
                console.error('Error loading stats:', e);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const obligations = getUpcomingObligations();

    const quickLinks = [
        { name: 'Calculadora DIFAL', href: '/ferramentas/difal', icon: Calculator, color: 'blue' },
        { name: 'ICMS-ST / MVA', href: '/ferramentas/icms-st', icon: Calculator, color: 'green' },
        { name: 'Calendário Fiscal', href: '/ferramentas/calendario-fiscal', icon: Calendar, color: 'purple' },
        { name: 'Gerador DANFE', href: '/ferramentas/danfe-generator', icon: FileText, color: 'orange' }
    ];

    return (
        <>
            <Head>
                <title>Dashboard - Portal Fiscal</title>
            </Head>

            <div className="min-h-screen bg-background">
                <Navbar />
                <Sidebar />

                <main className="pl-64 pt-[70px]">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-foreground">
                                Olá, {session?.user?.name?.split(' ')[0] || 'Usuário'}! 👋
                            </h1>
                            <p className="text-muted-foreground">
                                Bem-vindo ao seu painel fiscal. Aqui está um resumo das suas atividades.
                            </p>
                        </div>

                        {/* Plan Badge */}
                        <div className={`mb-6 p-4 rounded-xl border ${isAuditor ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                                isPro ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' :
                                    'bg-muted/50 border-border'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className={`w-5 h-5 ${isAuditor ? 'text-amber-500' : isPro ? 'text-purple-500' : 'text-muted-foreground'
                                        }`} />
                                    <div>
                                        <span className="font-semibold text-foreground">
                                            Plano {planInfo?.name || 'FREE'}
                                        </span>
                                        <p className="text-xs text-muted-foreground">{planInfo?.description}</p>
                                    </div>
                                </div>
                                {!isAuditor && (
                                    <Link href="/planos" className="text-sm font-medium text-primary hover:underline">
                                        Fazer upgrade →
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-muted-foreground text-sm">Total de Cálculos</span>
                                    <Calculator className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-foreground">{stats.totalCalculations}</div>
                                <p className="text-xs text-muted-foreground mt-1">desde o início</p>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-muted-foreground text-sm">Este Mês</span>
                                    <Activity className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-foreground">{stats.thisMonth}</div>
                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stats.thisMonth > 0 ? 'Ativo' : 'Nenhum cálculo'}
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-muted-foreground text-sm">Economia Estimada</span>
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="text-3xl font-bold text-emerald-600">
                                    R$ {stats.savedAmount.toFixed(0)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">em tempo de trabalho</p>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-muted-foreground text-sm">Próximo Vencimento</span>
                                    <Clock className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="text-3xl font-bold text-foreground">
                                    {obligations[0]?.daysLeft || '-'}
                                    <span className="text-base font-normal text-muted-foreground ml-1">dias</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {obligations[0]?.name || 'Sem obrigações'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Quick Links */}
                            <div className="col-span-2 space-y-6">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickLinks.map((link, idx) => (
                                            <Link key={idx} href={link.href}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group">
                                                <div className={`w-10 h-10 rounded-lg bg-${link.color}-100 dark:bg-${link.color}-900/30 flex items-center justify-center`}>
                                                    <link.icon className={`w-5 h-5 text-${link.color}-600`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-foreground">{link.name}</div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Tools */}
                                {stats.topTools.length > 0 && (
                                    <div className="bg-card border border-border rounded-xl p-5">
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <PieChart className="w-5 h-5 text-primary" />
                                            Ferramentas Mais Usadas
                                        </h2>
                                        <div className="space-y-3">
                                            {stats.topTools.map((tool, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-8 text-center text-sm font-bold text-muted-foreground">
                                                        #{idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-foreground">{tool.name}</div>
                                                        <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                                                            <div
                                                                className="h-full bg-primary rounded-full"
                                                                style={{ width: `${(tool.count / stats.totalCalculations) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-foreground">{tool.count}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Obligations */}
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-amber-500" />
                                        Próximas Obrigações
                                    </h2>
                                    <div className="space-y-3">
                                        {obligations.map((ob, idx) => (
                                            <div key={idx} className={`p-3 rounded-lg border ${ob.daysLeft <= 5 ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                                                    ob.daysLeft <= 10 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' :
                                                        'border-border bg-muted/30'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-foreground">{ob.name}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ob.daysLeft <= 5 ? 'bg-red-600 text-white' :
                                                            ob.daysLeft <= 10 ? 'bg-amber-600 text-white' :
                                                                'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {ob.daysLeft} dias
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {ob.date.toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/ferramentas/calendario-fiscal"
                                        className="block text-center text-sm text-primary hover:underline mt-4">
                                        Ver calendário completo →
                                    </Link>
                                </div>

                                {/* PRO Upsell */}
                                {!isPro && (
                                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white">
                                        <h3 className="font-bold mb-2">Upgrade para PRO</h3>
                                        <p className="text-sm text-white/80 mb-4">
                                            Desbloqueie memória de cálculo, PDFs técnicos e histórico completo.
                                        </p>
                                        <Link href="/planos"
                                            className="block w-full py-2 bg-white text-purple-700 font-medium text-sm rounded-lg text-center hover:bg-white/90 transition-colors">
                                            Ver Planos
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
