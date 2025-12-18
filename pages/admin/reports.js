export const dynamic = 'force-dynamic';
import AdminGuard from '../../components/Auth/AdminGuard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        fetch('/api/admin/reports')
            .then(res => res.json())
            .then(data => {
                setReports(data);
                setLoading(false);
            });
    };

    const updateStatus = async (id, newStatus) => {
        await fetch(`/api/admin/reports/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchReports();
    };

    return (
        <AdminGuard>
            <DashboardLayout title="Relatórios de Bugs" type="admin">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Relatórios de Bugs e Feedback</h1>
                </div>

                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Título/Descrição</th>
                                    <th className="px-4 py-3">Usuário</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-4 text-center">Carregando...</td></tr>
                                ) : reports.length === 0 ? (
                                    <tr><td colSpan="6" className="p-4 text-center text-muted-foreground">Nenhum report encontrado.</td></tr>
                                ) : (
                                    reports.map(report => (
                                        <tr key={report.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3 font-mono">#{report.id}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={report.type === 'bug' ? 'danger' : 'info'}>
                                                    {report.type.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 max-w-md">
                                                <div className="font-bold">{report.title}</div>
                                                <div className="text-muted-foreground truncate">{report.description}</div>
                                            </td>
                                            <td className="px-4 py-3">{report.user_name || 'Anônimo'}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={report.status === 'open' ? 'warning' : 'success'}>
                                                    {report.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                {report.status === 'open' && (
                                                    <Button
                                                        onClick={() => updateStatus(report.id, 'resolved')}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-success border-success hover:bg-success/10"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Resolver
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </DashboardLayout>
        </AdminGuard>
    );
}
