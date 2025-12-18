import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import StandaloneLayout from '../../components/Layout/StandaloneLayout';
import Card from '../../components/ui/Card';
import { FormGroup, Label, Input } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import Alert, { AlertDescription } from '../../components/ui/Alert';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { callbackUrl } = router.query;

    const [toolName, setToolName] = useState('');

    // Efeito para extrair nome da ferramenta do callbackUrl (ex: /ferramentas/difal -> DIFAL)
    useEffect(() => {
        if (callbackUrl && typeof callbackUrl === 'string') {
            const match = callbackUrl.split('/').pop();
            if (match) {
                setToolName(match.charAt(0).toUpperCase() + match.slice(1).replace('-', ' '));
            }
        }
    }, [callbackUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Erro ao criar conta');
            }

            // Success - redirect to login, preserving callbackUrl
            const loginUrl = `/auth/login?registered=true${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`;
            router.push(loginUrl);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <StandaloneLayout title="Criar Conta" description="Junte-se à comunidade do Portal Fiscal">
            <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl gradient-brand shadow-lg">
                            PF
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
                        <p className="text-muted-foreground mt-2">
                            {toolName ? `Para acessar o ${toolName}, crie sua conta gratuita.` : 'Junte-se à comunidade do Portal Fiscal'}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="danger" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup>
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Seu nome"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </FormGroup>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Já tem uma conta?{' '}
                            <Link
                                href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                                className="text-primary font-semibold hover:underline"
                            >
                                Fazer Login
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </StandaloneLayout>
    );
}
