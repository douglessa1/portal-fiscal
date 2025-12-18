import Navbar from '../components/Layout/Navbar';
import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function Subscribe() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/plans')
            .then(res => res.json())
            .then(data => {
                setPlans(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Escolha o plano ideal</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Potencialize sua gestão fiscal com ferramentas avançadas e cálculos automatizados.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {loading ? (
                        <p className="col-span-3 text-center">Carregando planos...</p>
                    ) : plans.map((plan) => (
                        <div key={plan.id} className={`relative p-8 rounded-2xl border ${plan.slug === 'pro'
                            ? 'border-primary shadow-lg bg-card scale-105 z-10'
                            : 'border-border bg-card/50 shadow-sm'
                            }`}>

                            {plan.slug === 'pro' && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                                    Recomendado
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">R$ {Number(plan.price).toFixed(2).replace('.', ',')}</span>
                                <span className="text-muted-foreground">/{plan.interval === 'monthly' ? 'mês' : 'ano'}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.slug === 'pro' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-lg font-bold transition-transform active:scale-95 ${plan.slug === 'pro' || plan.slug === 'enterprise'
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                                }`}>
                                {plan.price > 0 ? 'Assinar Agora' : 'Começar Grátis'}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
