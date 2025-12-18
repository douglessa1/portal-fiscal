import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Download, Lock, Filter, Calendar } from 'lucide-react';

const MOCK_DATA = {
    resumo: {
        receitaBruta: 1250000,
        tributosDevidos: 287500,
        cargaTributaria: 23,
        comparativoMes: 5.2
    },
    porTributo: [
        { nome: 'ICMS', valor: 180000, pct: 62.6 },
        { nome: 'PIS', valor: 20625, pct: 7.2 },
        { nome: 'COFINS', valor: 95000, pct: 33.0 },
        { nome: 'ISS', valor: 12500, pct: 4.3 },
    ],
    evolucao: [
        { mes: 'Jul', valor: 245000 },
        { mes: 'Ago', valor: 268000 },
        { mes: 'Set', valor: 255000 },
        { mes: 'Out', valor: 290000 },
        { mes: 'Nov', valor: 275000 },
        { mes: 'Dez', valor: 287500 },
    ]
};

export default function BIFiscalPage() {
    const [periodo, setPeriodo] = useState('6m');
    const [loading, setLoading] = useState(false);
    const data = MOCK_DATA;

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const maxValor = Math.max(...data.evolucao.map(e => e.valor));

    return (
        <ToolLayout title="BI Fiscal" description="Business Intelligence Tributário">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">BI Fiscal</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-500/10 text-indigo-600">Inteligência</span>
                            <FeatureLock featureId="bi_fiscal" showUpgrade={false} fallback={
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> PRO
                                </span>
                            }><span></span></FeatureLock>
                        </div>
                        <p className="text-sm text-muted-foreground">Dashboard de inteligência tributária</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
                            className="h-9 px-3 text-sm rounded-lg border border-input bg-background">
                            <option value="3m">3 meses</option>
                            <option value="6m">6 meses</option>
                            <option value="12m">12 meses</option>
                        </select>
                    </div>
                </div>

                <FeatureLock featureId="bi_fiscal" fallback={
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">BI Fiscal é exclusivo do Plano PRO</h3>
                        <p className="text-sm text-muted-foreground mb-4">Acesse dashboards inteligentes, análises de carga tributária e insights para tomada de decisão.</p>
                        <button className="h-10 px-6 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                            Fazer Upgrade para PRO
                        </button>
                    </div>
                }>
                    <div className="space-y-6">
                        {/* KPIs */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground mb-1">Receita Bruta</div>
                                <div className="text-xl font-bold text-foreground">{fmt(data.resumo.receitaBruta)}</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground mb-1">Tributos Devidos</div>
                                <div className="text-xl font-bold text-red-600">{fmt(data.resumo.tributosDevidos)}</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground mb-1">Carga Tributária</div>
                                <div className="text-xl font-bold text-foreground">{data.resumo.cargaTributaria}%</div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="text-xs text-muted-foreground mb-1">vs. Mês Anterior</div>
                                <div className={`text-xl font-bold flex items-center gap-1 ${data.resumo.comparativoMes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {data.resumo.comparativoMes > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {Math.abs(data.resumo.comparativoMes)}%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Chart */}
                            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-4">Evolução dos Tributos</h3>
                                <div className="flex items-end gap-2 h-48">
                                    {data.evolucao.map((e, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(e.valor / maxValor) * 180}px` }} />
                                            <div className="text-xs text-muted-foreground mt-2">{e.mes}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Por Tributo */}
                            <div className="bg-card border border-border rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-4">Por Tributo</h3>
                                <div className="space-y-3">
                                    {data.porTributo.map((t, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-foreground">{t.nome}</span>
                                                <span className="font-medium">{fmt(t.valor)}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${t.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Export */}
                        <div className="flex justify-end gap-2">
                            <FeatureLock featureId="bi_fiscal_export" fallback={
                                <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Exportar Relatório <Lock className="w-3 h-3 text-amber-500" />
                                </button>
                            }>
                                <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Exportar Relatório
                                </button>
                            </FeatureLock>
                        </div>
                    </div>
                </FeatureLock>
            </div>
        </ToolLayout>
    );
}
