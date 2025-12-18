import Header from '../components/Header';
import Sidebar from '../components/Layout/Sidebar';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../components/ui/Form';
import Alert, { AlertDescription } from '../components/ui/Alert';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Notifications() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) fetchNotifications();
    }, [session]);

    const fetchNotifications = () => {
        fetch('/api/notifications')
            .then(res => res.json())
            .then(data => {
                setNotifications(data);
                setLoading(false);
                // Auto mark as read after viewing
                fetch('/api/notifications', { method: 'PUT' });
            });
    };

    if (!session) return null; // Or redirect

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-6 lg:p-12 pt-[100px] w-full max-w-5xl mx-auto">

                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary" />
                            Notificações
                        </h1>
                    </div>

                    <Card>
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Tudo limpo por aqui!</p>
                                <p className="text-sm">Você não tem novas notificações.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 flex gap-4 ${notif.is_read ? 'opacity-70' : 'bg-primary/5'}`}>
                                        <div className="mt-1">
                                            {notif.type === 'follow' ? (
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                                    <Bell className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm mb-1">{notif.title}</h4>
                                            <p className="text-muted-foreground text-sm">{notif.message}</p>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                {new Date(notif.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        {notif.type === 'follow' && notif.reference_id && (
                                            <Link href={`/perfil/${notif.reference_id}`}>
                                                <button className="self-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition">
                                                    Ver Perfil
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                </main>
            </div>
        </div>
    );
}
