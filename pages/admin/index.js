import AdminGuard from '../../components/Auth/AdminGuard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Alert, { AlertTitle, AlertDescription } from '../../components/ui/Alert';
import { useState, useEffect } from 'react';
import {
    Users, DollarSign, AlertTriangle, Activity,
    CheckCircle, XCircle, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AdminGuard>
                <DashboardLayout title="Admin Dashboard" type="admin">
                    <div className="flex justify-center p-20">Carregando painel...</div>
                </DashboardLayout>
            </AdminGuard>
        );
    }

    const { stats, recentReports } = data || { stats: {}, recentReports: [] };

    return (
        <AdminGuard>
            <DashboardLayout title="Admin Dashboard" type="admin">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
                        <p className="text-muted-foreground">Visão geral da performance do sistema</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/finance" passHref legacyBehavior>
                            <Button variant="outline">Financeiro</Button>
                        </Link>
                        <Link href="/admin/reports" passHref legacyBehavior>
                            <Button variant="danger">Bugs & Reports</Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="p-6 border-l-4 border-l-accent">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase">Usuários Totais</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.totalUsers || 0}</h3>
                            </div>
                            <div className="p-2 bg-accent/10 text-accent rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-success">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase">Assinantes PRO</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.activeSubs || 0}</h3>
                            </div>
                            <div className="p-2 bg-success/10 text-success rounded-lg">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-secondary">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase">MRR Estimada</p>
                                <h3 className="text-3xl font-bold mt-1">R$ {stats.mrr?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</h3>
                            </div>
                            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-danger">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase">Reports Abertos</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.openReports || 0}</h3>
                            </div>
                            <div className="p-2 bg-danger/10 text-danger rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Reports / Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-danger" />
                                Últimos Reports/Bugs
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Assunto</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Data</th>
                                            <th className="px-4 py-3">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recentReports && recentReports.length > 0 ? (
                                            recentReports.map(report => (
                                                <tr key={report.id} className="hover:bg-muted/50">
                                                    <td className="px-4 py-3">#{report.id}</td>
                                                    <td className="px-4 py-3 font-medium">{report.title}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold 
                                                            ${report.status === 'open' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                                                            {report.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{new Date(report.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3">
                                                        <button className="text-primary hover:underline">Ver</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                                                    Nenhum report encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full gradient-brand p-6">
                            <h3 className="text-xl font-bold mb-4 text-white">Ações Rápidas</h3>
                            <div className="space-y-3">
                                <Link href="/admin/users">
                                    <button className="w-full text-left p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all flex items-center gap-3 text-white">
                                        <div className="bg-white/30 p-2 rounded-full"><Users className="w-4 h-4" /></div>
                                        <span>Gerenciar Usuários</span>
                                    </button>
                                </Link>
                                <Link href="/admin/plans">
                                    <button className="w-full text-left p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all flex items-center gap-3 text-white">
                                        <div className="bg-white/30 p-2 rounded-full"><DollarSign className="w-4 h-4" /></div>
                                        <span>Configurar Planos</span>
                                    </button>
                                </Link>
                                <button className="w-full text-left p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all flex items-center gap-3 text-white">
                                    <div className="bg-white/30 p-2 rounded-full"><Eye className="w-4 h-4" /></div>
                                    <span>Logs do Sistema</span>
                                </button>
                            </div>

                            <div className="mt-8">
                                <Alert variant="info" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                                    <AlertTitle>Status do Sistema</AlertTitle>
                                    <AlertDescription>
                                        Versão: 2.0.0 (Social Release)<br />
                                        Database: SQLite (Dev)<br />
                                        Uptime: 99.9%
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </AdminGuard>
    );
}
