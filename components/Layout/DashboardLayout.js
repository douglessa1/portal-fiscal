import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from '../Footer';
import {
    LayoutDashboard, Wrench, Users, Newspaper, Settings,
    BarChart3, CreditCard, DollarSign, FileText, Bell
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Sidebar from './Sidebar';

export function DashboardLayout({
    children,
    title,
    description,
    type = 'user' // 'user' or 'admin'
}) {
    return (
        <div className="min-h-screen bg-background">
            <Head>
                <title>{title ? `${title} - Portal Fiscal` : 'Dashboard - Portal Fiscal'}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 ml-64 p-8 pt-24">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
