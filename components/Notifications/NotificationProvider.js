import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    addNotification: () => { },
    markAsRead: () => { },
    markAllAsRead: () => { },
    removeNotification: () => { },
    clearAll: () => { }
});

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    FISCAL: 'fiscal',
    SYSTEM: 'system'
};

/**
 * Notification Provider - Manages notifications throughout the app
 */
export function NotificationProvider({ children }) {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        if (session?.user?.email) {
            const stored = localStorage.getItem(`notifications_${session.user.email}`);
            if (stored) {
                try {
                    setNotifications(JSON.parse(stored));
                } catch (e) {
                    console.error('Error parsing notifications:', e);
                }
            }

            // Generate fiscal alerts on login
            generateFiscalAlerts();
        }
    }, [session?.user?.email]);

    // Save to localStorage when notifications change
    useEffect(() => {
        if (session?.user?.email && notifications.length > 0) {
            localStorage.setItem(`notifications_${session.user.email}`, JSON.stringify(notifications));
        }
    }, [notifications, session?.user?.email]);

    // Generate fiscal alerts based on upcoming obligations
    const generateFiscalAlerts = () => {
        const today = new Date();
        const day = today.getDate();

        // Check if it's close to common due dates
        const alerts = [];

        if (day >= 15 && day <= 20) {
            alerts.push({
                id: `das_${today.getMonth()}_${today.getFullYear()}`,
                type: NOTIFICATION_TYPES.FISCAL,
                title: 'Vencimento DAS próximo',
                message: 'O DAS do Simples Nacional vence no dia 20.',
                createdAt: new Date().toISOString(),
                read: false
            });
        }

        if (day >= 20 && day <= 25) {
            alerts.push({
                id: `efd_${today.getMonth()}_${today.getFullYear()}`,
                type: NOTIFICATION_TYPES.FISCAL,
                title: 'Prazo EFD ICMS/IPI',
                message: 'Entrega da EFD ICMS/IPI até o dia 25.',
                createdAt: new Date().toISOString(),
                read: false
            });
        }

        // Add only new alerts
        alerts.forEach(alert => {
            if (!notifications.find(n => n.id === alert.id)) {
                addNotification(alert);
            }
        });
    };

    const addNotification = (notification) => {
        const newNotification = {
            id: notification.id || `notif_${Date.now()}`,
            type: notification.type || NOTIFICATION_TYPES.INFO,
            title: notification.title,
            message: notification.message,
            createdAt: notification.createdAt || new Date().toISOString(),
            read: notification.read || false,
            link: notification.link || null
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
        if (session?.user?.email) {
            localStorage.removeItem(`notifications_${session.user.email}`);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

/**
 * Hook to use notifications
 */
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

/**
 * Notification helper - create toast notification
 */
export function createNotification(type, title, message, link = null) {
    return {
        type,
        title,
        message,
        link
    };
}
