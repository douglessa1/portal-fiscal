import Header from '../../components/Header';
import Sidebar from '../../components/Layout/Sidebar';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ArrowLeft, MessageSquare, Share2, Flag, User, FileText, Download, Award, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePlan } from '../../components/Permissions/PlanProvider';
import { POST_TYPES, TRIBUTOS, REGIMES } from '../../lib/community/postTypes';
import { REFORMA_TAGS } from '../../lib/community/reformaTags';
import { generateParecerPDF, exportForAudit } from '../../lib/auditorFeatures';

export default function PostDetail() {
    const { data: session } = useSession();
    const { isAuditor } = usePlan();
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    useEffect(() => {
        if (id) fetchPost();
    }, [id]);

    const fetchPost = () => {
        setLoading(true);
        fetch(`/api/community/posts/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setPost(data.post);
                setComments(data.comments);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch(`/api/community/posts/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent })
            });

            if (res.ok) {
                setReplyContent('');
                fetchPost(); // Refresh
            } else {
                alert('Erro ao enviar resposta');
            }
        } catch (error) {
            alert('Erro de conexão');
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportPDF = async () => {
        if (!isAuditor || !post) return;
        setGeneratingPDF(true);
        try {
            const doc = await generateParecerPDF(post, session?.user);
            doc.save(`parecer-${post.id}.pdf`);
        } catch (err) {
            console.error('Erro ao gerar PDF:', err);
            alert('Erro ao gerar PDF');
        }
        setGeneratingPDF(false);
    };

    const handleExportAudit = () => {
        if (!isAuditor || !post) return;
        const data = exportForAudit(post, comments);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-case-${post.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getAvatar = (name) => (name ? name[0].toUpperCase() : 'U');

    const postType = post?.post_type ? POST_TYPES[post.post_type] : null;
    const reformaTag = post?.reforma_tag ? REFORMA_TAGS.find(t => t.id === post.reforma_tag) : null;
    const tributoLabel = post?.tributo ? TRIBUTOS.find(t => t.value === post.tributo)?.label : null;
    const regimeLabel = post?.regime ? REGIMES.find(r => r.value === post.regime)?.label : null;

    if (loading) return <div className="p-10 text-center">Carregando...</div>;
    if (!post) return <div className="p-10 text-center">Post não encontrado</div>;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-4 lg:p-8 pt-[80px] max-w-5xl mx-auto w-full">

                    <div className="mb-6">
                        <Link href="/comunidade" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Voltar para Comunidade
                        </Link>
                    </div>

                    {/* Main Post */}
                    <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
                        {/* Type & Reforma Badges */}
                        {(postType || reformaTag) && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {postType && (
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded"
                                        style={{ backgroundColor: postType.color, color: '#fff' }}
                                    >
                                        {postType.icon} {postType.label}
                                    </span>
                                )}
                                {reformaTag && (
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded"
                                        style={{
                                            backgroundColor: reformaTag.color,
                                            color: reformaTag.id === 'transicao' ? '#000' : '#fff'
                                        }}
                                    >
                                        {reformaTag.icon} {reformaTag.label}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Structured Data Grid */}
                        {(post.uf_origem || tributoLabel || regimeLabel || post.tipo_operacao) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                {tributoLabel && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Tributo</div>
                                        <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">{tributoLabel}</div>
                                    </div>
                                )}
                                {regimeLabel && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Regime</div>
                                        <div className="text-sm font-semibold text-green-700 dark:text-green-300">{regimeLabel}</div>
                                    </div>
                                )}
                                {post.uf_origem && (
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> UF
                                        </div>
                                        <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                            {post.uf_origem}{post.uf_destino ? ` → ${post.uf_destino}` : ''}
                                        </div>
                                    </div>
                                )}
                                {post.tipo_operacao && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Operação</div>
                                        <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 capitalize">{post.tipo_operacao}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Base Legal */}
                        {post.base_legal && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-lg mb-5">
                                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">📜 BASE LEGAL</div>
                                <div className="text-sm text-foreground">{post.base_legal}</div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {getAvatar(post.author_name)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <Link href={`/perfil/${post.user_id}`} className="font-medium text-foreground hover:underline">
                                            {post.author_name}
                                        </Link>
                                        {post.author_role === 'admin' && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                                        <span>•</span>
                                        <span>{new Date(post.created_at).toLocaleString()}</span>
                                        <span>•</span>
                                        <span className="bg-muted px-2 py-0.5 rounded textxs">{post.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-8 text-foreground leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>

                        <div className="flex gap-4 border-t border-border pt-4 flex-wrap">
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                                <Share2 className="w-4 h-4" /> Compartilhar
                            </button>
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-red-600 transition-colors text-sm font-medium">
                                <Flag className="w-4 h-4" /> Denunciar
                            </button>

                            {/* AUDITOR Actions */}
                            {isAuditor && (
                                <>
                                    <button
                                        onClick={handleExportPDF}
                                        disabled={generatingPDF}
                                        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium ml-auto"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {generatingPDF ? 'Gerando...' : 'Gerar Parecer PDF'}
                                    </button>
                                    <button
                                        onClick={handleExportAudit}
                                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4" /> Export Auditoria
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Answers Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            {comments.length} Respostas
                        </h3>

                        <div className="space-y-6">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                                            {getAvatar(comment.author_name)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link href={`/perfil/${comment.user_id}`} className="font-semibold hover:underline">
                                                {comment.author_name}
                                            </Link>
                                            {comment.author_role === 'admin' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                                            <span className="text-xs text-muted-foreground">• {new Date(comment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm text-foreground whitespace-pre-wrap">
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reply Form */}
                    {session ? (
                        <Card className="bg-muted/30">
                            <h3 className="font-bold mb-4">Sua Resposta</h3>
                            <form onSubmit={handleReply}>
                                <textarea
                                    className="w-full p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                                    placeholder="Escreva sua resposta ou contribuição..."
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    required
                                ></textarea>
                                <div className="flex justify-end mt-4">
                                    <FormButton
                                        type="submit"
                                        label={submitting ? "Publicando..." : "Publicar Resposta"}
                                        disabled={submitting}
                                    />
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <div className="bg-muted/50 p-6 rounded-xl text-center border border-border">
                            <p className="mb-4">Para responder, você precisa estar logado.</p>
                            <Link href={`/auth/login?callbackUrl=/comunidade/${id}`}>
                                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">
                                    Fazer Login
                                </button>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
