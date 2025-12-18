import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    LayoutDashboard, FileText, CheckCircle, Calculator,
    Calendar, TrendingUp, Users, MessageSquare, ArrowRight,
    Search, AlertCircle
} from 'lucide-react';

export default function Dashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        calculosHoje: 12,
        perguntasComunidade: 3,
        notificacoes: 5
    });

    const userName = session?.user?.name || 'Visitante';

    return (
        <DashboardLayout title="Dashboard" type="user">
            {/* Welcome Hero */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="bg-primary/10 p-2 rounded-lg text-primary">
                            <LayoutDashboard className="w-8 h-8" />
                        </span>
                        Olá, {userName}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Aqui está o resumo das suas atividades fiscais hoje.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/comunidade/nova" passHref legacyBehavior>
                        <Button className="gap-2 shadow-lg hover:translate-y-[-2px] transition-transform">
                            <MessageSquare className="w-4 h-4" />
                            Dúvida Fiscal?
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="flex items-center gap-4 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cálculos Hoje</p>
                        <h3 className="text-2xl font-bold">{stats.calculosHoje}</h3>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 border-l-4 border-l-success shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="p-3 bg-success/10 rounded-full text-success">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">XMLs Processados</p>
                        <h3 className="text-2xl font-bold">85</h3>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 border-l-4 border-l-warning shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="p-3 bg-warning/10 rounded-full text-warning">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notificações</p>
                        <h3 className="text-2xl font-bold">{stats.notificacoes}</h3>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tools Shortcuts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Acesso Rápido
                        </h2>
                        <Link href="/ferramentas" className="text-sm text-primary hover:underline">Ver todas</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/ferramentas/difal">
                            <Card className="p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-accent/10 text-accent rounded-lg group-hover:scale-110 transition-transform">
                                        <Calculator className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-semibold text-lg">Calculadora DIFAL</h3>
                                <p className="text-xs text-muted-foreground mt-1">Cálculo de alíquota interestadual</p>
                            </Card>
                        </Link>

                        <Link href="/ferramentas/nfe-validator">
                            <Card className="p-4 hover:border-success/50 hover:shadow-md transition-all cursor-pointer group h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-success/10 text-success rounded-lg group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-semibold text-lg">Validador NFe</h3>
                                <p className="text-xs text-muted-foreground mt-1">Verificar validade de XML</p>
                            </Card>
                        </Link>

                        <Link href="/ferramentas/icms-st">
                            <Card className="p-4 hover:border-secondary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:scale-110 transition-transform">
                                        <Calculator className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-semibold text-lg">Cálculo ICMS-ST</h3>
                                <p className="text-xs text-muted-foreground mt-1">MVA Ajustada e Substituição</p>
                            </Card>
                        </Link>

                        <Link href="/ferramentas/calendario-fiscal">
                            <Card className="p-4 hover:border-warning/50 hover:shadow-md transition-all cursor-pointer group h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-warning/10 text-warning rounded-lg group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-semibold text-lg">Calendário Fiscal</h3>
                                <p className="text-xs text-muted-foreground mt-1">Vencimentos e Obrigações</p>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Community Spotlight */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Comunidade
                    </h2>

                    <Card className="gradient-brand relative overflow-hidden">
                        <div className="relative z-10 p-6">
                            <h3 className="font-bold text-lg mb-2 text-white">Participe das Discussões</h3>
                            <p className="text-sm text-white/90 mb-4">
                                Conecte-se com outros contadores, tire dúvidas e compartilhe conhecimento.
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <span className="truncate">Dúvida sobre DIFAL SC x SP</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <span className="truncate">Reforma tributária: mudanças CBS</span>
                                </div>
                            </div>

                            <Link href="/comunidade" passHref legacyBehavior>
                                <Button variant="secondary" className="w-full">
                                    Acessar Comunidade
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                            <Search className="w-4 h-4" /> Busca Rápida
                        </h4>
                        <input
                            type="text"
                            placeholder="Buscar NCM, CEST, Ferramenta..."
                            className="w-full text-sm px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
