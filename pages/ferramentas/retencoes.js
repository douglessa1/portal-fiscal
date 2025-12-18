import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Landmark, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateRetencoesWithMemory, TIPOS_SERVICO } from '../../lib/retencoesHash';

export default function RetencoesPage() {
    const [formData, setFormData] = useState({
        valor: '', tipoServico: 'geral', tipoTomador: 'pj', issAliq: '5'
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('retencoes_history') || '[]');
        setHistory(saved);
    }, []);

    useEffect(() => {
        const config = TIPOS_SERVICO[formData.tipoServico];
        if (config?.issAliq) {
            setFormData(prev => ({ ...prev, issAliq: config.issAliq.toString() }));
        }
    }, [formData.tipoServico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const calcResult = calculateRetencoesWithMemory(formData);
            setResult(calcResult);

            const newHistory = [calcResult, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('retencoes_history', JSON.stringify(newHistory));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Retenções na Fonte" description="IRRF, CSLL, PIS, COFINS, ISS, INSS">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <Landmark className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Retenções na Fonte</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-orange-500/10 text-orange-600">Federal</span>
                        </div>
                        <p className="text-sm text-muted-foreground">IRRF • CSLL • PIS • COFINS • ISS • INSS</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* FORM */}
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">

                            {/* Dados */}
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Valor do Serviço (R$)</label>
                                        <input type="number" name="valor" value={formData.valor} onChange={handleChange}
                                            placeholder="10000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tipo de Serviço</label>
                                        <select name="tipoServico" value={formData.tipoServico} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="geral">Serviços em Geral</option>
                                            <option value="consultoria">Consultoria</option>
                                            <option value="desenvolvimentoSoftware">Desenvolvimento de Software</option>
                                            <option value="limpeza">Limpeza e Conservação</option>
                                            <option value="vigilancia">Vigilância</option>
                                            <option value="construcao">Construção Civil</option>
                                            <option value="transporte">Transporte</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tomador</label>
                                        <select name="tipoTomador" value={formData.tipoTomador} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="pj">Pessoa Jurídica</option>
                                            <option value="pf">Pessoa Física</option>
                                            <option value="orgaoPublico">Órgão Público</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* ISS */}
                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">ISS</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Alíquota ISS (%)</label>
                                        <input type="number" name="issAliq" value={formData.issAliq} onChange={handleChange}
                                            min="2" max="5" step="0.5"
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                </div>
                            </div>

                            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}

                            <button type="submit" disabled={loading}
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                {loading ? 'Calculando...' : 'Calcular Retenções'}
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
                                        {result.resultado.irrf !== undefined && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">IRRF</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.irrf)}</div>
                                            </div>
                                        )}
                                        {result.resultado.csll !== undefined && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">CSLL+PIS+COFINS</div>
                                                <div className="text-base font-bold text-foreground">{fmt((result.resultado.csll || 0) + (result.resultado.pis || 0) + (result.resultado.cofins || 0))}</div>
                                            </div>
                                        )}
                                        {result.resultado.inss !== undefined && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">INSS</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.inss)}</div>
                                            </div>
                                        )}
                                        {result.resultado.iss !== undefined && (
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground">ISS</div>
                                                <div className="text-base font-bold text-foreground">{fmt(result.resultado.iss)}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">Valor Bruto</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.valorBruto)}</div>
                                        </div>
                                        <div className="bg-red-500/10 rounded-lg p-3">
                                            <div className="text-xs text-red-600 dark:text-red-400">Total Retido ({result.resultado.percentualRetido}%)</div>
                                            <div className="text-base font-bold text-red-600 dark:text-red-400">{fmt(result.resultado.totalRetencoes)}</div>
                                        </div>
                                        <div className="bg-green-600 rounded-lg p-3">
                                            <div className="text-xs text-white/80">Valor Líquido</div>
                                            <div className="text-base font-bold text-white">{fmt(result.resultado.valorLiquido)}</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground mt-3">{result.hash}</div>
                                </div>

                                {/* Memory - PRO */}
                                <FeatureLock featureId="pdf_export" fallback={<UpgradePrompt requiredPlan="pro" />}>
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
                                                    <span className="text-muted-foreground">{fmt(h.resultado.valorBruto)}</span>
                                                    <span className="font-semibold text-red-600">{fmt(h.resultado.totalRetencoes)}</span>
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground truncate">{h.hash}</div>
                                            </button>
                                        ))}
                                    </div>
                                }
                            </FeatureLock>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-sm text-orange-800 dark:text-orange-200">
                            <h4 className="font-semibold mb-2">📋 Retenções</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• IRRF 1,5% (mín. R$ 10)</li>
                                <li>• CSLL 1% + PIS 0,65% + COFINS 3%</li>
                                <li>• INSS 11% (teto R$ 908,85)</li>
                                <li>• ISS 2% a 5%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
