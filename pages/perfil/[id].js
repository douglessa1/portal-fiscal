import Header from '../../components/Header';
import Sidebar from '../../components/Layout/Sidebar';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { User, Settings, CreditCard, MessageSquare, ShieldCheck, Mail, Calendar, Edit2, LogOut, CheckCircle, Crown } from 'lucide-react';
import PremiumGate from '../../components/Auth/PremiumGate'; // Re-use for badge logic maybe

export default function UserProfile() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const { id } = router.query;

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // User Data (Mock initial, then API)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: 'user',
        subscription_tier: 'free',
        joined_at: '2023-10-15',
        bio: 'Contador entusiasta e especialista em Simples Nacional.',
        posts_count: 12,
        reputation: 450,
        age: 32,
        profession: 'Contador Sênior',
        photo: null // URL if exists
    });

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        age: '',
        profession: ''
    });

    const isOwner = session?.user?.id == id;

    useEffect(() => {
        if (id) {
            // In a real app, fetch /api/users/[id]
            // For now, we simulate fetching, or use session if owner
            if (isOwner && session) {
                setUserData({
                    ...userData,
                    name: session.user.name,
                    email: session.user.email,
                    role: session.user.role,
                    subscription_tier: session.user.subscription_tier || 'free'
                });
                setEditForm({
                    name: session.user.name,
                    bio: 'Contador entusiasta e especialista em Simples Nacional.', // Mock bio
                    age: '32',
                    profession: 'Contador Sênior'
                });
                setLoading(false);
            } else {
                // Fetch public profile mock
                setUserData(prev => ({ ...prev, name: 'Usuário da Comunidade', email: 'hidden' }));
                setLoading(false);
            }
        }
    }, [id, session, isOwner]);

    const handleSaveProfile = async () => {
        setSaving(true);
        // Simulate API call to update user
        setTimeout(async () => {
            // Mock Update
            // await fetch('/api/user/update', ...)
            await updateSession({
                ...session,
                user: { ...session.user, name: editForm.name }
            });
            setUserData(prev => ({
                ...prev,
                name: editForm.name,
                bio: editForm.bio,
                age: editForm.age,
                profession: editForm.profession
            }));
            setSaving(false);
            alert('Perfil atualizado com sucesso!');
        }, 1000);
    };

    const handlePhotoUpload = () => {
        // Mock photo upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // In real app: Upload to S3/Storage and get URL
                const mockUrl = URL.createObjectURL(file);
                setUserData(prev => ({ ...prev, photo: mockUrl }));
                alert('Foto de perfil atualizada!');
            }
        };
        input.click();
    };

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-6 lg:p-12 pt-[100px] w-full max-w-5xl mx-auto">

                    {/* Header Card */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
                        <div className="h-32 bg-gradient-to-r from-primary/80 to-blue-600/80"></div>
                        <div className="px-8 pb-8 relative">
                            <div className="flex flex-col md:flex-row items-end -mt-12 mb-4 gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-background p-1 shadow-lg ring-2 ring-background z-10 overflow-hidden">
                                        {userData.photo ? (
                                            <img src={userData.photo} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-3xl font-bold text-muted-foreground uppercase">
                                                {userData.name?.[0] || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    {isOwner && (
                                        <button
                                            onClick={handlePhotoUpload}
                                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                                            title="Alterar foto"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 mb-2">
                                    <h1 className="text-3xl font-bold flex items-center gap-3">
                                        {userData.name}
                                        {userData.subscription_tier === 'pro' && (
                                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                                                <Crown className="w-3 h-3" /> PRO
                                            </span>
                                        )}
                                        {userData.role === 'admin' && (
                                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full border border-red-200 flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> ADMIN
                                            </span>
                                        )}
                                    </h1>
                                    <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
                                        <span>{userData.profession || 'Membro da Comunidade'}</span>
                                        {userData.age && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                                <span>{userData.age} anos</span>
                                            </>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                        <span>{userData.email}</span>
                                    </div>
                                </div>
                                {isOwner && (
                                    <div className="flex gap-2 self-end mb-1">
                                        <FormButton variant="outline" className="h-10 px-4 text-sm whitespace-nowrap bg-background hover:bg-muted" onClick={() => setActiveTab('settings')}>
                                            <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
                                        </FormButton>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex gap-6 border-b border-border">
                                {['overview', 'plan', 'posts', 'settings'].map(tab => {
                                    if (!isOwner && (tab === 'settings' || tab === 'plan')) return null;
                                    const labels = { overview: 'Visão Geral', plan: 'Meu Plano', posts: 'Minha Atividade', settings: 'Configurações' };
                                    const icons = { overview: User, plan: CreditCard, posts: MessageSquare, settings: Settings };
                                    const Icon = icons[tab];
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" /> {labels[tab]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card title="Sobre Mim">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {userData.bio || 'Nenhuma biografia informada.'}
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground/80">
                                        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            Membro desde {new Date(userData.joined_at).getFullYear()}
                                        </div>
                                        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                            {userData.posts_count} publicações
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Estatísticas de Uso">
                                    {isOwner ? (
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Consultas Monitor NFe</span>
                                                    <span className="font-bold">24 / 50</span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-[48%]"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Armazenamento XML</span>
                                                    <span className="font-bold">120MB / 1GB</span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 w-[12%]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Informações privadas.</p>
                                    )}
                                </Card>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {isOwner && activeTab === 'settings' && (
                            <div className="max-w-2xl">
                                <Card title="Dados Pessoais">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                label="Nome Completo"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <FormInput
                                                label="Profissão / Cargo"
                                                placeholder="Ex: Contador, Advogado..."
                                                value={editForm.profession}
                                                onChange={e => setEditForm({ ...editForm, profession: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                label="Idade"
                                                type="number"
                                                placeholder="Ex: 30"
                                                value={editForm.age}
                                                onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Biografia</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                                                value={editForm.bio}
                                                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Breve descrição que aparecerá no seu perfil da comunidade.</p>
                                        </div>
                                        <FormButton onClick={handleSaveProfile} disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </FormButton>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* PLAN TAB */}
                        {isOwner && activeTab === 'plan' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-primary/20 bg-primary/5">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                        <Crown className="w-5 h-5 text-amber-500" /> Seu Plano Atual
                                    </h3>
                                    <div className="text-3xl font-bold mb-1 uppercase text-primary">
                                        {userData.subscription_tier}
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        Renova em 15/01/2026.
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Acesso ilimitado às ferramentas
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Monitor NFe Completo
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Suporte Prioritário
                                        </div>
                                    </div>

                                    <FormButton variant="outline" className="w-full">Gerenciar Assinatura</FormButton>
                                </Card>
                            </div>
                        )}

                        {/* POSTS TAB */}
                        {activeTab === 'posts' && (
                            <div className="space-y-4">
                                <InfoBox title="Histórico de Atividade">
                                    Aqui estão as últimas interações na comunidade.
                                </InfoBox>
                                {/* Mock Posts List */}
                                {[1, 2].map(i => (
                                    <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                                        <h4 className="font-bold text-lg mb-2">Dúvida sobre DIFAL no RS para não contribuinte</h4>
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            Estou com uma nota rejeitada referente ao cálculo do DIFAL partilha...
                                        </p>
                                        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                                            <span>Há 2 dias</span>
                                            <span>5 Respostas</span>
                                            <span>ICMS</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                    </div>

                </main>
            </div>
        </div>
    );
}
