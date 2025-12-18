import Header from '../../components/Header';
import { getArticleBySlug, getAllArticles } from '../../lib/articles';
import Link from 'next/link';

/**
 * Página: Artigo Individual do Blog
 */
export default function BlogPost({ article }) {
    if (!article) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="max-w-4xl mx-auto p-6">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-foreground">Artigo não encontrado</h1>
                        <Link href="/blog" className="text-primary hover:text-primary/80 mt-4 inline-block">
                            ← Voltar ao blog
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getCategoryColor = (categoria) => {
        const colors = {
            'SPED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'ICMS': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            'Simples Nacional': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'NFe': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            'Tributário': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
        return colors[categoria] || 'bg-muted text-muted-foreground';
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    {' > '}
                    <Link href="/blog" className="hover:text-primary">Blog</Link>
                    {' > '}
                    <span className="text-foreground">{article.titulo}</span>
                </nav>

                {/* Article Header */}
                <article className="bg-card text-card-foreground rounded-lg shadow-md border border-border overflow-hidden">
                    <div className="p-8">
                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.categoria)}`}>
                                {article.categoria}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            {article.titulo}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{article.autor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time dateTime={article.created_at}>
                                    {formatDate(article.created_at)}
                                </time>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: article.conteudo.replace(/\n/g, '<br/>') }}
                        />
                    </div>
                </article>

                {/* Back Link */}
                <div className="mt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar ao blog
                    </Link>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    const article = getArticleBySlug(params.slug);

    return {
        props: {
            article: article || null
        }
    };
}
