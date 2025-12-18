import Link from 'next/link';
import SiteLayout from '../components/Layout/SiteLayout';
import { MOCK_NEWS } from '../lib/newsData';
import {
    Calculator, FileCheck, TrendingUp, ArrowRight,
    CheckCircle2, BarChart3, Users, Zap
} from 'lucide-react';

export default function Home({ recentArticles }) {
    const features = [
        {
            icon: <Calculator className="w-5 h-5" />,
            title: 'Cálculos Precisos',
            description: 'DIFAL, ICMS-ST, PIS/COFINS e mais de 30 ferramentas fiscais.'
        },
        {
            icon: <FileCheck className="w-5 h-5" />,
            title: 'Memória Técnica',
            description: 'Resultados auditáveis com base legal e passo-a-passo.'
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: 'Sempre Atualizado',
            description: 'Legislação vigente e mudanças da Reforma Tributária.'
        }
    ];

    const quickTools = [
        { name: 'DIFAL', href: '/ferramentas/difal', badge: 'Mais usado' },
        { name: 'ICMS-ST', href: '/ferramentas/icms-st', badge: 'FREE' },
        { name: 'Simples Nacional', href: '/ferramentas/simples-nacional', badge: 'FREE' },
        { name: 'Calendário Fiscal', href: '/ferramentas/calendario-fiscal', badge: 'FREE' },
        { name: 'Calculadora Margem', href: '/ferramentas/calculadora-margem', badge: 'FREE' },
        { name: 'Validador SPED', href: '/ferramentas/validador-sped', badge: 'PRO' }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero compacto */}
            <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                            Portal Fiscal 2025
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                            Ferramentas fiscais para contadores profissionais
                        </h1>
                        <p className="text-base text-muted-foreground mb-6 max-w-2xl">
                            Cálculos tributários com memória técnica, valida

                            ção de documentos e conformidade com a legislação vigente.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/ferramentas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                Ver Ferramentas
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/auth/register" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                                Criar Conta Grátis
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex gap-3">
                                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary h-fit">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ferramentas Rápidas */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Ferramentas Principais</h2>
                        <p className="text-sm text-muted-foreground">Acesso rápido às calculadoras mais utilizadas</p>
                    </div>
                    <Link href="/ferramentas" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                        Ver todas <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickTools.map((tool, idx) => (
                        <Link key={idx} href={tool.href} className="group flex flex-col p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all">
                            <div className="flex-1">
                                <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{tool.name}</div>
                            </div>
                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                                {tool.badge}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="border-t border-border bg-muted/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Calculator className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">30+</div>
                            <div className="text-sm text-muted-foreground">Ferramentas</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">5.000+</div>
                            <div className="text-sm text-muted-foreground">Usuários</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">100k+</div>
                            <div className="text-sm text-muted-foreground">Cálculos</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="border-t border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Crie sua conta gratuita e tenha acesso imediato às ferramentas essenciais.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg">
                            <CheckCircle2 className="w-5 h-5" />
                            Criar Conta Grátis
                        </Link>
                        <Link href="/planos" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                            Ver Planos PRO
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

Home.getLayout = function getLayout(page) {
    return <SiteLayout>{page}</SiteLayout>
}

export async function getServerSideProps() {
    const recentArticles = MOCK_NEWS.slice(0, 4);
    return {
        props: { recentArticles }
    };
}
