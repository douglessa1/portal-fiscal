import AdminGuard from '../../components/Auth/AdminGuard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import { Trash2, Shield, User, Crown } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    };

    const deleteUser = async (id) => {
        if (!confirm('Tem certeza que deseja DELETAR este usuário? Essa ação não pode ser desfeita.')) return;

        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
    };

    const updateUser = async (id, role, plan) => {
        await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, plan })
        });
        fetchUsers();
    };

    return (
        <AdminGuard>
            <DashboardLayout title="Gerenciar Usuários" type="admin">
                <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>

                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Nome/Email</th>
                                    <th className="px-4 py-3">Papel (Role)</th>
                                    <th className="px-4 py-3">Plano</th>
                                    <th className="px-4 py-3">Criado em</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-4 text-center">Carregando...</td></tr>
                                ) : users.map(u => (
                                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-bold">{u.name}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => updateUser(u.id, u.role === 'admin' ? 'user' : 'admin', u.plan)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border transition-colors ${u.role === 'admin'
                                                    ? 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20'
                                                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                                    }`}
                                                title="Clique para alternar Admin/User"
                                            >
                                                {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                {u.role.toUpperCase()}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => updateUser(u.id, u.role, u.plan === 'pro' ? 'free' : 'pro')}
                                                title="Clique para alternar Plano"
                                            >
                                                <Badge variant={u.plan === 'pro' ? 'pro' : 'free'}>
                                                    {u.plan === 'pro' ? <Crown className="w-3 h-3 inline mr-1" /> : null}
                                                    {u.plan.toUpperCase()}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => deleteUser(u.id)}
                                                className="p-2 text-danger hover:bg-danger/10 rounded-full transition-colors"
                                                title="Excluir Usuário"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </DashboardLayout>
        </AdminGuard>
    );
}
