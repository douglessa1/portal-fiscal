import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { db } from '../../lib/db';
import { MessageSquare, Plus, Search, Tag, User, Clock, AlertCircle } from 'lucide-react';

export default function ForumIndex({ posts = [], error }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head>
                <title>Fórum Fiscal - Discussões Profissionais</title>
                <meta name="description" content="Comunidade técnica para discussão de temas fiscais e tributários." />
            </Head>

            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Fórum Fiscal</h1>
                        <p className="text-muted-foreground mt-1">
                            Espaço para discussões técnicas de alto nível.
                        </p>
                    </div>
                    <Link href="/forum/novo">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Tópico
                        </Button>
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="bg-card border border-border rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar tópicos..."
                            className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {['Todos', 'ICMS', 'Federal', 'SPED', 'Simples Nacional'].map(tag => (
                            <button key={tag} className="px-3 py-2 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 whitespace-nowrap">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Erro ao carregar tópicos.
                    </div>
                )}

                {/* Empty State */}
                {!error && posts.length === 0 && (
                    <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-border">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Nenhuma discussão iniciada</h3>
                        <p className="text-muted-foreground mb-6">Seja o primeiro a compartilhar conhecimento.</p>
                        <Link href="/forum/novo">
                            <Button variant="outline">Criar Tópico</Button>
                        </Link>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.map(post => (
                        <Link key={post.id} href={`/forum/${post.id}`} className="block group">
                            <article className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all hover:border-primary/50 relative">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <span className={`px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium`}>
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" /> {post.author_name}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors text-foreground">
                                            {post.title}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-muted-foreground">
                                        <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="font-medium">{post.reply_count || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    );
}

export async function getServerSideProps() {
    console.log("DEBUG FORUM SSR: NODE_ENV =", process.env.NODE_ENV);
    try {
        const res = await db.query(`
            SELECT 
                p.id, p.title, p.category, p.views, p.created_at, p.is_solved,
                u.name as author_name,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as reply_count
            FROM posts p
            JOIN users u ON p.author_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 50
        `);

        // Serializar datas para JSON (SQLite returns 'YYYY-MM-DD HH:MM:SS', need 'YYYY-MM-DDTHH:MM:SS')
        const serializeDate = date => {
            try {
                if (!date) return new Date().toISOString();
                if (typeof date === 'string') return new Date(date.replace(' ', 'T')).toISOString();
                return new Date(date).toISOString();
            } catch (e) {
                return new Date().toISOString();
            }
        };

        const posts = res.rows.map(post => ({
            ...post,
            created_at: serializeDate(post.created_at)
        }));

        return {
            props: { posts },
        };
    } catch (error) {
        console.error('Forum SSR Error:', error);
        return {
            props: { posts: [], error: true },
        };
    }
}
