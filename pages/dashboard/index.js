export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AppLayout from '../../components/Layout/AppLayout';
import { Button } from '../../components/ui/Button';
import {
    LayoutDashboard, Calculator, Calendar,
    TrendingUp, Users, MessageSquare, ArrowRight,
    Search, FileCheck, DollarSign
} from 'lucide-react';

export default function Dashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || 'Visitante';

    return (
        <div className="space-y-6">
            {/* Header Section - Clean & Flat */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        Visão Geral
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Bem-vindo de volta, {userName}. Aqui estão suas ferramentas frequentes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/forum/novo" passHref legacyBehavior>
                        <Button variant="outline" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Tira-Dúvidas
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Tools Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            Acesso Rápido
                        </h2>
                        <Link href="/ferramentas" className="text-sm text-primary hover:underline">Ver todas</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/ferramentas/difal" className="group">
                            <div className="h-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                                            <Calculator className="w-5 h-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-medium text-foreground">Calculadora DIFAL</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Cálculo de alíquota interestadual</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/ferramentas/nfe-validator" className="group">
                            <div className="h-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-md">
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-medium text-foreground">Validador NFe</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Auditoria de XML</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/ferramentas/icms-st" className="group">
                            <div className="h-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-500/10 text-blue-600 rounded-md">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-medium text-foreground">Cálculo ICMS-ST</h3>
                                    <p className="text-xs text-muted-foreground mt-1">MVA Ajustada e Substituição</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/ferramentas/calendario-fiscal" className="group">
                            <div className="h-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-amber-500/10 text-amber-600 rounded-md">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-medium text-foreground">Calendário Fiscal</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Agenda de Obrigações</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sidebar / Community - Clean Style */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        Comunidade
                    </h2>

                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <div className="p-5">
                            <h3 className="font-bold text-base mb-1">Fórum Fiscal</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Últimas discussões da comunidade técnica.
                            </p>

                            <div className="space-y-2 mb-4">
                                <Link href="/forum" className="block p-2 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        ICMS
                                    </div>
                                    <p className="text-sm text-foreground truncate">Dúvida sobre DIFAL SC x SP</p>
                                </Link>
                                <div className="h-px bg-border/50"></div>
                                <Link href="/forum" className="block p-2 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Reform Tributária
                                    </div>
                                    <p className="text-sm text-foreground truncate">Mudanças na CBS para 2026</p>
                                </Link>
                            </div>

                            <Link href="/forum" passHref legacyBehavior>
                                <Button className="w-full" variant="secondary">
                                    Acessar Fórum
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card/50">
                        <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-foreground">
                            <Search className="w-4 h-4" /> Busca Rápida
                        </h4>
                        <input
                            type="text"
                            placeholder="Buscar ferramenta, NCM, lei..."
                            className="w-full text-sm px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>
}
