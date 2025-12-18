import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Menu, X, TrendingUp, Clock, Eye, MessageCircle,
    Share2, Bookmark, ChevronRight, Flame, Calendar, User,
    Facebook, Twitter, Linkedin, Mail, Bell, Home
} from 'lucide-react';

// Mock data - replace with API
const MOCK_ARTICLES = [
    {
        id: 1,
        slug: 'reforma-tributaria-ibs-cbs-2026',
        title: 'Reforma Tributária: IBS e CBS entram em vigor em 2026 - Guia Completo',
        excerpt: 'Entenda todas as mudanças que a Reforma Tributária trará para empresas e consumidores. O novo sistema dual de IBS e CBS substitui 5 tributos atuais.',
        category: 'Reforma Tributária',
        author: 'Dr. Ricardo Mendes',
        date: '2024-12-17',
        readTime: 8,
        views: 15420,
        comments: 234,
        featured: true,
        image: null
    },
    {
        id: 2,
        slug: 'difal-2025-novas-regras',
        title: 'DIFAL 2025: Estados divulgam novas alíquotas e regras de recolhimento',
        excerpt: 'Confira a tabela completa de alíquotas de DIFAL por estado e as mudanças que entram em vigor em janeiro de 2025.',
        category: 'ICMS',
        author: 'Ana Paula Silva',
        date: '2024-12-16',
        readTime: 5,
        views: 12350,
        comments: 156,
        featured: true,
        image: null
    },
    {
        id: 3,
        slug: 'simples-nacional-2025-novos-limites',
        title: 'Simples Nacional 2025: Proposta aumenta limite para R$ 6,4 milhões',
        excerpt: 'Projeto de lei em análise no Congresso propõe atualização dos limites de faturamento do Simples Nacional e MEI.',
        category: 'Simples Nacional',
        author: 'Carlos Eduardo',
        date: '2024-12-15',
        readTime: 6,
        views: 18900,
        comments: 289,
        featured: false,
        image: null
    },
    {
        id: 4,
        slug: 'sped-fiscal-calendario-2025',
        title: 'Calendário SPED 2025: Todas as datas e prazos que você precisa saber',
        excerpt: 'Organize seu ano fiscal com o calendário completo de obrigações acessórias. Inclui SPED Fiscal, EFD Contribuições, ECF e muito mais.',
        category: 'SPED',
        author: 'Fernanda Costa',
        date: '2024-12-14',
        readTime: 4,
        views: 8750,
        comments: 67,
        featured: false,
        image: null
    },
    {
        id: 5,
        slug: 'pis-cofins-creditos-recuperacao',
        title: 'PIS/COFINS: Como recuperar créditos tributários que sua empresa está perdendo',
        excerpt: 'Descubra os créditos de PIS e COFINS que sua empresa pode estar deixando de aproveitar e aprenda como recuperá-los.',
        category: 'Tributos Federais',
        author: 'Dr. Marcos Almeida',
        date: '2024-12-13',
        readTime: 10,
        views: 11200,
        comments: 145,
        featured: false,
        image: null
    },
    {
        id: 6,
        slug: 'ncm-classificacao-fiscal-guia',
        title: 'NCM: Guia definitivo para classificação fiscal de produtos',
        excerpt: 'Aprenda a classificar seus produtos corretamente e evite multas e autuações fiscais com nosso guia completo de NCM.',
        category: 'Guias Práticos',
        author: 'Roberto Santos',
        date: '2024-12-12',
        readTime: 7,
        views: 6430,
        comments: 45,
        featured: false,
        image: null
    },
];

const CATEGORIES = [
    'Todas',
    'Reforma Tributária',
    'ICMS',
    'Simples Nacional',
    'SPED',
    'Tributos Federais',
    'Guias Práticos'
];

export default function Blog() {
    const [articles, setArticles] = useState(MOCK_ARTICLES);
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const filteredArticles = articles.filter(article => {
        const matchCategory = activeCategory === 'Todas' || article.category === activeCategory;
        const matchSearch = !searchTerm ||
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
    const featured = articles.filter(a => a.featured);

    const formatViews = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
    const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/blog" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">PF</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">Portal Fiscal</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Notícias Tributárias</div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/blog" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Início
                            </Link>
                            <Link href="/ferramentas" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Ferramentas
                            </Link>
                            <Link href="/comunidade" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Comunidade
                            </Link>
                            <Link href="/sobre" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Sobre
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="px-4 py-3 space-y-2">
                            <Link href="/blog" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Início
                            </Link>
                            <Link href="/ferramentas" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Ferramentas
                            </Link>
                            <Link href="/comunidade" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Comunidade
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* AdSense Banner Top */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                        AdSense Banner 728x90
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Featured Articles */}
                        {activeCategory === 'Todas' && featured.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Flame className="w-6 h-6 text-red-500" />
                                    Em Destaque
                                </h2>

                                {/* Hero Article */}
                                <Link href={`/blog/${featured[0].slug}`} className="group block">
                                    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 h-96">
                                        <div className="absolute inset-0 bg-black/40" />
                                        <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4 w-fit">
                                                {featured[0].category}
                                            </span>
                                            <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-200 transition-colors">
                                                {featured[0].title}
                                            </h3>
                                            <p className="text-white/90 mb-4 line-clamp-2">{featured[0].excerpt}</p>
                                            <div className="flex items-center gap-4 text-sm text-white/80">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-4 h-4" /> {featured[0].author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" /> {featured[0].readTime} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" /> {formatViews(featured[0].views)}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </section>
                        )}

                        {/* AdSense In-Feed */}
                        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                            AdSense In-Feed 728x90
                        </div>

                        {/* Articles List */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activeCategory === 'Todas' ? 'Últimas Notícias' : activeCategory}
                            </h2>

                            <div className="space-y-6">
                                {filteredArticles.map((article, idx) => (
                                    <article key={article.id} className="group">
                                        <Link href={`/blog/${article.slug}`} className="block">
                                            <div className="flex gap-6 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                                                            {article.category}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDate(article.date)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" /> {article.author}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" /> {article.readTime} min
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" /> {formatViews(article.views)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="w-4 h-4" /> {article.comments}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block w-48 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0" />
                                            </div>
                                        </Link>

                                        {/* AdSense between articles */}
                                        {idx === 2 && (
                                            <div className="my-6 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                                                AdSense In-Feed 728x90
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Search */}
                        <div className="sticky top-20">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar artigos..."
                                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* AdSense Sidebar */}
                            <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                                AdSense Sidebar<br />300x250
                            </div>

                            {/* Trending */}
                            <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                    Mais Lidas
                                </h3>
                                <div className="space-y-4">
                                    {trending.map((article, idx) => (
                                        <Link key={article.id} href={`/blog/${article.slug}`} className="group flex gap-3">
                                            <span className="text-2xl font-black text-gray-200 dark:text-gray-800 w-8">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                                                    {article.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" /> {formatViews(article.views)}
                                                    </span>
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
                                <p className="text-sm text-white/90 mb-4">
                                    Receba as principais notícias fiscais toda semana.
                                </p>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full h-10 px-4 text-sm rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 mb-2"
                                />
                                <button className="w-full h-10 bg-white text-blue-600 font-bold text-sm rounded-lg hover:bg-white/90 transition-colors">
                                    Inscrever-se
                                </button>
                            </div>

                            {/* AdSense Sidebar Bottom */}
                            <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                                AdSense Sidebar<br />300x250
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
                            <p className="text-sm text-gray-400">
                                Notícias e análises sobre tributação brasileira.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Categorias</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/blog" className="hover:text-white">Reforma Tributária</Link></li>
                                <li><Link href="/blog" className="hover:text-white">ICMS</Link></li>
                                <li><Link href="/blog" className="hover:text-white">Simples Nacional</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Portal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/ferramentas" className="hover:text-white">Ferramentas</Link></li>
                                <li><Link href="/comunidade" className="hover:text-white">Comunidade</Link></li>
                                <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Redes Sociais</h4>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        © 2024 Portal Fiscal. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
