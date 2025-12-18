export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import ICMSSTMemory from '../../components/ICMSST/ICMSSTMemory';
import ICMSSTComparison from '../../components/ICMSST/ICMSSTComparison';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Scale, Upload, FileText, Calculator, Copy, Download, History, Lock, Share2 } from 'lucide-react';
import { calculateICMSSTWithMemory, compareICMSSTMethods, calcularMVAAjustada } from '../../lib/icmsSTHash';

export default function ICMSSTPage() {
    const [formData, setFormData] = useState({
        valorProduto: '', ipi: '0', frete: '0', seguro: '0',
        outrasDespesas: '0', desconto: '0', mvaOriginal: '', mva: '',
        aliqInterna: '', aliqInterestadual: '', usarMVAAjustada: true
    });
    const [result, setResult] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('icmsst_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Auto-calcular MVA Ajustada
        if (['mvaOriginal', 'aliqInterestadual', 'aliqInterna'].includes(name)) {
            const mvaOrig = name === 'mvaOriginal' ? value : formData.mvaOriginal;
            const aliqInter = name === 'aliqInterestadual' ? value : formData.aliqInterestadual;
            const aliqInt = name === 'aliqInterna' ? value : formData.aliqInterna;

            if (mvaOrig && aliqInter && aliqInt && formData.usarMVAAjustada) {
                const mvaAjustada = calcularMVAAjustada(mvaOrig, aliqInter, aliqInt);
                setFormData(prev => ({ ...prev, mva: mvaAjustada.toFixed(2) }));
            }
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const calcResult = calculateICMSSTWithMemory(formData);
            setResult(calcResult);

            if (showComparison) {
                const comp = compareICMSSTMethods(formData);
                setComparison(comp);
            }

            const newHistory = [calcResult, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('icmsst_history', JSON.stringify(newHistory));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFromHistory = (item) => {
        setFormData(item.inputs);
        setResult(item);
    };

    const copyHash = () => {
        if (result?.hash) navigator.clipboard.writeText(result.hash);
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Calculadora ICMS-ST" description="Substituição Tributária">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Scale className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-foreground">Calculadora ICMS-ST</h1>
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">ICMS</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Substituição Tributária • LC 87/1996 • Memória Auditável</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* FORM COLUMN */}
                    <div className="col-span-2 space-y-6">

                        {/* XML Import */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Upload className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">Importar XML NFe</h3>
                                    <p className="text-xs text-muted-foreground">Preenche dados automaticamente</p>
                                </div>
                                <label className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted cursor-pointer flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Selecionar XML
                                    <input type="file" accept=".xml" className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">

                            {/* Dados do Produto */}
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados do Produto</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor do Produto (R$)</label>
                                        <input type="number" name="valorProduto" value={formData.valorProduto} onChange={handleChange}
                                            placeholder="1000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Frete (R$)</label>
                                        <input type="number" name="frete" value={formData.frete} onChange={handleChange}
                                            step="0.01" className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">IPI (%)</label>
                                        <input type="number" name="ipi" value={formData.ipi} onChange={handleChange}
                                            step="0.01" className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                </div>
                            </div>

                            {/* Alíquotas */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Alíquotas</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Interestadual (%)</label>
                                        <input type="number" name="aliqInterestadual" value={formData.aliqInterestadual} onChange={handleChange}
                                            step="0.01" required className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Interna Destino (%)</label>
                                        <input type="number" name="aliqInterna" value={formData.aliqInterna} onChange={handleChange}
                                            step="0.01" required className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">MVA Original (%)</label>
                                        <input type="number" name="mvaOriginal" value={formData.mvaOriginal} onChange={handleChange}
                                            step="0.01" required className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                </div>
                            </div>

                            {/* MVA */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">MVA Aplicada</h2>
                                <div className="flex items-center gap-4 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="usarMVAAjustada" checked={formData.usarMVAAjustada}
                                            onChange={handleChange} className="w-4 h-4 accent-primary" />
                                        <span className="text-sm">Calcular MVA Ajustada automaticamente</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground">MVA Original</div>
                                        <div className="text-lg font-bold text-foreground">{formData.mvaOriginal || '0.00'}%</div>
                                    </div>
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <div className="text-xs text-primary">MVA Ajustada</div>
                                        <div className="text-lg font-bold text-primary">{formData.mva || '0.00'}%</div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 mt-3">
                                    <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)}
                                        className="w-4 h-4 accent-primary rounded" />
                                    <span className="text-sm text-muted-foreground">Exibir comparativo MVA Original × Ajustada</span>
                                </label>
                            </div>

                            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}

                            {/* CTA */}
                            <button type="submit" disabled={loading}
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                {loading ? 'Calculando...' : 'Calcular ICMS-ST'}
                            </button>
                        </form>

                        {/* RESULT */}
                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Resultado do Cálculo</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={copyHash} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Copiar Hash
                                            </button>
                                            <FeatureLock featureId="icms_st_pdf" showUpgrade={false} fallback={
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1" title="Disponível no Plano PRO">
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
                                            <div className="text-xs text-muted-foreground">Base ICMS</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.baseICMSProprio)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ICMS Próprio</div>
                                            <div className="text-base font-bold text-orange-600 dark:text-orange-400">{fmt(result.resultado.icmsProprio)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">Base ST</div>
                                            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{fmt(result.resultado.baseCalculoST)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">IPI</div>
                                            <div className="text-base font-bold text-muted-foreground">{fmt(result.resultado.valorIPI)}</div>
                                        </div>
                                    </div>

                                    <div className="bg-primary rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-primary-foreground/80">ICMS-ST a Recolher</div>
                                            <div className="text-xs text-primary-foreground/60 font-mono mt-0.5">{result.hash}</div>
                                        </div>
                                        <div className="text-3xl font-bold text-primary-foreground">{fmt(result.resultado.icmsST)}</div>
                                    </div>
                                </div>

                                {/* Memory - PRO */}
                                <FeatureLock featureId="icms_st_memory" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <ICMSSTMemory steps={result.memory} hash={result.hash} timestamp={result.timestamp} baseLegal={result.baseLegal} />
                                </FeatureLock>

                                {/* Comparison - PRO */}
                                {showComparison && comparison && (
                                    <FeatureLock featureId="icms_st_memory" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                        <ICMSSTComparison comparison={comparison} />
                                    </FeatureLock>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        {/* History - PRO */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
                                </div>
                                <FeatureLock featureId="icms_st_history" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{history.length} registros</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="icms_st_history" fallback={
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Histórico disponível no plano PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                                        Upgrade para PRO
                                    </button>
                                </div>
                            }>
                                {history.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">Nenhum cálculo registrado</p>
                                ) : (
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                        {history.slice(0, 10).map((h, i) => (
                                            <button key={i} onClick={() => loadFromHistory(h)}
                                                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="font-mono text-muted-foreground">MVA {h.inputs.mva}%</span>
                                                    <span className="font-semibold text-primary">{fmt(h.resultado.icmsST)}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono truncate">{h.hash}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FeatureLock>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
                            <h4 className="font-semibold mb-2">📋 Sobre ICMS-ST</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• MVA Original → MVA Ajustada automática</li>
                                <li>• Comparativo de metodologias</li>
                                <li>• Memória de cálculo auditável</li>
                                <li>• Base legal: LC 87/1996</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
