import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Calendar, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { useNotifications, NOTIFICATION_TYPES } from './NotificationProvider';
import Link from 'next/link';

/**
 * Notification Panel - Dropdown panel showing all notifications
 */
export function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.WARNING:
            case NOTIFICATION_TYPES.ERROR:
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case NOTIFICATION_TYPES.FISCAL:
                return <Calendar className="w-4 h-4 text-blue-500" />;
            case NOTIFICATION_TYPES.SUCCESS:
                return <Check className="w-4 h-4 text-green-500" />;
            default:
                return <Info className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <h3 className="font-semibold text-foreground">Notificações</h3>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                                    title="Marcar todas como lidas"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="p-1.5 text-xs text-muted-foreground hover:text-red-500 hover:bg-muted rounded-lg"
                                    title="Limpar todas"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-primary/5' : ''
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className={`text-sm truncate ${!notification.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {notification.message}
                                        </p>
                                        {notification.link && (
                                            <Link href={notification.link} className="text-xs text-primary hover:underline mt-1 inline-block">
                                                Ver mais
                                            </Link>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notification.id);
                                        }}
                                        className="p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <Bell className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm">Nenhuma notificação</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-border bg-muted/30">
                            <Link
                                href="/configuracoes/notificacoes"
                                className="text-xs text-primary hover:underline"
                            >
                                Configurações de notificação
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationPanel;
