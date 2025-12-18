export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { FileText, Download, Lock, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { calculateMEIDASWithMemory } from '../../lib/meiDasHash';

const VALORES_DAS = {
    comercio: { inss: 71.60, icms: 1.00, iss: 0, total: 72.60 },
    industria: { inss: 71.60, icms: 1.00, iss: 0, total: 72.60 },
    servico: { inss: 71.60, icms: 0, iss: 5.00, total: 76.60 },
    misto: { inss: 71.60, icms: 1.00, iss: 5.00, total: 77.60 }
};

export default function MEIRelatorioPage() {
    const [ano, setAno] = useState(new Date().getFullYear());
    const [atividade, setAtividade] = useState('comercio');
    const [meses, setMeses] = useState({});
    const [receitas, setReceitas] = useState({});

    useEffect(() => {
        const savedMeses = JSON.parse(localStorage.getItem(`mei_meses_${ano}`) || '{}');
        setMeses(savedMeses);
        const savedReceitas = JSON.parse(localStorage.getItem(`mei_receitas_${ano}`) || '[]');
        // Agregar receitas por mês
        const porMes = {};
        savedReceitas.forEach(r => {
            const mes = new Date(r.data).getMonth();
            porMes[mes] = (porMes[mes] || 0) + r.valor;
        });
        setReceitas(porMes);
    }, [ano]);

    const toggleMes = (mes) => {
        const novo = { ...meses, [mes]: !meses[mes] };
        setMeses(novo);
        localStorage.setItem(`mei_meses_${ano}`, JSON.stringify(novo));
    };

    const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const valorDAS = VALORES_DAS[atividade];
    const totalDAS = Object.keys(meses).filter(k => meses[k]).length * valorDAS.total;
    const totalReceitas = Object.values(receitas).reduce((s, v) => s + v, 0);

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="MEI Relatório" description="Relatório mensal do MEI">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Relatório Mensal MEI</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-600">MEI</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Controle de pagamentos e receitas mensais</p>
                    </div>
                    <select value={ano} onChange={(e) => setAno(parseInt(e.target.value))}
                        className="h-9 px-3 text-sm rounded-lg border border-input bg-background">
                        {[2024, 2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Resumo Anual */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground">Receita Total</div>
                                <div className="text-xl font-bold text-green-600">{fmt(totalReceitas)}</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground">DAS Pagos</div>
                                <div className="text-xl font-bold text-blue-600">{Object.values(meses).filter(Boolean).length}/12</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground">Total DAS Pago</div>
                                <div className="text-xl font-bold text-foreground">{fmt(totalDAS)}</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground">DAS Mensal</div>
                                <div className="text-xl font-bold text-foreground">{fmt(valorDAS.total)}</div>
                            </div>
                        </div>

                        {/* Atividade */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tipo de Atividade</h2>
                            <div className="grid grid-cols-4 gap-3">
                                {Object.keys(VALORES_DAS).map(tipo => (
                                    <button key={tipo} onClick={() => setAtividade(tipo)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${atividade === tipo
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:bg-muted'
                                            }`}>
                                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                        <div className="text-xs mt-1 opacity-75">{fmt(VALORES_DAS[tipo].total)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid de Meses */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-foreground">Controle de Pagamento DAS</h2>
                                <FeatureLock featureId="mei_reports" showUpgrade={false} fallback={
                                    <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                    </button>
                                }>
                                    <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> PDF
                                    </button>
                                </FeatureLock>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {nomeMes.map((nome, idx) => {
                                    const pago = meses[idx];
                                    const receitaMes = receitas[idx] || 0;
                                    return (
                                        <button key={idx} onClick={() => toggleMes(idx)}
                                            className={`p-4 rounded-lg border transition-all ${pago
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-border hover:border-primary/50'
                                                }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-foreground">{nome}</span>
                                                {pago ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                DAS: {fmt(valorDAS.total)}
                                            </div>
                                            <div className="text-xs text-green-600">
                                                Receita: {fmt(receitaMes)}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Composição DAS</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">INSS</span>
                                    <span className="font-medium">{fmt(valorDAS.inss)}</span>
                                </div>
                                {valorDAS.icms > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ICMS</span>
                                        <span className="font-medium">{fmt(valorDAS.icms)}</span>
                                    </div>
                                )}
                                {valorDAS.iss > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ISS</span>
                                        <span className="font-medium">{fmt(valorDAS.iss)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-border">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-primary">{fmt(valorDAS.total)}</span>
                                </div>
                            </div>
                        </div>

                        <FeatureLock featureId="mei_reports" fallback={
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    Relatório Anual
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">PRO</span>
                                </h3>
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Relatório PDF disponível no PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 text-white">Upgrade</button>
                                </div>
                            </div>
                        }>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Relatório Anual</h3>
                                <button className="w-full h-10 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Gerar PDF
                                </button>
                            </div>
                        </FeatureLock>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
                            <h4 className="font-semibold mb-2">📋 Relatório MEI</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Controle de DAS pagos</li>
                                <li>• Receitas por mês</li>
                                <li>• Exportação PDF (PRO)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
