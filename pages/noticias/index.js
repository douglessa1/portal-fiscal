import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, TrendingUp, Clock, Eye, MessageCircle, Flame,
    Calendar, User, ArrowRight, Mail, Bell, Menu, X
} from 'lucide-react';

const CATEGORIAS = [
    { id: 'todas', nome: 'Todas', cor: '#6b7280' },
    { id: 'icms', nome: 'ICMS', cor: '#3b82f6' },
    { id: 'federal', nome: 'Federal', cor: '#f59e0b' },
    { id: 'reforma', nome: 'Reforma Tributária', cor: '#8b5cf6' },
    { id: 'jurisprudencia', nome: 'Jurisprudência', cor: '#10b981' },
    { id: 'alertas', nome: 'Alertas Urgentes', cor: '#ef4444' },
];

const MOCK_NEWS = [
    {
        id: 1,
        slug: 'reforma-tributaria-ibs-cbs-2026',
        titulo: 'Reforma Tributária: IBS e CBS entram em vigor em 2026',
        resumo: 'Entenda as mudanças que a Reforma Tributária trará para empresas. O novo sistema dual de IBS e CBS substitui 5 tributos atuais.',
        autor: 'Dr. Ricardo Mendes',
        created_at: '2024-12-17',
        categoria: 'reforma',
        visualizacoes: 15420,
        comentarios: 234,
        tempo_leitura: 8,
        destaque: true
    },
    {
        id: 2,
        slug: 'difal-2025-novas-aliquotas',
        titulo: 'DIFAL 2025: Estados divulgam novas alíquotas',
        resumo: 'Confira a tabela completa de alíquotas de DIFAL por estado e as mudanças que entram em vigor em janeiro.',
        autor: 'Ana Paula Silva',
        created_at: '2024-12-16',
        categoria: 'icms',
        visualizacoes: 12350,
        comentarios: 156,
        tempo_leitura: 5,
        destaque: true
    },
    {
        id: 3,
        slug: 'pis-cofins-creditos-2025',
        titulo: 'PIS/COFINS: Como recuperar créditos tributários',
        resumo: 'Descubra os créditos que sua empresa pode estar deixando de aproveitar e aprenda como recuperá-los.',
        autor: 'Dr. Marcos Almeida',
        created_at: '2024-12-15',
        categoria: 'federal',
        visualizacoes: 9870,
        comentarios: 112,
        tempo_leitura: 10,
        destaque: false
    },
];

export default function NoticiasPage() {
    const [news, setNews] = useState(MOCK_NEWS);
    const [activeCategory, setActiveCategory] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const filteredNews = news.filter(article => {
        const matchCategory = activeCategory === 'todas' || article.categoria === activeCategory;
        const matchSearch = !searchTerm ||
            article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.resumo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const trending = [...news].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 5);
    const featured = news.filter(a => a.destaque);

    const formatViews = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
    const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">PF</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">Portal Fiscal</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Notícias Tributárias</div>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600">Início</Link>
                            <Link href="/ferramentas" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600">Ferramentas</Link>
                            <Link href="/noticias" className="text-sm font-medium text-blue-600 dark:text-blue-400">Notícias</Link>
                            <Link href="/comunidade" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600">Comunidade</Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="px-4 py-3 space-y-2">
                            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Início</Link>
                            <Link href="/ferramentas" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Ferramentas</Link>
                            <Link href="/noticias" className="block px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600">Notícias</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notícias Fiscais</h1>
                    <p className="text-gray-600 dark:text-gray-400">Acompanhe atualizações fiscais relevantes</p>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {CATEGORIAS.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                    ? 'text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                }`}
                            style={activeCategory === cat.id ? { backgroundColor: cat.cor } : {}}
                        >
                            {cat.nome}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Featured */}
                        {activeCategory === 'todas' && featured.length > 0 && (
                            <Link href={`/noticias/${featured[0].slug}`} className="group block">
                                <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 h-80">
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4 w-fit">
                                            {CATEGORIAS.find(c => c.id === featured[0].categoria)?.nome}
                                        </span>
                                        <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-200 transition-colors">
                                            {featured[0].titulo}
                                        </h3>
                                        <p className="text-white/90 mb-4 line-clamp-2">{featured[0].resumo}</p>
                                        <div className="flex items-center gap-4 text-sm text-white/80">
                                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {featured[0].autor}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featured[0].tempo_leitura} min</span>
                                            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatViews(featured[0].visualizacoes)}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        )}

                        {/* Articles List */}
                        <div className="space-y-6">
                            {filteredNews.map(article => (
                                <article key={article.id} className="group">
                                    <Link href={`/noticias/${article.slug}`} className="block">
                                        <div className="flex gap-6 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-lg transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className="px-2 py-1 rounded text-xs font-medium text-white"
                                                        style={{ backgroundColor: CATEGORIAS.find(c => c.id === article.categoria)?.cor }}
                                                    >
                                                        {CATEGORIAS.find(c => c.id === article.categoria)?.nome}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{formatDate(article.created_at)}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                                    {article.titulo}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{article.resumo}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.autor}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.tempo_leitura} min</span>
                                                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatViews(article.visualizacoes)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="sticky top-20">
                            {/* Search */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar notícias..."
                                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Trending */}
                            <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                    Mais Lidas
                                </h3>
                                <div className="space-y-4">
                                    {trending.map((article, idx) => (
                                        <Link key={article.id} href={`/noticias/${article.slug}`} className="group flex gap-3">
                                            <span className="text-2xl font-black text-gray-200 dark:text-gray-800 w-8">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 line-clamp-2 transition-colors">
                                                    {article.titulo}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatViews(article.visualizacoes)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="mt-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Newsletter
                                </h3>
                                <p className="text-sm text-white/90 mb-4">Receba atualizações fiscais relevantes</p>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full h-10 px-4 text-sm rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 mb-2"
                                />
                                <button className="w-full h-10 bg-white text-blue-600 font-bold text-sm rounded-lg hover:bg-white/90 transition-colors">
                                    Inscrever-se
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">PF</span>
                                </div>
                                <span className="font-bold">Portal Fiscal</span>
                            </div>
                            <p className="text-sm text-gray-400">Cálculos fiscais com memória, prova técnica e auditoria</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Ferramentas</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/ferramentas/difal" className="hover:text-white">DIFAL</Link></li>
                                <li><Link href="/ferramentas/icms-st" className="hover:text-white">ICMS-ST</Link></li>
                                <li><Link href="/ferramentas/comparador-regimes" className="hover:text-white">Comparador de Regimes</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Notícias</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/noticias" className="hover:text-white">ICMS</Link></li>
                                <li><Link href="/noticias" className="hover:text-white">Federal</Link></li>
                                <li><Link href="/noticias" className="hover:text-white">Reforma Tributária</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Portal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/comunidade" className="hover:text-white">Comunidade</Link></li>
                                <li><Link href="/planos" className="hover:text-white">Planos</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        © 2024 Portal Fiscal. Baseado na legislação vigente.
                    </div>
                </div>
            </footer>
        </div>
    );
}
