import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Layout/Navbar';
import { usePlan } from '../components/Permissions/PlanProvider';
import { Check, X, Star, Shield, Zap, ArrowRight } from 'lucide-react';

const PLANS = [
    {
        id: 'free',
        name: 'FREE',
        price: 0,
        period: 'grátis para sempre',
        description: 'Para quem está começando',
        features: [
            { name: 'Calculadoras básicas', included: true },
            { name: 'DIFAL, ICMS-ST, PIS/COFINS', included: true },
            { name: 'Consulta CFOP e NCM', included: true },
            { name: 'Calendário fiscal', included: true },
            { name: 'Comunidade', included: true },
            { name: 'Memória de cálculo', included: false },
            { name: 'Histórico ilimitado', included: false },
            { name: 'Export PDF/Excel', included: false },
            { name: 'BI Fiscal', included: false },
            { name: 'Auditor SPED', included: false },
            { name: 'API pública', included: false },
            { name: 'Compartilhamento', included: false }
        ],
        color: 'gray',
        popular: false
    },
    {
        id: 'pro',
        name: 'PRO',
        price: 49.90,
        period: '/mês',
        description: 'Para profissionais contábeis',
        features: [
            { name: 'Tudo do FREE', included: true },
            { name: 'Memória de cálculo', included: true },
            { name: 'Histórico ilimitado', included: true },
            { name: 'Export PDF técnico', included: true },
            { name: 'Export Excel/CSV', included: true },
            { name: 'BI Fiscal (dashboards)', included: true },
            { name: 'Reforma Tributária', included: true },
            { name: 'Suporte prioritário', included: true },
            { name: 'Auditor SPED', included: false },
            { name: 'API pública', included: false },
            { name: 'Compartilhamento', included: false },
            { name: 'Multi-usuário', included: false }
        ],
        color: 'purple',
        popular: true
    },
    {
        id: 'auditor',
        name: 'AUDITOR',
        price: 149.90,
        period: '/mês',
        description: 'Para escritórios e empresas',
        features: [
            { name: 'Tudo do PRO', included: true },
            { name: 'Auditor SPED completo', included: true },
            { name: 'Validador SPED', included: true },
            { name: 'Monitor NF-e', included: true },
            { name: 'Links compartilháveis', included: true },
            { name: 'API pública (10k req/mês)', included: true },
            { name: 'Webhooks', included: true },
            { name: 'Multi-usuário (5 seats)', included: true },
            { name: 'Dashboard consolidado', included: true },
            { name: 'Suporte dedicado', included: true },
            { name: 'Onboarding guiado', included: true },
            { name: 'SLA 99.9%', included: true }
        ],
        color: 'amber',
        popular: false
    }
];

export default function PlanosPage() {
    const { data: session } = useSession();
    const { plan: currentPlan } = usePlan();
    const [loading, setLoading] = useState('');
    const [annual, setAnnual] = useState(false);

    const handleSubscribe = async (planId) => {
        if (!session) {
            // Redirect to login
            window.location.href = '/login?redirect=/planos';
            return;
        }

        setLoading(planId);

        // Simulate Stripe checkout
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock: show success modal
        alert(`Assinatura do plano ${planId.toUpperCase()} iniciada! (Integração Stripe pendente)`);
        setLoading('');
    };

    const getPrice = (price) => {
        if (price === 0) return 'R$ 0';
        if (annual) {
            const annualPrice = price * 10; // 2 months free
            return `R$ ${annualPrice.toFixed(2).replace('.', ',')}`;
        }
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    };

    return (
        <>
            <Head>
                <title>Planos e Preços - Portal Fiscal</title>
            </Head>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-[70px]">
                    {/* Hero */}
                    <div className="text-center py-16 px-6">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Escolha o plano ideal para você
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Comece grátis e faça upgrade quando precisar. Sem surpresas, cancele quando quiser.
                        </p>

                        {/* Annual Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm ${!annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                Mensal
                            </span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors ${annual ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : ''}`} />
                            </button>
                            <span className={`text-sm ${annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                Anual <span className="text-green-600 font-semibold">-17%</span>
                            </span>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="max-w-6xl mx-auto px-6 pb-16">
                        <div className="grid grid-cols-3 gap-6">
                            {PLANS.map((plan) => (
                                <div key={plan.id} className={`relative bg-card border rounded-2xl overflow-hidden ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'
                                    }`}>
                                    {plan.popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium">
                                            ⭐ Mais Popular
                                        </div>
                                    )}

                                    <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                                        {/* Plan Header */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {plan.id === 'auditor' && <Shield className="w-5 h-5 text-amber-500" />}
                                            {plan.id === 'pro' && <Star className="w-5 h-5 text-purple-500" />}
                                            {plan.id === 'free' && <Zap className="w-5 h-5 text-gray-500" />}
                                            <span className="text-lg font-bold text-foreground">{plan.name}</span>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-foreground">{getPrice(plan.price)}</span>
                                            <span className="text-muted-foreground">{plan.price > 0 ? (annual ? '/ano' : plan.period) : ''}</span>
                                            {annual && plan.price > 0 && (
                                                <div className="text-xs text-green-600 mt-1">Economia de R$ {(plan.price * 2).toFixed(2).replace('.', ',')}</div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSubscribe(plan.id)}
                                            disabled={loading === plan.id || currentPlan === plan.id}
                                            className={`w-full h-11 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${currentPlan === plan.id
                                                    ? 'bg-muted text-muted-foreground cursor-default'
                                                    : plan.popular
                                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                        : 'border border-input hover:bg-muted'
                                                }`}
                                        >
                                            {loading === plan.id ? (
                                                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                            ) : currentPlan === plan.id ? (
                                                'Plano Atual'
                                            ) : (
                                                <>
                                                    {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Features */}
                                    <div className="border-t border-border p-6">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm">
                                                    {feature.included ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-muted-foreground/30" />
                                                    )}
                                                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                                                        {feature.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-16 max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Perguntas Frequentes</h2>
                            <div className="space-y-4">
                                {[
                                    { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem multa ou taxa extra.' },
                                    { q: 'Como funciona o período de teste?', a: 'O plano FREE é gratuito para sempre. Para PRO e AUDITOR, oferecemos 7 dias de teste grátis.' },
                                    { q: 'Posso trocar de plano depois?', a: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor é calculado proporcionalmente.' },
                                    { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartão de crédito, PIX e boleto bancário via Stripe.' }
                                ].map((faq, idx) => (
                                    <details key={idx} className="group bg-card border border-border rounded-xl overflow-hidden">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground">
                                            {faq.q}
                                            <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                                        </summary>
                                        <div className="px-4 pb-4 text-sm text-muted-foreground">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
