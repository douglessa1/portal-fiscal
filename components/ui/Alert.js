import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const alertVariants = {
    info: {
        container: 'bg-info/10 border-info/20 text-info',
        icon: Info,
    },
    success: {
        container: 'bg-success/10 border-success/20 text-success',
        icon: CheckCircle2,
    },
    warning: {
        container: 'bg-warning/10 border-warning/20 text-warning',
        icon: AlertTriangle,
    },
    danger: {
        container: 'bg-danger/10 border-danger/20 text-danger',
        icon: XCircle,
    },
};

export function Alert({ variant = 'info', children, className = '' }) {
    const config = alertVariants[variant] || alertVariants.info;
    const Icon = config.icon;

    return (
        <div className={`flex gap-3 p-4 rounded-lg border ${config.container} ${className}`}>
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

export function AlertTitle({ children, className = '' }) {
    return (
        <h5 className={`font-semibold mb-1 ${className}`}>
            {children}
        </h5>
    );
}

export function AlertDescription({ children, className = '' }) {
    return (
        <div className={`text-sm opacity-90 ${className}`}>
            {children}
        </div>
    );
}

// Alias para compatibilidade
export { Alert as InfoBox };

export default Alert;
