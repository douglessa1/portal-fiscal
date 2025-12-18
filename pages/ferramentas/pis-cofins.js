import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Percent, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculatePISCOFINSWithMemory, comparePISCOFINSRegimes, ALIQUOTAS } from '../../lib/pisCofinsHash';

export default function PISCOFINSPage() {
    const [formData, setFormData] = useState({
        valor: '', regime: 'cumulativo', tipoReceita: 'venda',
        aliqPIS: '', aliqCOFINS: '', creditoPIS: '0', creditoCOFINS: '0'
    });
    const [result, setResult] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('piscofins_history') || '[]');
        setHistory(saved);
    }, []);

    useEffect(() => {
        // Auto-preencher alíquotas baseado no regime
        const aliq = ALIQUOTAS[formData.regime] || ALIQUOTAS.cumulativo;
        setFormData(prev => ({
            ...prev,
            aliqPIS: aliq.pis.toString(),
            aliqCOFINS: aliq.cofins.toString()
        }));
    }, [formData.regime]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const calcResult = calculatePISCOFINSWithMemory(formData);
            setResult(calcResult);

            if (showComparison) {
                const comp = comparePISCOFINSRegimes(formData);
                setComparison(comp);
            }

            const newHistory = [calcResult, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('piscofins_history', JSON.stringify(newHistory));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="PIS/COFINS" description="Cálculo de PIS e COFINS">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Percent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">PIS/COFINS</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600">Federal</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Cumulativo × Não-Cumulativo • Lei 10.637/2002</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* FORM */}
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">

                            {/* Dados */}
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados da Operação</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Receita Bruta (R$)</label>
                                        <input type="number" name="valor" value={formData.valor} onChange={handleChange}
                                            placeholder="100000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Regime</label>
                                        <select name="regime" value={formData.regime} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="cumulativo">Cumulativo</option>
                                            <option value="naoCumulativo">Não-Cumulativo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tipo de Receita</label>
                                        <select name="tipoReceita" value={formData.tipoReceita} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="venda">Venda de Mercadorias</option>
                                            <option value="servico">Prestação de Serviços</option>
                                            <option value="financeira">Receita Financeira</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Alíquotas */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Alíquotas</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground">PIS</div>
                                        <div className="text-lg font-bold text-foreground">{formData.aliqPIS || '0'}%</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground">COFINS</div>
                                        <div className="text-lg font-bold text-foreground">{formData.aliqCOFINS || '0'}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Créditos (não-cumulativo) */}
                            {formData.regime === 'naoCumulativo' && (
                                <div className="pt-4 border-t border-border/50">
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Créditos (Não-Cumulativo)</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-foreground mb-1">Crédito PIS (R$)</label>
                                            <input type="number" name="creditoPIS" value={formData.creditoPIS} onChange={handleChange}
                                                step="0.01" className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-foreground mb-1">Crédito COFINS (R$)</label>
                                            <input type="number" name="creditoCOFINS" value={formData.creditoCOFINS} onChange={handleChange}
                                                step="0.01" className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)}
                                    className="w-4 h-4 accent-primary rounded" />
                                <span className="text-sm text-muted-foreground">Comparar Cumulativo × Não-Cumulativo</span>
                            </label>

                            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}

                            <button type="submit" disabled={loading}
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                {loading ? 'Calculando...' : 'Calcular PIS/COFINS'}
                            </button>
                        </form>

                        {/* RESULT */}
                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Resultado</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => navigator.clipboard.writeText(result.hash)} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Hash
                                            </button>
                                            <FeatureLock featureId="pdf_export" showUpgrade={false} fallback={
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

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">PIS</div>
                                            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{fmt(result.resultado.pisLiquido)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">COFINS</div>
                                            <div className="text-base font-bold text-green-600 dark:text-green-400">{fmt(result.resultado.cofinsLiquido)}</div>
                                        </div>
                                        <div className="bg-primary rounded-lg p-3">
                                            <div className="text-xs text-primary-foreground/80">Total</div>
                                            <div className="text-base font-bold text-primary-foreground">{fmt(result.resultado.total)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {/* Memory - PRO */}
                                <FeatureLock featureId="pdf_export" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
                                            <span className="text-xs font-semibold text-foreground uppercase">Memória de Cálculo</span>
                                            <span className="text-xs font-mono text-muted-foreground">{result.hash}</span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-12">#</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Descrição</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Fórmula</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Resultado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.memory.map((step, idx) => (
                                                    <tr key={idx} className="border-t border-border/50">
                                                        <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{step.step}</td>
                                                        <td className="px-4 py-2 text-foreground">{step.description}</td>
                                                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{step.formula}</td>
                                                        <td className="px-4 py-2 text-right font-semibold text-foreground">{step.result}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground border-t border-border">
                                            {result.baseLegal}
                                        </div>
                                    </div>
                                </FeatureLock>

                                {/* Comparison */}
                                {showComparison && comparison && (
                                    <FeatureLock featureId="pdf_export" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-foreground">Comparativo Cumulativo × Não-Cumulativo</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="border border-border rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Cumulativo</h4>
                                                    <div className="text-2xl font-bold text-foreground">{fmt(comparison.cumulativo.resultado.total)}</div>
                                                    <div className="text-xs text-muted-foreground">PIS 0,65% + COFINS 3%</div>
                                                </div>
                                                <div className="border-2 border-primary rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-primary uppercase mb-3">Não-Cumulativo</h4>
                                                    <div className="text-2xl font-bold text-primary">{fmt(comparison.naoCumulativo.resultado.total)}</div>
                                                    <div className="text-xs text-muted-foreground">PIS 1,65% + COFINS 7,6%</div>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                                                Diferença: {fmt(Math.abs(comparison.diferenca))} ({comparison.economiaPercentual}% {parseFloat(comparison.economiaPercentual) > 0 ? 'economia' : 'custo adicional'})
                                            </div>
                                        </div>
                                    </FeatureLock>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
                                </div>
                                <FeatureLock featureId="pdf_export" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{history.length}</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="pdf_export" fallback={
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Histórico disponível no PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white">Upgrade</button>
                                </div>
                            }>
                                {history.length === 0
                                    ? <p className="text-xs text-muted-foreground text-center py-4">Nenhum cálculo</p>
                                    : <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {history.slice(0, 10).map((h, i) => (
                                            <button key={i} onClick={() => { setFormData(h.inputs); setResult(h); }}
                                                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-muted-foreground">{h.inputs.regime}</span>
                                                    <span className="font-semibold text-primary">{fmt(h.resultado.total)}</span>
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground truncate">{h.hash}</div>
                                            </button>
                                        ))}
                                    </div>
                                }
                            </FeatureLock>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
                            <h4 className="font-semibold mb-2">📋 Sobre PIS/COFINS</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Cumulativo: 0,65% + 3% = 3,65%</li>
                                <li>• Não-Cumulativo: 1,65% + 7,6% = 9,25%</li>
                                <li>• Não-Cumulativo permite créditos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
