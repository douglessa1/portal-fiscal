import Header from '../../components/Header';
import ArticleCard from '../../components/Blog/ArticleCard';
import { useState } from 'react';
import { getAllArticles, getCategories } from '../../lib/articles';

/**
 * Página: Listagem de Artigos do Blog
 */
export default function BlogIndex({ articles, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredArticles =
        selectedCategory === 'Todos'
            ? articles
            : articles.filter(a => a.categoria === selectedCategory);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Blog</h1>
                    <p className="text-muted-foreground mt-2">
                        Artigos, guias e novidades sobre tributação e legislação fiscal
                    </p>
                </div>

                {/* Filtro de Categorias */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('Todos')}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedCategory === 'Todos'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-card-foreground hover:bg-muted border border-border'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedCategory === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card text-card-foreground hover:bg-muted border border-border'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid de Artigos */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Nenhum artigo encontrado nesta categoria.
                    </div>
                )}
            </main>
        </div>
    );
}

export async function getServerSideProps() {
    const articles = getAllArticles();
    const categories = getCategories();

    return {
        props: {
            articles,
            categories
        }
    };
}
