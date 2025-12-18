export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { User, Calculator, Copy, Download, History, Lock } from 'lucide-react';
import { calculateMEIDASWithMemory, ATIVIDADES } from '../../lib/meiDasHash';

function MEIDASPageContent() {
    const [formData, setFormData] = useState({
        atividade: 'comercio',
        competencia: new Date().toISOString().slice(0, 7)
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('meidas_history') || '[]');
        setHistory(saved);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        const calcResult = calculateMEIDASWithMemory(formData);
        setResult(calcResult);

        const newHistory = [calcResult, ...history.slice(0, 49)];
        setHistory(newHistory);
        localStorage.setItem('meidas_history', JSON.stringify(newHistory));
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="MEI DAS" description="Cálculo do DAS do MEI">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-green-500/10 rounded-xl">
                        <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Cálculo de DAS</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600">MEI</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Documento de Arrecadação do Simples Nacional</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <form onSubmit={handleCalculate} className="bg-card border border-border rounded-xl p-5 space-y-5">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Competência</label>
                                        <input type="month" name="competencia" value={formData.competencia} onChange={handleChange}
                                            required className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Atividade</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(ATIVIDADES).map(([key, val]) => (
                                        <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.atividade === key ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border hover:bg-muted/50'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                <input type="radio" name="atividade" value={key} checked={formData.atividade === key}
                                                    onChange={handleChange} className="accent-green-600" />
                                                <span className="text-sm font-medium text-foreground">{val.nome}</span>
                                            </div>
                                            <span className="text-sm font-bold text-green-600">{fmt(val.total)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit"
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" /> Calcular DAS
                            </button>
                        </form>

                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">{result.resultado.atividade}</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => navigator.clipboard.writeText(result.hash)} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Hash
                                            </button>
                                            <FeatureLock featureId="mei_signed" showUpgrade={false} fallback={
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
                                            <div className="text-xs text-muted-foreground">INSS</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.inss)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ICMS</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.icms)}</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ISS</div>
                                            <div className="text-base font-bold text-foreground">{fmt(result.resultado.iss)}</div>
                                        </div>
                                    </div>

                                    <div className="bg-green-600 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-white/80">DAS a Pagar</div>
                                            <div className="text-xs text-white/60">Vencimento: {result.resultado.vencimento}</div>
                                        </div>
                                        <div className="text-3xl font-bold text-white">{fmt(result.resultado.total)}</div>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground mt-3">{result.hash}</div>
                                </div>

                                {/* Memory - PRO */}
                                <FeatureLock featureId="mei_reports" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border">
                                            <span className="text-xs font-semibold text-foreground uppercase">Composição do DAS</span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {result.memory.map((step, idx) => (
                                                    <tr key={idx} className="border-t border-border/50">
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
                                <FeatureLock featureId="mei_reports" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{history.length}</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="mei_reports" fallback={
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
                                                    <span className="text-muted-foreground">{h.inputs.competencia}</span>
                                                    <span className="font-semibold text-green-600">{fmt(h.resultado.total)}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                }
                            </FeatureLock>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-800 dark:text-green-200">
                            <h4 className="font-semibold mb-2">📋 MEI 2024</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Teto anual: R$ 81.000</li>
                                <li>• INSS: 5% do salário mínimo</li>
                                <li>• Vencimento: dia 20</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function MEIDASPage() {
    return (
        <AuthGate>
            <MEIDASPageContent />
        </AuthGate>
    );
}
