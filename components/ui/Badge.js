import React from 'react';

const badgeVariants = {
    free: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    pro: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    auditor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

export function Badge({ children, variant = 'default', className = '' }) {
    const variantClass = badgeVariants[variant.toLowerCase()] || badgeVariants.default;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${variantClass} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;
