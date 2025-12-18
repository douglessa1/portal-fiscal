import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Building2, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateSimplesWithMemory, ANEXOS } from '../../lib/simplesHash';

export default function SimplesNacionalPage() {
    const [formData, setFormData] = useState({
        rbt12: '', receita: '', anexo: 'I', fatorR: ''
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('simples_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const calcResult = calculateSimplesWithMemory(formData);
            setResult(calcResult);

            const newHistory = [calcResult, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('simples_history', JSON.stringify(newHistory));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Simples Nacional" description="Cálculo do DAS">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-green-500/10 rounded-xl">
                        <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Simples Nacional</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600">Regime</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Cálculo do DAS por Anexo • LC 123/2006</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* FORM */}
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">

                            {/* Receita */}
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Receita Bruta 12 meses (R$)</label>
                                        <input type="number" name="rbt12" value={formData.rbt12} onChange={handleChange}
                                            placeholder="480000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Receita do Mês (R$)</label>
                                        <input type="number" name="receita" value={formData.receita} onChange={handleChange}
                                            placeholder="50000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                </div>
                            </div>

                            {/* Anexo */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Anexo</h2>
                                <div className="grid grid-cols-5 gap-2">
                                    {Object.entries(ANEXOS).map(([key, val]) => (
                                        <label key={key} className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.anexo === key ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                                            }`}>
                                            <input type="radio" name="anexo" value={key} checked={formData.anexo === key}
                                                onChange={handleChange} className="sr-only" />
                                            <span className="text-lg font-bold text-foreground">Anexo {key}</span>
                                            <span className="text-xs text-muted-foreground text-center">{val.nome.replace('Anexo ' + key + ' - ', '')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fator R */}
                            {formData.anexo === 'V' && (
                                <div className="pt-4 border-t border-border/50">
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Fator R</h2>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Fator R (Folha ÷ Receita)</label>
                                        <input type="number" name="fatorR" value={formData.fatorR} onChange={handleChange}
                                            placeholder="0.28" step="0.01" max="1"
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                        <p className="text-xs text-muted-foreground mt-1">Se ≥ 28%, tributação pelo Anexo III</p>
                                    </div>
                                </div>
                            )}

                            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}

                            <button type="submit" disabled={loading}
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                {loading ? 'Calculando...' : 'Calcular DAS'}
                            </button>
                        </form>

                        {/* RESULT */}
                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">{result.resultado.anexoNome}</h2>
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

                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">Alíq. Nominal</div>
                                            <div className="text-base font-bold text-foreground">{result.resultado.aliqNominal}%</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">Dedução</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.deducao)}</div>
                                        </div>
                                        <div className="bg-primary/10 rounded-lg p-3">
                                            <div className="text-xs text-primary">Alíq. Efetiva</div>
                                            <div className="text-base font-bold text-primary">{result.resultado.aliqEfetiva.toFixed(2)}%</div>
                                        </div>
                                        <div className="bg-green-600 rounded-lg p-3">
                                            <div className="text-xs text-white/80">DAS a Pagar</div>
                                            <div className="text-base font-bold text-white">{fmt(result.resultado.valorDAS)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {/* Memory - PRO */}
                                <FeatureLock featureId="pdf_export" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
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
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 text-white">Upgrade</button>
                                </div>
                            }>
                                {history.length === 0
                                    ? <p className="text-xs text-muted-foreground text-center py-4">Nenhum cálculo</p>
                                    : <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {history.slice(0, 10).map((h, i) => (
                                            <button key={i} onClick={() => { setFormData(h.inputs); setResult(h); }}
                                                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-muted-foreground">Anexo {h.inputs.anexo}</span>
                                                    <span className="font-semibold text-green-600">{fmt(h.resultado.valorDAS)}</span>
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground truncate">{h.hash}</div>
                                            </button>
                                        ))}
                                    </div>
                                }
                            </FeatureLock>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-800 dark:text-green-200">
                            <h4 className="font-semibold mb-2">📋 Anexos</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• I - Comércio</li>
                                <li>• II - Indústria</li>
                                <li>• III - Serviços</li>
                                <li>• IV - Serviços (sem INSS)</li>
                                <li>• V - Serviços (Fator R)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
