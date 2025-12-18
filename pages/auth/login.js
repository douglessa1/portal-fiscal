import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import StandaloneLayout from '../../components/Layout/StandaloneLayout';
import Card from '../../components/ui/Card';
import { FormGroup, Label, Input } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import Alert, { AlertDescription } from '../../components/ui/Alert';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (router.query.registered) {
            setSuccess('Conta criada com sucesso! Faça login para continuar.');
        }
    }, [router.query]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res.error) {
            setError('Email ou senha inválidos.');
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    }

    return (
        <StandaloneLayout title="Login" description="Acesse sua conta no Portal Fiscal">
            <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl gradient-brand shadow-lg">
                            PF
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
                        <p className="text-muted-foreground mt-2">Acesse sua conta no Portal Fiscal</p>
                    </div>

                    {/* Success Alert */}
                    {success && (
                        <Alert variant="success" className="mb-6">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="danger" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Não tem conta?{' '}
                            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                                Crie uma grátis
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </StandaloneLayout>
    );
}
