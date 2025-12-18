export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, Download, Lock, History, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const LIMITE_MEI = 81000;

function MEIReceitasPageContent() {
    const [receitas, setReceitas] = useState([]);
    const [novaReceita, setNovaReceita] = useState({ data: '', descricao: '', valor: '' });
    const [ano, setAno] = useState(new Date().getFullYear());

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(`mei_receitas_${ano}`) || '[]');
        setReceitas(saved);
    }, [ano]);

    const salvarReceitas = (novas) => {
        setReceitas(novas);
        localStorage.setItem(`mei_receitas_${ano}`, JSON.stringify(novas));
    };

    const adicionarReceita = (e) => {
        e.preventDefault();
        if (!novaReceita.data || !novaReceita.valor) return;
        const nova = { ...novaReceita, id: Date.now(), valor: parseFloat(novaReceita.valor) };
        const novas = [...receitas, nova].sort((a, b) => new Date(a.data) - new Date(b.data));
        salvarReceitas(novas);
        setNovaReceita({ data: '', descricao: '', valor: '' });
    };

    const removerReceita = (id) => {
        salvarReceitas(receitas.filter(r => r.id !== id));
    };

    const totalAno = receitas.reduce((sum, r) => sum + r.valor, 0);
    const percentualLimite = (totalAno / LIMITE_MEI) * 100;
    const restante = LIMITE_MEI - totalAno;

    const receitasPorMes = Array(12).fill(0).map((_, mes) => {
        return receitas.filter(r => new Date(r.data).getMonth() === mes).reduce((sum, r) => sum + r.valor, 0);
    });

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return (
        <ToolLayout title="MEI Receitas" description="Controle de receitas do MEI">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-green-500/10 rounded-xl">
                        <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Controle de Receitas MEI</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600">MEI</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Acompanhe suas receitas e o limite de faturamento</p>
                    </div>
                    <select value={ano} onChange={(e) => setAno(parseInt(e.target.value))}
                        className="h-9 px-3 text-sm rounded-lg border border-input bg-background">
                        {[2024, 2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Limite */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-foreground">Limite de Faturamento {ano}</h2>
                                <span className={`text-sm font-bold ${percentualLimite > 100 ? 'text-red-600' : percentualLimite > 80 ? 'text-amber-600' : 'text-green-600'}`}>
                                    {percentualLimite.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-4 mb-3">
                                <div className={`h-4 rounded-full transition-all ${percentualLimite > 100 ? 'bg-red-500' : percentualLimite > 80 ? 'bg-amber-500' : 'bg-green-500'
                                    }`} style={{ width: `${Math.min(percentualLimite, 100)}%` }} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="text-xs text-muted-foreground">Faturado</div>
                                    <div className="text-lg font-bold text-foreground">{fmt(totalAno)}</div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="text-xs text-muted-foreground">Limite</div>
                                    <div className="text-lg font-bold text-foreground">{fmt(LIMITE_MEI)}</div>
                                </div>
                                <div className={`rounded-lg p-3 ${restante < 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                                    <div className={`text-xs ${restante < 0 ? 'text-red-600' : 'text-green-600'}`}>Restante</div>
                                    <div className={`text-lg font-bold ${restante < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(restante)}</div>
                                </div>
                            </div>
                            {percentualLimite > 80 && (
                                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                                    <span>Atenção: Você já atingiu {percentualLimite.toFixed(0)}% do limite anual.</span>
                                </div>
                            )}
                        </div>

                        {/* Nova Receita */}
                        <form onSubmit={adicionarReceita} className="bg-card border border-border rounded-xl p-5">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Nova Receita</h2>
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <input type="date" value={novaReceita.data} onChange={(e) => setNovaReceita(p => ({ ...p, data: e.target.value }))}
                                        className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" required />
                                </div>
                                <div className="col-span-2">
                                    <input type="text" value={novaReceita.descricao} onChange={(e) => setNovaReceita(p => ({ ...p, descricao: e.target.value }))}
                                        placeholder="Descrição (opcional)" className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                </div>
                                <div className="flex gap-2">
                                    <input type="number" value={novaReceita.valor} onChange={(e) => setNovaReceita(p => ({ ...p, valor: e.target.value }))}
                                        placeholder="Valor" step="0.01" className="flex-1 h-9 px-3 text-sm rounded-lg border border-input bg-background" required />
                                    <button type="submit" className="h-9 w-9 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Lista de Receitas */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="bg-muted px-4 py-3 flex justify-between items-center">
                                <span className="text-sm font-semibold text-foreground">Receitas ({receitas.length})</span>
                                <FeatureLock featureId="mei_reports" showUpgrade={false} fallback={
                                    <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> Exportar <Lock className="w-3 h-3 text-purple-500" />
                                    </button>
                                }>
                                    <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> Exportar
                                    </button>
                                </FeatureLock>
                            </div>
                            {receitas.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Wallet className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Nenhuma receita registrada</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Data</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Descrição</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Valor</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {receitas.map(r => (
                                            <tr key={r.id} className="hover:bg-muted/30">
                                                <td className="px-4 py-2 text-muted-foreground">{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                                                <td className="px-4 py-2 text-foreground">{r.descricao || '-'}</td>
                                                <td className="px-4 py-2 text-right font-medium text-green-600">{fmt(r.valor)}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button onClick={() => removerReceita(r.id)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <FeatureLock featureId="mei_reports" fallback={
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Gráfico Mensal
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">PRO</span>
                                </h3>
                                <div className="py-6 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Gráfico disponível no PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 text-white">Upgrade</button>
                                </div>
                            </div>
                        }>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Receita Mensal</h3>
                                <div className="flex items-end gap-1 h-24">
                                    {receitasPorMes.map((valor, idx) => {
                                        const max = Math.max(...receitasPorMes, 1);
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center">
                                                <div className="w-full bg-green-500 rounded-t" style={{ height: `${(valor / max) * 80}px` }} />
                                                <span className="text-[9px] text-muted-foreground mt-1">{meses[idx]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </FeatureLock>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-800 dark:text-green-200">
                            <h4 className="font-semibold mb-2">📋 Limite MEI</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Limite 2024: R$ 81.000,00</li>
                                <li>• Proporcional por mês</li>
                                <li>• Excesso: desenquadramento</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function MEIReceitasPage() {
    return (
        <AuthGate>
            <MEIReceitasPageContent />
        </AuthGate>
    );
}
