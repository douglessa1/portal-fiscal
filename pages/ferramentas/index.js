export const dynamic = 'force-dynamic';
import Header from '../../components/Header';
import Sidebar from '../../components/Layout/Sidebar';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';
import {
    LayoutDashboard, FileText, FileCode,
    BarChart3, Truck, Building2, User,
    Search, ArrowRightLeft, ShieldCheck, Wrench
} from 'lucide-react';

export default function ToolsHub() {
    const categories = [
        {
            title: 'Reforma Tributária',
            icon: <ArrowRightLeft className="w-6 h-6 text-purple-600" />,
            description: 'Ferramentas adaptadas às novas regras do IBS e CBS.',
            tools: [
                { name: 'Simulador IBS/CBS', path: '/ferramentas/ibs-cbs', description: 'Simule a carga tributária no novo sistema dual.' },
                { name: 'Calculadora Transição', path: '/ferramentas/transicao', description: 'Entenda a regra de transição de 2026 a 2032.' },
            ]
        },
        {
            title: 'Microempreendedor (MEI)',
            icon: <User className="w-6 h-6 text-green-600" />,
            description: 'Soluções para o dia a dia do MEI.',
            tools: [
                { name: 'Cálculo de DAS', path: '/ferramentas/mei-das', description: 'Simule o valor da sua guia mensal.' },
                { name: 'Controle de Receitas', path: '/ferramentas/mei-receitas', description: 'Acompanhe seu limite de faturamento.' },
                { name: 'Relatório Mensal', path: '/ferramentas/mei-relatorio', description: 'Gere o relatório obrigatório.' },
            ]
        },
        {
            title: 'Gerenciamento Fiscal',
            icon: <Building2 className="w-6 h-6 text-blue-600" />,
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
            icon: <FileCode className="w-6 h-6 text-orange-600" />,
            description: 'Validadores e visualizadores de arquivos fiscais.',
            tools: [
                { name: 'Gerador DANFE', path: '/ferramentas/danfe-generator', description: 'Gere PDF a partir do XML.' },
                { name: 'Visualizador XML', path: '/ferramentas/xml-viewer', description: 'Leia XMLs de NFe e CFe em formato amigável.' },
                { name: 'Validador SPED', path: '/ferramentas/validador-sped', description: 'Verifique a estrutura do seu arquivo SPED.' },
            ]
        },
        {
            title: 'Gestão Empresarial',
            icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
            description: 'Ferramentas para tomada de decisão.',
            tools: [
                { name: 'Comparador Regimes', path: '/ferramentas/comparador-regimes', description: 'Lucro Presumido vs Real vs Simples.' },
                { name: 'Margem & Preço', path: '/ferramentas/calculadora-margem', description: 'Formação de preço de venda.' },
                { name: 'Gerador de Guias', path: '/ferramentas/gerador-guias', description: 'Emissão de DARF e GPS.' },
            ]
        },
        {
            title: 'Consultas Fiscais',
            icon: <Search className="w-6 h-6 text-teal-600" />,
            description: 'Consulte NCM, CFOP, CEST e alíquotas.',
            tools: [
                { name: 'Consulta NCM', path: '/ferramentas/ncm-consulta', description: '150+ NCMs com CEST e PIS/COFINS.' },
                { name: 'Consulta CFOP', path: '/ferramentas/cfop-consulta', description: 'CFOPs com CST sugerido.' },
                { name: 'Consulta CEST', path: '/ferramentas/cest-consulta', description: '70+ CESTs com MVA por segmento.' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-6 lg:p-12 pt-[100px] w-full max-w-7xl mx-auto">

                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-bold flex items-center justify-center md:justify-start gap-3 mb-3">
                            <Wrench className="w-10 h-10 text-primary" />
                            Central de Ferramentas
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Acesse nossa suíte completa de calculadoras fiscais, validadores e utilitários para simplificar a rotina contábil.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {categories.map((cat, idx) => (
                            <section key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                                    <div className="p-2 bg-muted rounded-lg">
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{cat.title}</h2>
                                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {cat.tools.map((tool, tIdx) => (
                                        <Link key={tIdx} href={tool.path}>
                                            <div className="group h-full bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                                                    {tool.name}
                                                    <ArrowRightLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
