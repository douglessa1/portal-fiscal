export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Split, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateSplitPaymentWithMemory, compareFluxoCaixa, ALIQUOTAS_SPLIT } from '../../lib/splitPaymentHash';

export default function SplitPaymentPage() {
    const [formData, setFormData] = useState({
        valorOperacao: '',
        aliqCBS: ALIQUOTAS_SPLIT.CBS.toString(),
        aliqIBS: ALIQUOTAS_SPLIT.IBS_TOTAL.toString()
    });
    const [result, setResult] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [showComparison, setShowComparison] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('split_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const calcResult = calculateSplitPaymentWithMemory(formData);
        setResult(calcResult);

        if (showComparison) {
            setComparison(compareFluxoCaixa(formData));
        }

        const newHistory = [calcResult, ...history.slice(0, 49)];
        setHistory(newHistory);
        localStorage.setItem('split_history', JSON.stringify(newHistory));
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Split Payment" description="Simulador do novo sistema">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                        <Split className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Split Payment</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-500/10 text-purple-600">Reforma</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Simulador do pagamento dividido • Vigência: 2026+</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados da Operação</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor da NF-e (R$)</label>
                                        <input type="number" name="valorOperacao" value={formData.valorOperacao} onChange={handleChange}
                                            placeholder="10000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <div className="text-xs text-blue-600">CBS (Federal)</div>
                                        <div className="text-lg font-bold text-blue-600">{formData.aliqCBS}%</div>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                        <div className="text-xs text-purple-600">IBS (Est+Mun)</div>
                                        <div className="text-lg font-bold text-purple-600">{formData.aliqIBS}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    <strong>⚠️ Como funciona:</strong> No Split Payment, os tributos são retidos automaticamente na fonte no momento do pagamento. O fornecedor recebe apenas o valor líquido.
                                </p>
                            </div>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)}
                                    className="w-4 h-4 accent-primary rounded" />
                                <span className="text-sm text-muted-foreground">Comparar impacto no fluxo de caixa</span>
                            </label>

                            <button type="submit"
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" /> Simular Split Payment
                            </button>
                        </form>

                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Resultado da Simulação</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => navigator.clipboard.writeText(result.hash)} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Hash
                                            </button>
                                            <FeatureLock featureId="reforma_reports" showUpgrade={false} fallback={
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                                </button>
                                            }>
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF
                                                </button>
                                            </FeatureLock>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <div className="text-xs text-muted-foreground mb-2">Tributos Retidos</div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-600">CBS</span>
                                                    <span className="font-semibold">{fmt(result.resultado.valorCBS)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-600">IBS</span>
                                                    <span className="font-semibold">{fmt(result.resultado.valorIBS)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm pt-2 border-t border-border">
                                                    <span className="font-semibold">Total ({result.resultado.percentualRetido}%)</span>
                                                    <span className="font-bold text-red-600">{fmt(result.resultado.totalSplit)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-600 rounded-lg p-4 flex flex-col justify-center">
                                            <div className="text-sm text-white/80">Valor Recebido</div>
                                            <div className="text-2xl font-bold text-white">{fmt(result.resultado.valorLiquido)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {showComparison && comparison && (
                                    <FeatureLock featureId="reforma_scenarios" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-foreground">Impacto no Fluxo de Caixa</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="border border-border rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Sistema Atual</h4>
                                                    <div className="text-2xl font-bold text-foreground mb-1">{fmt(comparison.atual.recebido)}</div>
                                                    <p className="text-xs text-muted-foreground">{comparison.atual.observacao}</p>
                                                </div>
                                                <div className="border-2 border-primary rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-primary uppercase mb-3">Com Split Payment</h4>
                                                    <div className="text-2xl font-bold text-primary mb-1">{fmt(comparison.split.recebido)}</div>
                                                    <p className="text-xs text-muted-foreground">{comparison.split.observacao}</p>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                                                Impacto imediato no caixa: {fmt(Math.abs(comparison.diferencaCaixa))} ({comparison.impactoFinanceiro}%)
                                            </div>
                                        </div>
                                    </FeatureLock>
                                )}

                                <FeatureLock featureId="reforma_scenarios" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border">
                                            <span className="text-xs font-semibold text-foreground uppercase">Memória de Cálculo</span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {result.memory.map((step, idx) => (
                                                    <tr key={idx} className="border-t border-border/50">
                                                        <td className="px-4 py-2 text-xs text-muted-foreground font-mono w-12">{step.step}</td>
                                                        <td className="px-4 py-2 text-foreground">{step.description}</td>
                                                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{step.formula}</td>
                                                        <td className="px-4 py-2 text-right font-semibold text-foreground">{step.result}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground border-t border-border">{result.baseLegal}</div>
                                    </div>
                                </FeatureLock>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
                                </div>
                                <FeatureLock featureId="reforma_scenarios" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{history.length}</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="reforma_scenarios" fallback={
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Histórico disponível no PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 text-white">Upgrade</button>
                                </div>
                            }>
                                {history.length === 0
                                    ? <p className="text-xs text-muted-foreground text-center py-4">Nenhuma simulação</p>
                                    : <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                        {history.slice(0, 10).map((h, i) => (
                                            <button key={i} onClick={() => { setFormData(h.inputs); setResult(h); }}
                                                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-muted-foreground">{fmt(h.resultado.valorOperacao)}</span>
                                                    <span className="font-semibold text-green-600">{fmt(h.resultado.valorLiquido)}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                }
                            </FeatureLock>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
                            <h4 className="font-semibold mb-2">📋 Split Payment</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Retenção automática na fonte</li>
                                <li>• Elimina sonegação fiscal</li>
                                <li>• Impacto no fluxo de caixa</li>
                                <li>• Vigência: 2026+</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
