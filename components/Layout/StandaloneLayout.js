import React from 'react';
import Head from 'next/head';

/**
 * StandaloneLayout - For pages without Header/Footer
 * Used for: Auth pages, special landing pages
 */
export function StandaloneLayout({
    children,
    title,
    description,
    centered = true,
    className = ''
}) {
    return (
        <div className={`min-h-screen bg-background ${className}`}>
            <Head>
                <title>{title ? `${title} - Portal Fiscal` : 'Portal Fiscal'}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            <main className={centered ? 'min-h-screen flex items-center justify-center p-4' : 'min-h-screen'}>
                {children}
            </main>
        </div>
    );
}

export default StandaloneLayout;
