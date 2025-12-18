import React from 'react';

export function Label({ children, htmlFor, className = '', required = false }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-foreground mb-2 ${className}`}
        >
            {children}
            {required && <span className="text-destructive ml-1">*</span>}
        </label>
    );
}

export function Input({
    type = 'text',
    className = '',
    error = false,
    ...props
}) {
    return (
        <input
            type={type}
            className={`w-full h-10 px-4 text-sm rounded-lg border bg-background transition-colors
                ${error
                    ? 'border-destructive focus:ring-destructive/20'
                    : 'border-input focus:ring-primary/20 focus:border-primary'
                }
                focus:outline-none focus:ring-2
                placeholder:text-muted-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}`}
            {...props}
        />
    );
}

export function Select({ children, className = '', error = false, ...props }) {
    return (
        <select
            className={`w-full h-10 px-4 text-sm rounded-lg border bg-background transition-colors
                ${error
                    ? 'border-destructive focus:ring-destructive/20'
                    : 'border-input focus:ring-primary/20 focus:border-primary'
                }
                focus:outline-none focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function Textarea({ className = '', error = false, rows = 4, ...props }) {
    return (
        <textarea
            rows={rows}
            className={`w-full px-4 py-3 text-sm rounded-lg border bg-background transition-colors resize-none
                ${error
                    ? 'border-destructive focus:ring-destructive/20'
                    : 'border-input focus:ring-primary/20 focus:border-primary'
                }
                focus:outline-none focus:ring-2
                placeholder:text-muted-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}`}
            {...props}
        />
    );
}

export function ErrorMessage({ children, className = '' }) {
    if (!children) return null;

    return (
        <p className={`text-sm text-destructive mt-1 ${className}`}>
            {children}
        </p>
    );
}

export function FormInput({ label, error, required, className = '', ...props }) {
    return (
        <FormGroup className={className}>
            {label && <Label required={required}>{label}</Label>}
            <Input error={!!error} {...props} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
    );
}

export function FormSelect({ label, error, required, className = '', children, ...props }) {
    return (
        <FormGroup className={className}>
            {label && <Label required={required}>{label}</Label>}
            <Select error={!!error} {...props}>
                {children}
            </Select>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
    );
}

export function FormGroup({ children, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {children}
        </div>
    );
}

export default {
    Label,
    Input,
    Select,
    Textarea,
    ErrorMessage,
    FormGroup,
    FormInput,
    FormSelect
};
