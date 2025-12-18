import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Form'; // Assumindo existência ou usando textarea html
import { db } from '../../lib/db';
import { useSession, signIn } from 'next-auth/react';
import { MessageSquare, User, Clock, ArrowLeft, Tag, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Se tiver, se não usar div

export default function ForumTopic({ topic, replies, error }) {
    const { data: session } = useSession();
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 text-center">
                    <h1 className="text-xl font-bold mb-4">Tópico não encontrado</h1>
                    <Link href="/forum"><Button>Voltar para o Fórum</Button></Link>
                </main>
            </div>
        );
    }

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/forum/topics/${topic.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent })
            });

            if (res.ok) {
                window.location.reload(); // Recarregar para mostrar resposta (SSR feeling)
            } else {
                alert('Erro ao enviar resposta');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head>
                <title>{topic.title} - Fórum Fiscal</title>
            </Head>

            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                <Link href="/forum" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para discussões
                </Link>

                {/* Original Post */}
                <article className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold uppercase">
                            {topic.category}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground leading-tight">
                        {topic.title}
                    </h1>

                    <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                                {topic.author_name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{topic.author_name}</p>
                                <p className="text-xs text-muted-foreground">{new Date(topic.created_at).toLocaleDateString('pt-BR')} às {new Date(topic.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {topic.content}
                    </div>
                </article>

                {/* Replies Area */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        {replies.length} Respostas
                    </h3>

                    <div className="space-y-6">
                        {replies.map(reply => (
                            <div key={reply.id} className="flex gap-4 group">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                        {reply.author_name[0]}
                                    </div>
                                </div>
                                <div className="flex-1 bg-muted/30 p-5 rounded-lg border border-transparent group-hover:border-border transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-sm">{reply.author_name}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(reply.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                        {reply.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply Form */}
                <div className="mt-12 pt-8 border-t border-border">
                    {session ? (
                        <form onSubmit={handleSubmitReply} className="bg-card border border-border p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Sua resposta</h3>
                            <textarea
                                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Escreva sua resposta técnica..."
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                                disabled={submitting}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? 'Enviando...' : 'Publicar Resposta'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-8 rounded-lg text-center">
                            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Participe da discussão</h3>
                            <p className="text-blue-600 dark:text-blue-400 mb-6">Você precisa estar logado para responder a este tópico.</p>
                            <Button onClick={() => signIn()}>Entrar para Responder</Button>
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        // Increment Views (Fire and forget logic not ideal in SSR, usually GET API does it, but here strict DB access)
        // We will just read. To increment, we'd need a write. Safe to do async write?
        // Let's do a quick update query.
        await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);

        const topicRes = await db.query(`
            SELECT p.*, u.name as author_name
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `, [id]);

        const topic = topicRes.rows[0];

        if (!topic) {
            return { props: { error: true } };
        }

        const repliesRes = await db.query(`
            SELECT c.*, u.name as author_name
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `, [id]);

        // Fix dates
        // Fix dates (Bulletproof)
        const serializeDate = date => {
            try {
                if (!date) return new Date().toISOString();
                if (typeof date === 'string') return new Date(date.replace(' ', 'T')).toISOString();
                return new Date(date).toISOString();
            } catch (e) {
                return new Date().toISOString();
            }
        };

        const serialize = (obj) => ({ ...obj, created_at: serializeDate(obj.created_at) });

        return {
            props: {
                topic: serialize(topic),
                replies: repliesRes.rows.map(serialize)
            }
        };
    } catch (error) {
        console.error("SSR Details Error", error);
        return { props: { error: true } };
    }
}
