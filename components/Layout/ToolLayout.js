import Head from 'next/head';
import Navbar from './Navbar';
import Footer from '../Footer';
import Badge from '../ui/Badge';

/**
 * ToolLayout - Standardized layout for tool pages
 * Uses new Header without Sidebar
 */
export default function ToolLayout({
    children,
    title,
    description,
    icon: Icon,
    badge = 'FREE'
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Head>
                <title>{title ? `${title} - Portal Fiscal` : 'Portal Fiscal'}</title>
                <meta name="description" content={description || 'Ferramentas fiscais profissionais'} />
            </Head>

            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                {title && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Icon className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                                {description && (
                                    <p className="text-muted-foreground mt-1">{description}</p>
                                )}
                            </div>
                        </div>
                        <Badge variant={badge.toLowerCase()}>{badge}</Badge>
                    </div>
                )}

                {children}
            </main>

            <Footer />
        </div>
    );
}
