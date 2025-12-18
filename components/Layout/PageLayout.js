import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export function PageLayout({ children, className = '' }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export function PageHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`flex items-center justify-between mb-8 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function PageSection({ title, children, className = '' }) {
    return (
        <section className={`mb-12 ${className}`}>
            {title && <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>}
            {children}
        </section>
    );
}

export default PageLayout;
