export const dynamic = 'force-dynamic';
import AdminGuard from '../../components/Auth/AdminGuard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Alert, { AlertDescription } from '../../components/ui/Alert';

export default function AdminFinance() {
    return (
        <AdminGuard>
            <DashboardLayout title="Financeiro & Assinaturas" type="admin">
                <h1 className="text-3xl font-bold mb-6">Financeiro & Assinaturas</h1>

                <Card className="p-10">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-warning/10 mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">🚧</span>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Em Desenvolvimento</h2>
                        <p className="text-muted-foreground mb-6">
                            Integração com gateway de pagamento (Stripe/Asaas) será implementada na próxima fase.
                        </p>

                        <Alert variant="info" className="max-w-md mx-auto">
                            <AlertDescription>
                                Esta funcionalidade incluirá: gestão de assinaturas, relatórios financeiros, faturas e integração com gateways de pagamento.
                            </AlertDescription>
                        </Alert>
                    </div>
                </Card>
            </DashboardLayout>
        </AdminGuard>
    );
}
