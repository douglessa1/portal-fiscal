export const dynamic = 'force-dynamic';
import { useSession } from 'next-auth/react';
import AppLayout from '../../components/Layout/AppLayout';
import SiteLayout from '../../components/Layout/SiteLayout';
import Link from 'next/link';
import {
    FileText, FileCode, BarChart3, Building2, User,
    Search, ArrowRightLeft, ShieldCheck, Wrench, ArrowRight
} from 'lucide-react';

export default function ToolsHub() {
    const categories = [
        {
            title: 'Reforma Tributária',
            icon: <ArrowRightLeft className="w-5 h-5" />,
            description: 'Ferramentas adaptadas às novas regras do IBS e CBS.',
            tools: [
                { name: 'Simulador IBS/CBS', path: '/ferramentas/ibs-cbs', description: 'Simule a carga tributária no novo sistema dual.' },
                { name: 'Calculadora Transição', path: '/ferramentas/transicao', description: 'Entenda a regra de transição de 2026 a 2032.' },
            ]
        },
        {
            title: 'Microempreendedor (MEI)',
            icon: <User className="w-5 h-5" />,
            description: 'Soluções para o dia a dia do MEI.',
            tools: [
                { name: 'Cálculo de DAS', path: '/ferramentas/mei-das', description: 'Simule o valor da sua guia mensal.' },
                { name: 'Controle de Receitas', path: '/ferramentas/mei-receitas', description: 'Acompanhe seu limite de faturamento.' },
                { name: 'Relatório Mensal', path: '/ferramentas/mei-relatorio', description: 'Gere o relatório obrigatório.' },
            ]
        },
        {
            title: 'Gerenciamento Fiscal',
            icon: <Building2 className="w-5 h-5" />,
            description: 'Cálculos essenciais para o departamento fiscal.',
            tools: [
                { name: 'DIFAL', path: '/ferramentas/difal', description: 'Diferencial de Alíquota ICMS.' },
                { name: 'ICMS-ST', path: '/ferramentas/icms-st', description: 'Substituição Tributária e MVA.' },
                { name: 'PIS/COFINS', path: '/ferramentas/pis-cofins', description: 'Créditos e débitos no regime não-cumulativo.' },
                { name: 'Simples Nacional', path: '/ferramentas/simples-nacional', description: 'Calculadora de anexos e alíquota efetiva.' },
            ]
        },
        {
            title: 'Utilitários & Documentos',
            icon: <FileCode className="w-5 h-5" />,
            description: 'Validadores e visualizadores de arquivos fiscais.',
            tools: [
                { name: 'Gerador DANFE', path: '/ferramentas/danfe-generator', description: 'Gere PDF a partir do XML.' },
                { name: 'Visualizador XML', path: '/ferramentas/xml-viewer', description: 'Leia XMLs de NFe e CFe em formato amigável.' },
                { name: 'Validador SPED', path: '/ferramentas/validador-sped', description: 'Verifique a estrutura do seu arquivo SPED.' },
            ]
        },
        {
            title: 'Gestão Empresarial',
            icon: <BarChart3 className="w-5 h-5" />,
            description: 'Ferramentas para tomada de decisão.',
            tools: [
                { name: 'Comparador Regimes', path: '/ferramentas/comparador-regimes', description: 'Lucro Presumido vs Real vs Simples.' },
                { name: 'Margem & Preço', path: '/ferramentas/calculadora-margem', description: 'Formação de preço de venda.' },
                { name: 'Gerador de Guias', path: '/ferramentas/gerador-guias', description: 'Emissão de DARF e GPS.' },
            ]
        },
        {
            title: 'Consultas Fiscais',
            icon: <Search className="w-5 h-5" />,
            description: 'Consulte NCM, CFOP, CEST e alíquotas.',
            tools: [
                { name: 'Consulta NCM', path: '/ferramentas/ncm-consulta', description: '150+ NCMs com CEST e PIS/COFINS.' },
                { name: 'Consulta CFOP', path: '/ferramentas/cfop-consulta', description: 'CFOPs com CST sugerido.' },
                { name: 'Consulta CEST', path: '/ferramentas/cest-consulta', description: '70+ CESTs com MVA por segmento.' },
            ]
        }
    ];

    const { data: session } = useSession();

    // Inner content (reused)
    const content = (
        <>
            <div className="mb-10 text-center md:text-left">
                {!session && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                        Catálogo Oficial 2025
                    </div>
                )}
                <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3 mb-2 text-foreground">
                    {session ? <Wrench className="w-8 h-8 text-primary" /> : null}
                    Central de Ferramentas
                </h1>
                <p className="text-muted-foreground max-w-2xl text-lg">
                    {session
                        ? 'Acesse nossa suíte completa de calculadoras fiscais, validadores e utilitários.'
                        : 'Ferramentas profissionais para contadores exigentes. Faça login para acesso completo.'}
                </p>
            </div>

            <div className="space-y-10">
                {categories.map((cat, idx) => (
                    <section key={idx}>
                        <div className="flex items-center gap-3 mb-4 border-b border-border pb-2">
                            <div className="p-2 bg-muted rounded-md text-foreground">
                                {cat.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{cat.title}</h2>
                                <p className="text-sm text-muted-foreground">{cat.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cat.tools.map((tool, tIdx) => (
                                <Link key={tIdx} href={tool.path}>
                                    <div className="group h-full bg-card border border-border rounded-lg p-4 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                                                {tool.name}
                                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {tool.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );

    if (session) {
        return <AppLayout>{content}</AppLayout>;
    }

    return (
        <SiteLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {content}
            </div>
        </SiteLayout>
    );
}
