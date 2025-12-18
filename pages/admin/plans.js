import AdminGuard from '../../components/Auth/AdminGuard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', price: '', interval: 'monthly', features: '', active: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = () => {
        fetch('/api/admin/plans')
            .then(res => res.json())
            .then(data => {
                setPlans(data);
                setLoading(false);
            });
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            slug: plan.slug,
            price: plan.price,
            interval: plan.interval,
            features: plan.features.join('\n'),
            active: plan.active === 1 || plan.active === true
        });
    };

    const handleCancel = () => {
        setEditingPlan(null);
        setFormData({ name: '', slug: '', price: '', interval: 'monthly', features: '', active: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            features: formData.features.split('\n').filter(f => f.trim() !== '')
        };

        const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : '/api/admin/plans';
        const method = editingPlan ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            fetchPlans();
            handleCancel();
        } else {
            alert('Erro ao salvar plano');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Deletar plano?')) return;
        await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
        fetchPlans();
    };

    return (
        <AdminGuard>
            <DashboardLayout title="Configurar Planos" type="admin">
                <h1 className="text-3xl font-bold mb-6">Configurar Planos</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                {editingPlan ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormGroup>
                                    <Label htmlFor="name">Nome do Plano</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Ex: Profissional"
                                    />
                                </FormGroup>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormGroup>
                                        <Label htmlFor="slug">Slug (ID)</Label>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                            placeholder="Ex: pro"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="price">Preço (R$)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            placeholder="29.90"
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup>
                                    <Label htmlFor="interval">Intervalo</Label>
                                    <select
                                        id="interval"
                                        className="w-full h-10 px-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.interval}
                                        onChange={e => setFormData({ ...formData, interval: e.target.value })}
                                    >
                                        <option value="monthly">Mensal</option>
                                        <option value="yearly">Anual</option>
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="features">Features (uma por linha)</Label>
                                    <Textarea
                                        id="features"
                                        rows={4}
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        placeholder="Cálculos ilimitados&#10;Suporte Prioritário"
                                    />
                                </FormGroup>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        id="activeCheck"
                                        className="w-4 h-4 rounded border-input"
                                    />
                                    <label htmlFor="activeCheck" className="text-sm">Plano Ativo</label>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" variant="primary" className="flex-1">
                                        {editingPlan ? "Atualizar" : "Criar Plano"}
                                    </Button>
                                    {editingPlan && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleCancel}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Plans List */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">Planos Cadastrados</h3>
                            <div className="space-y-4">
                                {loading ? <p>Carregando...</p> : plans.map(plan => (
                                    <div key={plan.id} className="border border-border rounded-lg p-4 flex justify-between items-center group hover:bg-muted/30 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg">{plan.name}</h4>
                                                {!plan.active && <Badge variant="danger">Inativo</Badge>}
                                                {plan.slug === 'pro' && <Badge variant="pro">Popular</Badge>}
                                            </div>
                                            <div className="text-2xl font-bold text-primary my-1">
                                                R$ {Number(plan.price).toFixed(2)}
                                                <span className="text-sm text-muted-foreground font-normal">/{plan.interval === 'monthly' ? 'mês' : 'ano'}</span>
                                            </div>
                                            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                                                {plan.features.slice(0, 2).map((f, i) => <li key={i}>{f}</li>)}
                                                {plan.features.length > 2 && <li>+{plan.features.length - 2} recursos...</li>}
                                            </ul>
                                        </div>
                                        <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="p-2 text-danger hover:bg-danger/10 rounded transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </AdminGuard>
    );
}
