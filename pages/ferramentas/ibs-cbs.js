export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { ArrowRightLeft, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateIBSCBSWithMemory, compareAtualVsReforma, ALIQUOTAS_REFORMA, TRANSICAO } from '../../lib/ibsCbsHash';

export default function IBSCBSPage() {
    const [formData, setFormData] = useState({
        valor: '', tipoOperacao: 'venda',
        aliqIBS: ALIQUOTAS_REFORMA.IBS.toString(),
        aliqCBS: ALIQUOTAS_REFORMA.CBS.toString(),
        creditoIBS: '0', creditoCBS: '0'
    });
    const [result, setResult] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [showComparison, setShowComparison] = useState(true);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('ibscbs_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        const calcResult = calculateIBSCBSWithMemory(formData);
        setResult(calcResult);

        if (showComparison) {
            const comp = compareAtualVsReforma(formData);
            setComparison(comp);
        }

        const newHistory = [calcResult, ...history.slice(0, 49)];
        setHistory(newHistory);
        localStorage.setItem('ibscbs_history', JSON.stringify(newHistory));
        setLoading(false);
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="IBS/CBS" description="Novos Tributos da Reforma">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                        <ArrowRightLeft className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">IBS / CBS</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-500/10 text-purple-600">Reforma</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Imposto sobre Bens e Serviços • EC 132/2023</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor da Operação (R$)</label>
                                        <input type="number" name="valor" value={formData.valor} onChange={handleChange}
                                            placeholder="10000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tipo de Operação</label>
                                        <select name="tipoOperacao" value={formData.tipoOperacao} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="venda">Venda de Mercadorias</option>
                                            <option value="servico">Prestação de Serviços</option>
                                            <option value="importacao">Importação</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Alíquotas (Estimadas)</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                        <div className="text-xs text-purple-600 dark:text-purple-400">IBS (Estadual/Municipal)</div>
                                        <div className="text-lg font-bold text-purple-600">{formData.aliqIBS}%</div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <div className="text-xs text-blue-600 dark:text-blue-400">CBS (Federal)</div>
                                        <div className="text-lg font-bold text-blue-600">{formData.aliqCBS}%</div>
                                    </div>
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <div className="text-xs text-primary">Total</div>
                                        <div className="text-lg font-bold text-primary">{ALIQUOTAS_REFORMA.total}%</div>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)}
                                    className="w-4 h-4 accent-primary rounded" />
                                <span className="text-sm text-muted-foreground">Comparar com sistema atual (ICMS + PIS/COFINS)</span>
                            </label>

                            <button type="submit" disabled={loading}
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                {loading ? 'Calculando...' : 'Calcular IBS/CBS'}
                            </button>
                        </form>

                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Resultado (Pós-Reforma)</h2>
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

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <div className="text-xs text-blue-600">CBS (Federal)</div>
                                            <div className="text-base font-bold text-blue-600">{fmt(result.resultado.cbsLiquido)}</div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                            <div className="text-xs text-purple-600">IBS (Est/Mun)</div>
                                            <div className="text-base font-bold text-purple-600">{fmt(result.resultado.ibsLiquido)}</div>
                                        </div>
                                        <div className="bg-primary rounded-lg p-3">
                                            <div className="text-xs text-primary-foreground/80">Total ({result.resultado.aliqEfetiva}%)</div>
                                            <div className="text-base font-bold text-primary-foreground">{fmt(result.resultado.total)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {/* Comparison */}
                                {showComparison && comparison && (
                                    <FeatureLock featureId="reforma_scenarios" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-foreground">Comparativo: Sistema Atual × Reforma</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="border border-border rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Sistema Atual</h4>
                                                    <div className="space-y-2 text-sm mb-3">
                                                        <div className="flex justify-between"><span className="text-muted-foreground">ICMS (18%)</span><span>{fmt(comparison.atual.icms)}</span></div>
                                                        <div className="flex justify-between"><span className="text-muted-foreground">PIS/COFINS</span><span>{fmt(comparison.atual.pisCofins)}</span></div>
                                                    </div>
                                                    <div className="text-xl font-bold text-foreground">{fmt(comparison.atual.total)}</div>
                                                </div>
                                                <div className="border-2 border-primary rounded-lg p-4 bg-card">
                                                    <h4 className="text-xs font-semibold text-primary uppercase mb-3">Com Reforma</h4>
                                                    <div className="space-y-2 text-sm mb-3">
                                                        <div className="flex justify-between"><span className="text-muted-foreground">CBS</span><span>{fmt(comparison.reforma.cbsLiquido)}</span></div>
                                                        <div className="flex justify-between"><span className="text-muted-foreground">IBS</span><span>{fmt(comparison.reforma.ibsLiquido)}</span></div>
                                                    </div>
                                                    <div className="text-xl font-bold text-primary">{fmt(comparison.reforma.total)}</div>
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-lg text-sm ${comparison.diferenca > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
                                                Diferença: {fmt(Math.abs(comparison.diferenca))} ({comparison.percentual}% {comparison.diferenca > 0 ? 'a mais' : 'a menos'})
                                            </div>
                                        </div>
                                    </FeatureLock>
                                )}

                                {/* Memory - PRO */}
                                <FeatureLock featureId="reforma_scenarios" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border">
                                            <span className="text-xs font-semibold text-foreground uppercase">Memória de Cálculo</span>
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
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Cronograma de Transição</h3>
                            <div className="space-y-2 text-xs">
                                {TRANSICAO.slice(0, 5).map(t => (
                                    <div key={t.ano} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                        <span className="font-semibold">{t.ano}</span>
                                        <span className="text-muted-foreground">ICMS {t.icms}% → IBS {t.ibs}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
                            <h4 className="font-semibold mb-2">📋 Reforma Tributária</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• IBS substitui ICMS + ISS</li>
                                <li>• CBS substitui PIS + COFINS</li>
                                <li>• Transição de 2026 a 2033</li>
                                <li>• Alíquota prevista: 26,5%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
