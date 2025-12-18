import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteLayout from '../../components/Layout/SiteLayout';
import { MOCK_NEWS, CATEGORIAS } from '../../lib/newsData';
import {
    Search, TrendingUp, Clock, Eye, MessageCircle, Flame,
    Calendar, User, ArrowRight, Mail, Bell, Menu, X
} from 'lucide-react';

export default function NoticiasPage() {
    const [news, setNews] = useState(MOCK_NEWS);
    const [activeCategory, setActiveCategory] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');

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
        <div className="bg-background">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-12">
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
                            id={`category-${cat.id}`}
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
                                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground"
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
        </div>
    );
}

NoticiasPage.getLayout = function getLayout(page) {
    return <SiteLayout>{page}</SiteLayout>
}
