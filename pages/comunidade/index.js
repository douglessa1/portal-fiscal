import Header from '../../components/Header';
import Sidebar from '../../components/Layout/Sidebar';
import PostCard from '../../components/Community/PostCard';
import { TagList } from '../../components/Community/TagPill';
import CreatePostWizard from '../../components/Community/CreatePostWizard';
import { REFORMA_TAGS } from '../../lib/community/reformaTags';
import { POST_TYPES } from '../../lib/community/postTypes';
import { useState, useEffect } from 'react';
import { MessageSquare, Plus, TrendingUp, Users, FileText, Award, Flame, Receipt, Building2, Calculator, FileSpreadsheet, Laptop, Gavel, HelpCircle, Filter, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

const CATEGORY_TABS = [
    { id: 'Todas', label: 'Todas', icon: MessageSquare, color: '#6366f1' },
    { id: 'ICMS', label: 'ICMS', icon: Receipt, color: '#3b82f6' },
    { id: 'Reforma Tributária', label: 'Reforma', icon: Gavel, color: '#ec4899' },
    { id: 'SPED', label: 'SPED', icon: FileSpreadsheet, color: '#f59e0b' },
    { id: 'Simples Nacional', label: 'Simples', icon: Calculator, color: '#10b981' },
    { id: 'NFe', label: 'NFe', icon: FileText, color: '#06b6d4' },
    { id: 'ISS', label: 'ISS', icon: Building2, color: '#8b5cf6' },
    { id: 'Tecnologia', label: 'Tech', icon: Laptop, color: '#64748b' },
    { id: 'Geral', label: 'Geral', icon: HelpCircle, color: '#94a3b8' }
];

const MOCK_TAGS = [
    { name: 'DIFAL', slug: 'difal', color: '#ef4444', postCount: 98 },
    { name: 'ST', slug: 'st', color: '#a855f7', postCount: 76 },
    { name: 'Bloco K', slug: 'bloco-k', color: '#84cc16', postCount: 54 },
    { name: 'IR/CSLL', slug: 'ir-csll', color: '#f97316', postCount: 45 }
];

export default function CommunityFeed() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [reformaFilter, setReformaFilter] = useState(null);
    const [postTypeFilter, setPostTypeFilter] = useState(null);

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/community/posts');
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            setPosts([]);
        }
        setLoading(false);
    };

    const handleCreatePost = async (postData) => {
        try {
            const res = await fetch('/api/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (res.ok) {
                setShowCreateModal(false);
                fetchPosts();
            }
        } catch (error) {
            console.error('Erro ao criar post:', error);
        }
    };

    const clearFilters = () => {
        setReformaFilter(null);
        setPostTypeFilter(null);
        setActiveCategory('Todas');
        setSearchTerm('');
    };

    const hasActiveFilters = reformaFilter || postTypeFilter || activeCategory !== 'Todas' || searchTerm;

    const filteredPosts = posts
        .filter(post => {
            const matchesCategory = activeCategory === 'Todas' || post.category === activeCategory;
            const matchesSearch = !searchTerm || post.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesReforma = !reformaFilter || post.reforma_tag === reformaFilter;
            const matchesType = !postTypeFilter || post.post_type === postTypeFilter;
            return matchesCategory && matchesSearch && matchesReforma && matchesType;
        })
        .sort((a, b) => sortBy === 'popular' ? (b.upvotes || 0) - (a.upvotes || 0) : new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-4 pt-[72px] transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Comunidade Fiscal</h1>
                                <p className="text-sm text-muted-foreground">Tire dúvidas e compartilhe conhecimento</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Nova Pergunta
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="bg-card border border-border rounded-lg p-1 mb-4 overflow-x-auto">
                        <div className="flex gap-1 min-w-max">
                            {CATEGORY_TABS.map(cat => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs ${isActive ? 'text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        style={isActive ? { backgroundColor: cat.color } : {}}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reforma Tags Filter */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">Reforma Tributária:</span>
                        {REFORMA_TAGS.map(tag => {
                            const isActive = reformaFilter === tag.id;
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => setReformaFilter(isActive ? null : tag.id)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isActive
                                            ? 'text-white shadow-sm scale-105'
                                            : 'text-muted-foreground hover:bg-muted border border-border'
                                        }`}
                                    style={isActive ? { backgroundColor: tag.color } : {}}
                                >
                                    <span>{tag.icon}</span>
                                    {tag.shortLabel}
                                </button>
                            );
                        })}

                        {/* Clear all filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 ml-2"
                            >
                                <X className="w-3 h-3" />
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                            { icon: FileText, value: posts.length, label: 'Discussões', color: 'text-blue-500' },
                            { icon: Users, value: '1.2K', label: 'Membros', color: 'text-green-500' },
                            { icon: Award, value: posts.filter(p => p.is_solved).length, label: 'Resolvidas', color: 'text-amber-500' },
                            { icon: Flame, value: '12', label: 'Hoje', color: 'text-red-500' }
                        ].map((stat, i) => (
                            <div key={i} className="p-3 rounded-xl border border-border bg-card flex items-center gap-3">
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                <div>
                                    <div className="text-lg font-bold leading-none">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Feed */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Buscar discussões..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 h-9 px-3 text-sm rounded-lg border border-input bg-card"
                                />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-9 px-3 text-sm rounded-lg border border-input bg-card font-medium"
                                >
                                    <option value="newest">Recentes</option>
                                    <option value="popular">Populares</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                {loading ? (
                                    [...Array(2)].map((_, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-border bg-card animate-pulse">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-16 bg-muted rounded"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                                    <div className="h-3 bg-muted rounded w-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : filteredPosts.length === 0 ? (
                                    <div className="p-8 rounded-xl border-2 border-dashed border-border text-center">
                                        <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-3">Nenhuma discussão encontrada</p>
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground"
                                        >
                                            Criar Pergunta
                                        </button>
                                    </div>
                                ) : (
                                    filteredPosts.map(post => (
                                        <PostCard key={post.id} post={{ ...post, tags: post.tags || [], author_badges: [] }} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Tags
                                </h3>
                                <TagList tags={MOCK_TAGS} showCount size="sm" />
                            </div>

                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-amber-500" />
                                    Top Contribuidores
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Carlos Expert', rep: 2450, badge: '🏆' },
                                        { name: 'Ana Contadora', rep: 1890, badge: '🎓' },
                                        { name: 'Pedro Fiscal', rep: 1456, badge: '⭐' }
                                    ].map((user, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                {user.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs truncate">{user.name} {user.badge}</div>
                                                <div className="text-xs text-muted-foreground">{user.rep.toLocaleString()} rep</div>
                                            </div>
                                            <span className="font-bold text-muted-foreground">#{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Wizard Modal */}
            {showCreateModal && (
                <CreatePostWizard
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreatePost}
                />
            )}
        </div>
    );
}
