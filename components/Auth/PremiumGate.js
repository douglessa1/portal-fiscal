import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Card, FormButton } from '../ui/FormComponents';

export default function PremiumGate({ children, featureName = 'Recurso Premium', fallback }) {
    const { data: session } = useSession();
    const isPro = session?.user?.subscription_tier === 'pro' || session?.user?.subscription_tier === 'enterprise' || session?.user?.role === 'admin';

    if (isPro) {
        return children;
    }

    if (fallback) {
        return fallback;
    }

    return (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/10">
            <div className="text-center py-8">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{featureName}</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Este recurso é exclusivo para assinantes do plano <strong>PRO</strong>.
                    Desbloqueie acesso ilimitado a todas as ferramentas fiscais.
                </p>
                <Link href="/planos">
                    <FormButton className="mt-4 px-8">
                        Fazer Upgrade Agora
                    </FormButton>
                </Link>
            </div>
        </Card>
    );
}
