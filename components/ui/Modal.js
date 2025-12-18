import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ show, onClose, children, size = 'md' }) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [show, onClose]);

    if (!show) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-card rounded-xl shadow-2xl w-full ${sizeClasses[size]} animate-in zoom-in-95 fade-in duration-200`}>
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ children, onClose }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex-1">
                {children}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>
            )}
        </div>
    );
}

export function ModalContent({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function ModalFooter({ children, className = '' }) {
    return (
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-border ${className}`}>
            {children}
        </div>
    );
}

export default Modal;
