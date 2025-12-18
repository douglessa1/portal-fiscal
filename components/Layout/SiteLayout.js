import Head from 'next/head';
import Navbar from './Navbar';
import Footer from '../Footer';

export default function SiteLayout({ children, title = 'Portal Fiscal' }) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Head>
                <title>{title}</title>
            </Head>

            <Navbar />

            <main className="flex-grow pt-[70px]">
                {children}
            </main>

            <Footer />
        </div>
    );
}
