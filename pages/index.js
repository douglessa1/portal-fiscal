import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/Blog/ArticleCard';
import { getAllArticles } from '../lib/articles';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
    Calculator, FileCheck, FileText, Search, BarChart3,
    Scale, Calendar, CalendarClock, TrendingUp, Mail,
    Newspaper, Wrench, ArrowRight, CheckCircle2, AlertTriangle,
    Info, ExternalLink
} from 'lucide-react';

// Base de dados completa de ferramentas para a busca
const ALL_TOOLS = [
    { title: 'Calculadora DIFAL', link: '/ferramentas/difal', icon: <BarChart3 className="w-5 h-5" />, desc: 'Cálculo de Diferencial de Alíquota' },
    { title: 'Cálculo ICMS-ST', link: '/ferramentas/icms-st', icon: <Calculator className="w-5 h-5" />, desc: 'Substituição Tributária e MVA' },
    { title: 'PIS/COFINS', link: '/ferramentas/pis-cofins', icon: <PercentIcon className="w-5 h-5" />, desc: 'Cálculo de contribuições' },
    { title: 'Consulta CEST', link: '/ferramentas/cest-consulta', icon: <Search className="w-5 h-5" />, desc: 'Busca de código CEST' },
    { title: 'Validador NFe', link: '/ferramentas/nfe-validator', icon: <FileCheck className="w-5 h-5" />, desc: 'Validação de XML' },
    { title: 'Gerador DANFE', link: '/ferramentas/danfe-generator', icon: <FileText className="w-5 h-5" />, desc: 'Gerar PDF de XML' },
    { title: 'Validador SPED', link: '/ferramentas/validador-sped', icon: <FileCheck className="w-5 h-5" />, desc: 'Validação de arquivos SPED' },
    { title: 'Margem de Lucro', link: '/ferramentas/calculadora-margem', icon: <TrendingUp className="w-5 h-5" />, desc: 'Formação de preço' },
    { title: 'Comparador Regimes', link: '/ferramentas/comparador-regimes', icon: <Scale className="w-5 h-5" />, desc: 'Simples vs Presumido vs Real' },
    { title: 'Calendário Fiscal', link: '/ferramentas/calendario-fiscal', icon: <Calendar className="w-5 h-5" />, desc: 'Datas de obrigações' },
    { title: 'Gerador de Guias', link: '/ferramentas/gerador-guias', icon: <FileText className="w-5 h-5" />, desc: 'Emissão de DARF e GNRE' },
];

function PercentIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
        </svg>
    )
}

function SearchWidget() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = (e) => {
        const text = e.target.value;
        setQuery(text);
        if (text.length > 0) {
            const filtered = ALL_TOOLS.filter(tool =>
                tool.title.toLowerCase().includes(text.toLowerCase()) ||
                tool.desc.toLowerCase().includes(text.toLowerCase())
            );
            setResults(filtered);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    };

    return (
        <Card title="Busca Rápida" className="relative" ref={wrapperRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Buscar ferramenta..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => query.length > 0 && setShowResults(true)}
                />
            </div>

            {showResults && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.length > 0 ? (
                        <ul className="py-1">
                            {results.map((tool, idx) => (
                                <li key={idx}>
                                    <Link href={tool.link} className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <div className="font-medium text-sm flex items-center gap-2">
                                            {tool.icon}
                                            {tool.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground ml-7">{tool.desc}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">Nenhuma ferramenta encontrada.</div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs mt-4">
                <span onClick={() => { setQuery('DIFAL'); handleSearch({ target: { value: 'DIFAL' } }) }} className="px-2 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">#DIFAL</span>
                <span onClick={() => { setQuery('ICMS'); handleSearch({ target: { value: 'ICMS' } }) }} className="px-2 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">#ICMS</span>
                <span onClick={() => { setQuery('NFe'); handleSearch({ target: { value: 'NFe' } }) }} className="px-2 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">#NFe</span>
            </div>
        </Card>
    );
}

export default function Home({ recentArticles }) {
    // Agrupamento de ferramentas por categoria (usando ícones Lucide)
    const toolCategories = [
        {
            title: 'Cálculos Fiscais',
            tools: [
                { title: 'DIFAL', link: '/ferramentas/difal', icon: <BarChart3 className="w-6 h-6" />, desc: 'Cálculo de Diferencial de Alíquota', star: true, badge: 'FREE' },
                { title: 'ICMS-ST', link: '/ferramentas/icms-st', icon: <Calculator className="w-6 h-6" />, desc: 'Substituição Tributária e MVA', badge: 'FREE' },
                { title: 'PIS/COFINS', link: '/ferramentas/pis-cofins', icon: <PercentIcon className="w-6 h-6" />, desc: 'Cálculo de contribuições', badge: 'PRO' },
            ]
        },
        {
            title: 'Consultas & Validadores',
            tools: [
                { title: 'Consulta CEST', link: '/ferramentas/cest-consulta', icon: <Search className="w-6 h-6" />, desc: 'Busca de código CEST', badge: 'FREE' },
                { title: 'Validador NFe', link: '/ferramentas/nfe-validator', icon: <CheckCircle2 className="w-6 h-6" />, desc: 'Validação de XML', badge: 'FREE' },
                { title: 'Gerador DANFE', link: '/ferramentas/danfe-generator', icon: <FileText className="w-6 h-6" />, desc: 'Gerar PDF de XML', badge: 'PRO' },
            ]
        },
        {
            title: 'Planejamento',
            tools: [
                { title: 'Margem de Lucro', link: '/ferramentas/calculadora-margem', icon: <TrendingUp className="w-6 h-6" />, desc: 'Formação de preço', badge: 'FREE' },
                { title: 'Comparador', link: '/ferramentas/comparador-regimes', icon: <Scale className="w-6 h-6" />, desc: 'Simples vs Presumido vs Real', badge: 'PRO' },
                { title: 'Calendário', link: '/ferramentas/calendario-fiscal', icon: <Calendar className="w-6 h-6" />, desc: 'Datas de obrigações', badge: 'FREE' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Header />

            {/* Portal Hero - Mais Profissional */}
            <section className="relative bg-gradient-to-b from-primary/5 to-background border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Portal Fiscal 2025
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                                Cálculos fiscais com memória, <br />
                                <span className="text-primary">
                                    prova técnica e auditoria
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                                DIFAL, ICMS-ST, SPED e Reforma Tributária com evidência legal.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Baseado na legislação vigente</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Pensado para contadores e analistas fiscais</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Resultados auditáveis</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/ferramentas/nfe-validator" passHref legacyBehavior>
                                    <Button className="h-12 px-6 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Validar NFe Grátis
                                    </Button>
                                </Link>
                                <Link href="/ferramentas/difal" passHref legacyBehavior>
                                    <Button variant="outline" className="h-12 px-6 text-base gap-2 bg-background/50 backdrop-blur-sm hover:bg-accent">
                                        <BarChart3 className="w-5 h-5" />
                                        Calcular DIFAL
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Highlights Card */}
                        <div className="hidden lg:block relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-card border border-border rounded-xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                            Atualizações Rápidas
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">Últimas mudanças na legislação fiscal</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="mt-1 p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Novas regras do Simples Nacional 2024</p>
                                            <p className="text-xs text-muted-foreground mt-1">Vigência a partir de 01/01 - Veja os novos anexos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="mt-1 p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                            <Calculator className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">ICMS-ST: MVA Ajustada atualizada</p>
                                            <p className="text-xs text-muted-foreground mt-1">Confira as novas tabelas por estado de destino</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                            <Scale className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Reforma Tributária: IBS e CBS</p>
                                            <p className="text-xs text-muted-foreground mt-1">Simulador de impacto disponível</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - Portal Layout */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column (Tools & News) */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Tools Section */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                    Ferramentas Profissionais
                                </h2>
                                <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
                                    Ver todas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {toolCategories.map((category, idx) => (
                                    <Card key={idx} title={category.title} className="hover:shadow-lg transition-all duration-300 border-border/60">
                                        <ul className="space-y-2 mt-2">
                                            {category.tools.map((tool, tIdx) => (
                                                <li key={tIdx}>
                                                    <Link href={tool.link} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/80 transition-all group border border-transparent hover:border-border/50">
                                                        <span className="p-2 bg-muted rounded-md text-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                            {tool.icon}
                                                        </span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex justify-between items-center">
                                                                <span className="flex items-center gap-1.5">
                                                                    {tool.star && <span className="text-yellow-500">⭐</span>}
                                                                    {tool.title}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    {tool.badge && (
                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${tool.badge === 'FREE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                                            tool.badge === 'PRO' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                                                                'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                                            }`}>
                                                                            {tool.badge}
                                                                        </span>
                                                                    )}
                                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tool.desc}</div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                ))}

                                <Link href="/dashboard" className="group">
                                    <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-dashed border-2 flex flex-col items-center justify-center text-center p-8 space-y-4 hover:border-primary/50 transition-colors cursor-pointer group-hover:bg-primary/10">
                                        <div className="p-4 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                            <Wrench className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Catálogo Completo</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Acesse todas as ferramentas disponíveis no painel.</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="mt-2 text-primary">Acessar Painel</Button>
                                    </Card>
                                </Link>
                            </div>
                        </section>

                        {/* News Section */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Newspaper className="w-6 h-6" />
                                        </div>
                                        Notícias Fiscais
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Acompanhe atualizações fiscais relevantes</p>
                                </div>
                                <Link href="/noticias" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
                                    Ver todas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {recentArticles && recentArticles.length > 0 ? (
                                    recentArticles.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-16 bg-muted/20 border border-dashed border-border rounded-xl">
                                        <Info className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">Nenhuma notícia recente no momento.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Widget de Busca (Funcional) */}
                        <SearchWidget />

                        {/* Widget Newsletter (Corrigido) */}
                        <div className="rounded-xl bg-primary text-primary-foreground p-8 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Mail className="w-5 h-5" />
                                    <h3 className="font-bold text-lg">Newsletter Fiscal</h3>
                                </div>
                                <p className="text-sm text-primary-foreground/90 mb-6 leading-relaxed">
                                    Receba atualizações tributárias e novidades das ferramentas diretamente no seu e-mail.
                                </p>
                                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 rounded-lg bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                                    />
                                    <button className="w-full bg-background/20 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-lg font-bold text-sm hover:bg-background/30 transition-colors flex justify-center items-center gap-2">
                                        Inscrever-se <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>
                                <p className="text-[10px] text-primary-foreground/60 mt-4 text-center">
                                    Respeitamos sua privacidade. Cancele quando quiser.
                                </p>
                            </div>
                        </div>

                        {/* Widget Calendário */}
                        <Card title={<div className="flex items-center gap-2"><CalendarClock className="w-5 h-5 text-primary" /> Vencimentos Próximos</div>}>
                            <div className="space-y-4">
                                {[
                                    { dia: '20', mes: 'DEZ', titulo: 'DAS - Simples Nacional', status: 'warning' },
                                    { dia: '25', mes: 'DEZ', titulo: 'PIS/COFINS', status: 'normal' },
                                    { dia: '30', mes: 'DEZ', titulo: 'IRPJ/CSLL (Trimestral)', status: 'normal' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center group cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 transition-colors ${item.status === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/10 dark:border-orange-900/50 dark:text-orange-400' : 'bg-muted/50 border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary'}`}>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.mes}</span>
                                            <span className="text-xl font-bold leading-none">{item.dia}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.titulo}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Info className="w-3 h-3" /> Vencimento mensal
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/ferramentas/calendario-fiscal" className="block mt-6 text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors border-t border-border pt-4">
                                Ver calendário completo
                            </Link>
                        </Card>

                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export async function getServerSideProps() {
    const allArticles = getAllArticles();
    const recentArticles = allArticles.slice(0, 4);

    return {
        props: {
            recentArticles
        }
    };
}
