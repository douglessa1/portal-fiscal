import Link from 'next/link';

/**
 * Componente: Card de Artigo do Blog
 * Exibe resumo do artigo com link para página completa
 */
export default function ArticleCard({ article }) {
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
        <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group border border-border">
            {/* Categoria Badge */}
            <div className="p-4 pb-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.categoria)}`}>
                    {article.categoria}
                </span>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                    <Link href={`/blog/${article.slug}`}>
                        {article.titulo}
                    </Link>
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.resumo}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground/80">
                    <span>{article.autor}</span>
                    <time dateTime={article.created_at}>
                        {formatDate(article.created_at)}
                    </time>
                </div>

                <Link
                    href={`/blog/${article.slug}`}
                    className="inline-block mt-4 text-primary font-semibold hover:text-primary/80 transition"
                >
                    Ler mais →
                </Link>
            </div>
        </article>
    );
}
