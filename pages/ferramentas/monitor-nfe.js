export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { FileSearch, RefreshCw, CheckCircle, AlertTriangle, Clock, Download, Lock, History, Bell } from 'lucide-react';

const MOCK_NFES = [
    { chave: '35241112345678000123550010000001231234567890', numero: '123', serie: '1', emitente: 'Fornecedor A LTDA', valor: 15000, status: 'autorizada', data: '2024-12-10' },
    { chave: '35241198765432000198550010000004564567890123', numero: '456', serie: '1', emitente: 'Empresa B S/A', valor: 8500, status: 'autorizada', data: '2024-12-12' },
    { chave: '35241155555555000155550010000007897890123456', numero: '789', serie: '1', emitente: 'Comércio C EIRELI', valor: 2300, status: 'pendente', data: '2024-12-15' },
    { chave: '35241166666666000166550010000001011234567890', numero: '101', serie: '1', emitente: 'Indústria D LTDA', valor: 45000, status: 'cancelada', data: '2024-12-14' },
];

export default function MonitorNFePage() {
    const [nfes, setNfes] = useState(MOCK_NFES);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [filter, setFilter] = useState('todas');
    const [alerts, setAlerts] = useState([
        { id: 1, msg: 'NF-e 101 cancelada pelo emitente', type: 'warning', date: '2024-12-14' },
        { id: 2, msg: 'Nova NF-e recebida: #789', type: 'info', date: '2024-12-15' },
    ]);

    const refresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdate(new Date());
            setLoading(false);
        }, 1500);
    };

    const getStatusBadge = (s) => {
        if (s === 'autorizada') return <span className="px-2 py-0.5 text-xs rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Autorizada</span>;
        if (s === 'cancelada') return <span className="px-2 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Cancelada</span>;
        return <span className="px-2 py-0.5 text-xs rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Pendente</span>;
    };

    const filteredNfes = filter === 'todas' ? nfes : nfes.filter(n => n.status === filter);
    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Monitor NF-e" description="Acompanhamento em tempo real">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                        <FileSearch className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Monitor NF-e</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-500/10 text-purple-600">Auditoria</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Acompanhe NF-es destinadas à sua empresa</p>
                    </div>
                    <button onClick={refresh} disabled={loading}
                        className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2 disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-card border border-border rounded-lg p-3">
                                <div className="text-xs text-muted-foreground">Total NF-es</div>
                                <div className="text-xl font-bold text-foreground">{nfes.length}</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                <div className="text-xs text-green-600">Autorizadas</div>
                                <div className="text-xl font-bold text-green-600">{nfes.filter(n => n.status === 'autorizada').length}</div>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <div className="text-xs text-amber-600">Pendentes</div>
                                <div className="text-xl font-bold text-amber-600">{nfes.filter(n => n.status === 'pendente').length}</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <div className="text-xs text-red-600">Canceladas</div>
                                <div className="text-xl font-bold text-red-600">{nfes.filter(n => n.status === 'cancelada').length}</div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            {['todas', 'autorizada', 'pendente', 'cancelada'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`h-8 px-3 text-xs font-medium rounded-lg transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                        }`}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">NF-e</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Emitente</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Valor</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredNfes.map((nfe, i) => (
                                        <tr key={i} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground">#{nfe.numero}</div>
                                                <div className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{nfe.chave}</div>
                                            </td>
                                            <td className="px-4 py-3 text-foreground">{nfe.emitente}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{nfe.data}</td>
                                            <td className="px-4 py-3 text-right font-medium text-foreground">{fmt(nfe.valor)}</td>
                                            <td className="px-4 py-3 text-center">{getStatusBadge(nfe.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Export - PRO */}
                        <FeatureLock featureId="monitor_nfe_alerts" fallback={<UpgradePrompt requiredPlan="pro" />}>
                            <div className="flex justify-end gap-2">
                                <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Exportar CSV
                                </button>
                                <FeatureLock featureId="monitor_nfe_reports" fallback={
                                    <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-2">
                                        <Download className="w-4 h-4" /> PDF Técnico <Lock className="w-3 h-3 text-amber-500" />
                                    </button>
                                }>
                                    <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2">
                                        <Download className="w-4 h-4" /> PDF Técnico
                                    </button>
                                </FeatureLock>
                            </div>
                        </FeatureLock>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                                </span>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Alertas</h3>
                                </div>
                                <FeatureLock featureId="monitor_nfe_alerts" showUpgrade={false} fallback={
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> PRO
                                    </span>
                                }>
                                    <span className="text-xs text-muted-foreground">{alerts.length}</span>
                                </FeatureLock>
                            </div>
                            <FeatureLock featureId="monitor_nfe_alerts" fallback={
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-2">Alertas no PRO</p>
                                    <button className="h-8 px-3 text-xs font-semibold rounded-lg bg-purple-600 text-white">Upgrade</button>
                                </div>
                            }>
                                <div className="space-y-2">
                                    {alerts.map(a => (
                                        <div key={a.id} className={`p-2 rounded-lg text-xs ${a.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                                            }`}>
                                            <div className="flex items-start gap-2">
                                                {a.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 mt-0.5" /> : <Bell className="w-3.5 h-3.5 mt-0.5" />}
                                                <div>
                                                    <p>{a.msg}</p>
                                                    <p className="opacity-75">{a.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FeatureLock>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
                            <h4 className="font-semibold mb-2">📋 Monitor NF-e</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• NF-es destinadas</li>
                                <li>• Alertas em tempo real</li>
                                <li>• Manifestação do destinatário</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
