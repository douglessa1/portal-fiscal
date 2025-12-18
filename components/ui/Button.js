import { forwardRef } from 'react';

/**
 * Button - Compact, refined button (h-9)
 * Variants: primary, secondary, destructive, ghost, outline
 */
const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    disabled = false,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-muted text-foreground',
        outline: 'border border-input bg-background hover:bg-muted text-foreground'
    };

    const sizes = {
        sm: 'h-7 px-2.5 text-xs gap-1',
        default: 'h-9 px-4 text-sm gap-2',
        lg: 'h-10 px-5 text-base gap-2'
    };

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
