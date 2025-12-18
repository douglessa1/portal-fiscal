import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Calendar, Eye, Clock, ExternalLink, Copy, CheckCircle } from 'lucide-react';

export default function SharedCalculationPage() {
    const router = useRouter();
    const { hash } = router.query;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!hash) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/share?hash=${hash}`);
                const result = await res.json();

                if (!res.ok) {
                    setError(result.error || 'Erro ao carregar');
                    return;
                }

                setData(result);
            } catch (err) {
                setError('Erro ao carregar cálculo');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hash]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando cálculo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Cálculo não disponível</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Link href="/" className="text-primary hover:underline">
                        Voltar para o Portal Fiscal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Cálculo Compartilhado - Portal Fiscal</title>
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="bg-card border-b border-border">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                PF
                            </div>
                            <div>
                                <h1 className="font-bold text-foreground">Portal Fiscal</h1>
                                <p className="text-xs text-muted-foreground">Cálculo Compartilhado</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={copyLink} className="h-9 px-3 text-sm rounded-lg border border-input hover:bg-muted flex items-center gap-2">
                                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copiado!' : 'Copiar Link'}
                            </button>
                            <Link href="/ferramentas" className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Acessar Portal
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="max-w-5xl mx-auto px-6 py-8">
                    {/* Info Banner */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Modo Somente Leitura</p>
                                <p className="text-xs text-amber-700 dark:text-amber-300">Este cálculo foi compartilhado e não pode ser editado</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-amber-700 dark:text-amber-300">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" /> {data.views} visualizações
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Expira em {new Date(data.expiresAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    {/* Calculation Card */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="bg-primary px-6 py-4">
                            <h2 className="text-xl font-bold text-primary-foreground">{data.data.title || data.type}</h2>
                            <p className="text-sm text-primary-foreground/80">{data.data.subtitle || 'Cálculo fiscal'}</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Hash */}
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Hash de Verificação</span>
                                <code className="text-sm font-mono text-foreground">{data.hash}</code>
                            </div>

                            {/* Inputs */}
                            {data.data.inputs && data.data.inputs.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">Dados de Entrada</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {data.data.inputs.map((input, idx) => (
                                            <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                                                <div className="text-xs text-muted-foreground">{input.label}</div>
                                                <div className="font-medium text-foreground">{input.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Memory of Calculation */}
                            {data.data.memory && data.data.memory.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">Memória de Cálculo</h3>
                                    <div className="space-y-3">
                                        {data.data.memory.map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border-l-4 border-primary">
                                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-foreground">{step.label}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">{step.formula}</div>
                                                    <div className="text-sm font-bold text-primary mt-1">= {step.result}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Result */}
                            {data.data.result && (
                                <div className="p-6 bg-green-600 rounded-xl text-white">
                                    <div className="text-sm opacity-80">{data.data.result.label || 'Resultado'}</div>
                                    <div className="text-3xl font-bold">{data.data.result.value}</div>
                                </div>
                            )}

                            {/* Comparison */}
                            {data.data.comparison && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-xs text-blue-600 mb-1">{data.data.comparison.left.label}</div>
                                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{data.data.comparison.left.value}</div>
                                    </div>
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="text-xs text-purple-600 mb-1">{data.data.comparison.right.label}</div>
                                        <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{data.data.comparison.right.value}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-muted/30 px-6 py-4 border-t border-border">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Gerado em {new Date(data.createdAt).toLocaleString('pt-BR')}</span>
                                <span>Portal Fiscal © 2024</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
