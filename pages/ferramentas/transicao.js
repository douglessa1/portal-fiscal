export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Calendar, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateTransicaoWithMemory, CRONOGRAMA } from '../../lib/transicaoHash';

export default function TransicaoPage() {
    const [formData, setFormData] = useState({
        valorOperacao: '', ano: 2026, tipoOperacao: 'mercadoria'
    });
    const [result, setResult] = useState(null);
    const [allYears, setAllYears] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('transicao_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const calcResult = calculateTransicaoWithMemory(formData);
        setResult(calcResult);

        // Calculate for all years
        const years = {};
        CRONOGRAMA.forEach(c => {
            years[c.ano] = calculateTransicaoWithMemory({ ...formData, ano: c.ano });
        });
        setAllYears(years);

        const newHistory = [calcResult, ...history.slice(0, 49)];
        setHistory(newHistory);
        localStorage.setItem('transicao_history', JSON.stringify(newHistory));
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Transição 2026-2033" description="Simulador do período de transição">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Transição 2026-2033</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-orange-500/10 text-orange-600">Reforma</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Simulador da carga tributária durante a transição</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor da Operação (R$)</label>
                                        <input type="number" name="valorOperacao" value={formData.valorOperacao} onChange={handleChange}
                                            placeholder="10000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Ano</label>
                                        <select name="ano" value={formData.ano} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            {CRONOGRAMA.map(c => (
                                                <option key={c.ano} value={c.ano}>{c.ano} - {c.fase}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tipo</label>
                                        <select name="tipoOperacao" value={formData.tipoOperacao} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="mercadoria">Mercadoria (ICMS)</option>
                                            <option value="servico">Serviço (ISS)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="submit"
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" /> Simular Transição
                            </button>
                        </form>

                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">{result.resultado.ano} - {result.resultado.fase}</h2>
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

                                    <div className="grid grid-cols-5 gap-3 mb-4">
                                        {result.resultado.icmsOuIss > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">{formData.tipoOperacao === 'mercadoria' ? 'ICMS' : 'ISS'}</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.icmsOuIss)}</div>
                                            </div>
                                        )}
                                        {result.resultado.pisCofins > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">PIS/COFINS</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.pisCofins)}</div>
                                            </div>
                                        )}
                                        {result.resultado.cbs > 0 && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                                <div className="text-xs text-blue-600">CBS</div>
                                                <div className="text-base font-bold text-blue-600">{fmt(result.resultado.cbs)}</div>
                                            </div>
                                        )}
                                        {result.resultado.ibs > 0 && (
                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                                <div className="text-xs text-purple-600">IBS</div>
                                                <div className="text-base font-bold text-purple-600">{fmt(result.resultado.ibs)}</div>
                                            </div>
                                        )}
                                        <div className="bg-primary rounded-lg p-3">
                                            <div className="text-xs text-primary-foreground/80">Total ({result.resultado.percentual}%)</div>
                                            <div className="text-base font-bold text-primary-foreground">{fmt(result.resultado.total)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {/* Timeline comparison - PRO */}
                                <FeatureLock featureId="reforma_scenarios" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-foreground">Evolução da Carga Tributária</h3>
                                        <div className="bg-card border border-border rounded-lg p-4">
                                            <div className="grid grid-cols-8 gap-2">
                                                {allYears && Object.entries(allYears).map(([ano, data]) => (
                                                    <div key={ano} className={`p-2 rounded text-center ${parseInt(ano) === formData.ano ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                                                        <div className="text-xs font-semibold">{ano}</div>
                                                        <div className="text-sm font-bold">{data.resultado.percentual}%</div>
                                                        <div className="text-[10px] opacity-75">{fmt(data.resultado.total)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </FeatureLock>

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

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Cronograma</h3>
                            <div className="space-y-2">
                                {CRONOGRAMA.map(c => (
                                    <div key={c.ano} className={`p-2 rounded-lg text-xs flex justify-between ${c.ano === parseInt(formData.ano) ? 'bg-primary/10 border border-primary' : 'bg-muted/50'}`}>
                                        <span className="font-semibold">{c.ano}</span>
                                        <span className="text-muted-foreground">{c.fase}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-sm text-orange-800 dark:text-orange-200">
                            <h4 className="font-semibold mb-2">📋 Transição</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• 2026-2028: Teste CBS/IBS</li>
                                <li>• 2029-2032: Redução gradual</li>
                                <li>• 2033: Sistema novo 100%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
