import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calculator, Building2, MapPin, Rocket, ArrowRight, Check } from 'lucide-react';

const REGIMES = [
    { value: 'mei', label: 'MEI', description: 'Microempreendedor Individual' },
    { value: 'simples', label: 'Simples Nacional', description: 'Micro e pequenas empresas' },
    { value: 'presumido', label: 'Lucro Presumido', description: 'Tributação simplificada' },
    { value: 'real', label: 'Lucro Real', description: 'Apuração completa' }
];

const ESTADOS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
];

export function Onboarding({ onComplete }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState({
        regime: '',
        estado: '',
        atividade: ''
    });

    const steps = [
        { title: 'Boas-vindas', icon: Rocket },
        { title: 'Regime Tributário', icon: Building2 },
        { title: 'Localização', icon: MapPin },
        { title: 'Pronto!', icon: Check }
    ];

    const handleComplete = () => {
        // Save preferences
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
        localStorage.setItem('onboarding_complete', 'true');
        onComplete?.(preferences);
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                {/* Progress */}
                <div className="bg-muted/30 px-6 py-3 border-b border-border">
                    <div className="flex items-center justify-between">
                        {steps.map((s, idx) => (
                            <div key={idx} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${idx < step ? 'bg-green-500 text-white' :
                                        idx === step ? 'bg-primary text-primary-foreground' :
                                            'bg-muted text-muted-foreground'
                                    }`}>
                                    {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-1 ${idx < step ? 'bg-green-500' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 0 && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Rocket className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Bem-vindo ao Portal Fiscal!
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Olá, <strong>{session?.user?.name?.split(' ')[0] || 'Usuário'}</strong>! Vamos configurar
                                sua experiência para que você tenha acesso às ferramentas certas.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <Calculator className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-xs text-muted-foreground">17+ Calculadoras</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <Building2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                    <div className="text-xs text-muted-foreground">Todos os Regimes</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <MapPin className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                                    <div className="text-xs text-muted-foreground">27 Estados</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Qual seu regime tributário?</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Isso nos ajuda a personalizar as ferramentas e alertas para você.
                            </p>
                            <div className="space-y-3">
                                {REGIMES.map(regime => (
                                    <button key={regime.value}
                                        onClick={() => setPreferences(p => ({ ...p, regime: regime.value }))}
                                        className={`w-full p-4 rounded-xl border text-left transition-all ${preferences.regime === regime.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-foreground">{regime.label}</div>
                                                <div className="text-xs text-muted-foreground">{regime.description}</div>
                                            </div>
                                            {preferences.regime === regime.value && (
                                                <Check className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Qual seu estado?</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Cada estado tem alíquotas e obrigações diferentes.
                            </p>
                            <select
                                value={preferences.estado}
                                onChange={(e) => setPreferences(p => ({ ...p, estado: e.target.value }))}
                                className="w-full h-12 px-4 text-base rounded-xl border border-input bg-background mb-4"
                            >
                                <option value="">Selecione seu estado</option>
                                {ESTADOS.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>

                            <label className="block text-sm font-medium text-foreground mb-2">
                                Atividade principal (opcional)
                            </label>
                            <input
                                type="text"
                                value={preferences.atividade}
                                onChange={(e) => setPreferences(p => ({ ...p, atividade: e.target.value }))}
                                placeholder="Ex: Comércio, Serviços, Indústria..."
                                className="w-full h-12 px-4 text-base rounded-xl border border-input bg-background"
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Tudo pronto!</h2>
                            <p className="text-muted-foreground mb-6">
                                Suas preferências foram salvas. Você pode alterá-las a qualquer momento nas configurações.
                            </p>
                            <div className="p-4 bg-muted/50 rounded-xl text-sm text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Regime:</span>
                                    <span className="font-medium text-foreground">
                                        {REGIMES.find(r => r.value === preferences.regime)?.label || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Estado:</span>
                                    <span className="font-medium text-foreground">{preferences.estado || '-'}</span>
                                </div>
                                {preferences.atividade && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Atividade:</span>
                                        <span className="font-medium text-foreground">{preferences.atividade}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex items-center justify-between">
                    {step > 0 ? (
                        <button onClick={prevStep} className="text-sm text-muted-foreground hover:text-foreground">
                            Voltar
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={nextStep}
                        disabled={step === 1 && !preferences.regime}
                        className="h-11 px-6 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {step === steps.length - 1 ? 'Começar!' : 'Continuar'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const complete = localStorage.getItem('onboarding_complete');
            if (!complete) {
                setShowOnboarding(true);
            }
        }
    }, [session, status]);

    const completeOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('onboarding_complete', 'true');
    };

    return { showOnboarding, completeOnboarding };
}

export default Onboarding;
