export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import MemoryOfCalculation from '../../components/DIFAL/MemoryOfCalculation';
import ComparisonBlock from '../../components/DIFAL/ComparisonBlock';
import { FeatureLock, UpgradePrompt, FeatureButton } from '../../components/Permissions/FeatureLock';
import { usePlan } from '../../components/Permissions/PlanProvider';
import { useState, useEffect } from 'react';
import { ArrowRightLeft, Upload, FileText, Calculator, Copy, Download, History, Eye, Lock, Share2 } from 'lucide-react';
import { calculateDIFALWithMemory, compareDIFALMethods } from '../../lib/difalHash';

function DIFALPageContent() {
    const [formData, setFormData] = useState({
        valor: '', ufOrigem: '', ufDestino: '',
        aliqInter: '', aliqInterna: '', aliqFCP: '0',
        metodologia: 'base_dupla'
    });
    const [result, setResult] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState(false); // Audit mode

    const ufs = [
        { sigla: 'AC', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'AL', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'AM', regiao: 'norte', aliqInterna: 18 },
        { sigla: 'BA', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'CE', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'DF', regiao: 'centro-oeste', aliqInterna: 18 },
        { sigla: 'ES', regiao: 'sudeste', aliqInterna: 17 },
        { sigla: 'GO', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'MA', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'MG', regiao: 'sudeste', aliqInterna: 18 },
        { sigla: 'MS', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'MT', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'PA', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'PB', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'PE', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'PI', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'PR', regiao: 'sul', aliqInterna: 18 },
        { sigla: 'RJ', regiao: 'sudeste', aliqInterna: 20 },
        { sigla: 'RN', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'RO', regiao: 'norte', aliqInterna: 17.5 },
        { sigla: 'RR', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'RS', regiao: 'sul', aliqInterna: 18 },
        { sigla: 'SC', regiao: 'sul', aliqInterna: 17 },
        { sigla: 'SE', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'SP', regiao: 'sudeste', aliqInterna: 18 },
        { sigla: 'TO', regiao: 'norte', aliqInterna: 18 }
    ];

    const aliqInter = { norte: 7, nordeste: 7, 'centro-oeste': 7, sul: 12, sudeste: 12 };

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('difal_audit_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        if (viewMode) return;
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'ufDestino' && value) {
            const uf = ufs.find(u => u.sigla === value);
            if (uf) {
                setFormData(prev => ({
                    ...prev,
                    aliqInterna: uf.aliqInterna.toString(),
                    metodologia: value === 'ES' ? 'base_unica' : prev.metodologia
                }));
            }
        }

        if (name === 'ufOrigem' || name === 'ufDestino') {
            const destino = name === 'ufDestino' ? value : formData.ufDestino;
            const ufDest = ufs.find(u => u.sigla === destino);
            if (ufDest) {
                setFormData(prev => ({ ...prev, aliqInter: (aliqInter[ufDest.regiao] || 12).toString() }));
            }
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        if (viewMode) return;
        setError('');
        setLoading(true);

        try {
            const calcResult = calculateDIFALWithMemory(formData);
            setResult(calcResult);

            if (showComparison) {
                const comp = compareDIFALMethods(formData);
                setComparison(comp);
            }

            // Save to history (versioned)
            const newHistory = [calcResult, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('difal_audit_history', JSON.stringify(newHistory));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFromHistory = (item) => {
        setFormData(item.inputs);
        setResult(item);
        setViewMode(true);
    };

    const copyHash = () => {
        if (result?.hash) {
            navigator.clipboard.writeText(result.hash);
        }
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Calculadora DIFAL" description="Diferencial de Alíquotas ICMS - Auditável">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <ArrowRightLeft className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-foreground">Calculadora DIFAL</h1>
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">ICMS</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Diferencial de Alíquotas • LC 190/2022 • Memória Auditável</p>
                        </div>
                    </div>
                    {viewMode && (
                        <button onClick={() => setViewMode(false)} className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
                            <Eye className="w-4 h-4 mr-2 inline" /> Sair do Modo Visualização
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* FORM COLUMN */}
                    <div className="col-span-2 space-y-6">

                        {/* XML Import Card */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Upload className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">Importar XML NFe</h3>
                                    <p className="text-xs text-muted-foreground">Preenche automaticamente os dados da operação</p>
                                </div>
                                <label className={`h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted cursor-pointer flex items-center gap-2 ${viewMode ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <FileText className="w-4 h-4" />
                                    Selecionar XML
                                    <input type="file" accept=".xml" className="hidden" disabled={viewMode} />
                                </label>
                            </div>
                        </div>

                        {/* FORM Card */}
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">

                            {/* Dados da Operação */}
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados da Operação</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor da Operação (R$)</label>
                                        <input
                                            type="number" name="valor" value={formData.valor} onChange={handleChange}
                                            placeholder="10000.00" step="0.01" required disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">UF Origem</label>
                                        <select name="ufOrigem" value={formData.ufOrigem} onChange={handleChange} required disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50">
                                            <option value="">Selecione</option>
                                            {ufs.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">UF Destino</label>
                                        <select name="ufDestino" value={formData.ufDestino} onChange={handleChange} required disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50">
                                            <option value="">Selecione</option>
                                            {ufs.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Alíquotas */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Alíquotas</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Interestadual (%)</label>
                                        <input type="number" name="aliqInter" value={formData.aliqInter} onChange={handleChange}
                                            step="0.01" required disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Interna Destino (%)</label>
                                        <input type="number" name="aliqInterna" value={formData.aliqInterna} onChange={handleChange}
                                            step="0.01" required disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">FCP (%)</label>
                                        <input type="number" name="aliqFCP" value={formData.aliqFCP} onChange={handleChange}
                                            step="0.01" disabled={viewMode}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background disabled:opacity-50" />
                                    </div>
                                </div>
                            </div>

                            {/* Metodologia */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Metodologia de Cálculo</h2>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="metodologia" value="base_dupla" checked={formData.metodologia === 'base_dupla'}
                                            onChange={handleChange} disabled={viewMode} className="w-4 h-4 accent-primary" />
                                        <span className="text-sm font-medium">Base Dupla</span>
                                        <span className="text-xs text-muted-foreground">(cálculo por dentro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="metodologia" value="base_unica" checked={formData.metodologia === 'base_unica'}
                                            onChange={handleChange} disabled={viewMode} className="w-4 h-4 accent-primary" />
                                        <span className="text-sm font-medium">Base Única</span>
                                        <span className="text-xs text-muted-foreground">(cálculo por fora - ES)</span>
                                    </label>
                                </div>

                                <label className="flex items-center gap-2 mt-3">
                                    <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)}
                                        disabled={viewMode} className="w-4 h-4 accent-primary rounded" />
                                    <span className="text-sm text-muted-foreground">Exibir comparativo Base Única × Base Dupla</span>
                                </label>
                            </div>

                            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}

                            {/* CTA */}
                            {!viewMode && (
                                <button type="submit" disabled={loading}
                                    className="w-full h-11 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Calculator className="w-4 h-4" />
                                    {loading ? 'Calculando...' : 'Calcular DIFAL'}
                                </button>
                            )}
                        </form>

                        {/* RESULT */}
                        {result && (
                            <div className="space-y-4">
                                {/* Summary */}
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Resultado do Cálculo</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={copyHash} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Copiar Hash
                                            </button>
                                            <FeatureLock featureId="difal_pdf" showUpgrade={false} fallback={
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1" title="Disponível no Plano PRO">
                                                    <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                                </button>
                                            }>
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF
                                                </button>
                                            </FeatureLock>
                                            <FeatureLock featureId="difal_share" showUpgrade={false} fallback={
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1" title="Disponível no Plano Auditor">
                                                    <Share2 className="w-3.5 h-3.5" /> <Lock className="w-3 h-3 text-amber-500" />
                                                </button>
                                            }>
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                    <Share2 className="w-3.5 h-3.5" /> Compartilhar
                                                </button>
                                            </FeatureLock>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        {result.resultado.baseMajorada && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">Base Majorada</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.baseMajorada)}</div>
                                            </div>
                                        )}
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ICMS Origem</div>
                                            <div className="text-base font-bold text-orange-600 dark:text-orange-400">{fmt(result.resultado.icmsOrigem)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ICMS Destino</div>
                                            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{fmt(result.resultado.icmsDestino)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">DIFAL + FCP</div>
                                            <div className="text-base font-bold text-green-600 dark:text-green-400">{fmt(result.resultado.difal)} + {fmt(result.resultado.fcp)}</div>
                                        </div>
                                    </div>

                                    <div className="bg-primary rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-primary-foreground/80">Total DIFAL a Recolher</div>
                                            <div className="text-xs text-primary-foreground/60 font-mono mt-0.5">{result.hash}</div>
                                        </div>
                                        <div className="text-3xl font-bold text-primary-foreground">{fmt(result.resultado.totalDifal)}</div>
                                    </div>
                                </div>

                                {/* Memory of Calculation - PRO */}
                                <FeatureLock featureId="difal_memory" fallback={
                                    <UpgradePrompt requiredPlan="pro" />
                                }>
                                    <MemoryOfCalculation steps={result.memory} hash={result.hash} timestamp={result.timestamp} />
                                </FeatureLock>

                                {/* Comparison - PRO */}
                                {showComparison && comparison && (
                                    <FeatureLock featureId="difal_compare" fallback={
                                        <UpgradePrompt requiredPlan="pro" />
                                    }>
                                        <ComparisonBlock comparison={comparison} />
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
                                <FeatureLock featureId="difal_history" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{history.length} registros</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="difal_history" fallback={
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Histórico versionado disponível no plano PRO</p>
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
                                                    <span className="font-mono text-muted-foreground">{h.inputs.ufOrigem}→{h.inputs.ufDestino}</span>
                                                    <span className="font-semibold text-primary">{fmt(h.resultado.totalDifal)}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono truncate">{h.hash}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FeatureLock>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
                        <h4 className="font-semibold mb-2">📋 Sobre esta calculadora</h4>
                        <ul className="space-y-1 text-xs">
                            <li>• Memória de cálculo auditável</li>
                            <li>• Hash único por operação</li>
                            <li>• Comparativo Base Única × Dupla</li>
                            <li>• Histórico versionado</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function DIFALPage() {
    return (
        <AuthGate>
            <DIFALPageContent />
        </AuthGate>
    );
}
