import { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import { MOCK_NEWS } from '../../lib/newsData';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';
import { Calendar, User, Share2, ArrowLeft } from 'lucide-react';
import AdBanner from '../../components/Ads/AdBanner';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LerNoticia() {
    const router = useRouter();
    const { slug } = router.query;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        // Fetch from unified lib (Simulating API/DB)
        const found = MOCK_NEWS.find(item => item.slug === slug);

        if (found) {
            setArticle(found);
        }
        setLoading(false);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    if (!article) return (
        <div className="min-h-screen bg-background p-20 text-center">
            <h1>Artigo não encontrado</h1>
            <Button onClick={() => router.push('/noticias')}>Voltar</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head>
                <title>{article.titulo} - Portal Fiscal</title>
                <meta name="description" content={article.resumo} />
            </Head>

            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-6 lg:p-12 pt-[100px] w-full max-w-4xl mx-auto">

                    <button onClick={() => router.back()} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                    </button>

                    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        {/* Hero Image */}
                        {article.imagem_url && (
                            <div className="h-[400px] w-full overflow-hidden relative">
                                <img src={article.imagem_url} className="w-full h-full object-cover" alt={article.titulo} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 inline-block">
                                        {article.categoria}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
                                        {article.titulo}
                                    </h1>
                                    <div className="flex items-center gap-6 text-sm md:text-base font-medium opacity-90">
                                        <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.autor}</span>
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            {/* Summary Box */}
                            <div className="text-xl leading-relaxed text-muted-foreground font-medium mb-12 border-l-4 border-primary pl-6 py-1">
                                {article.resumo}
                            </div>

                            {/* MID ARTICLE AD */}
                            <div className="my-8">
                                <AdBanner slotId="ARTICLE_MID" format="auto" />
                            </div>

                            {/* CONTENT (HTML) */}
                            <div
                                className="prose dark:prose-invert max-w-none text-lg leading-relaxed content-style"
                                dangerouslySetInnerHTML={{ __html: article.conteudo }}
                            />

                            {/* Share & Footer */}
                            <div className="border-t border-border mt-12 pt-8 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition text-muted-foreground">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* BOTTOM AD */}
                    <div className="mt-8">
                        <AdBanner slotId="ARTICLE_BOTTOM" format="auto" />
                    </div>

                </main>
            </div>
        </div>
    );
}
