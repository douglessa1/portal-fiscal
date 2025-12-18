import React from 'react';

export function Card({ children, className = '', title, ...props }) {
    if (title) {
        return (
            <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`} {...props}>
                <div className="border-b border-border px-6 py-4">
                    <h3 className="font-bold text-foreground">{title}</h3>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-card border border-border rounded-xl p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`border-b border-border px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`border-t border-border px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export default Card;
