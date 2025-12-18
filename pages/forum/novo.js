import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Label, FormGroup } from '../../components/ui/Form';
import { useSession } from 'next-auth/react';
import { ArrowLeft } from 'lucide-react';
import AuthGuard from '../../components/Auth/AuthGuard'; // Ensure strict protection

const CATEGORIES = ['ICMS', 'Federal', 'Simples Nacional', 'SPED', 'TI Fiscal', 'Carreira'];

function NovoTopico() {
    const router = useRouter();
    const { data: session } = useSession();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/forum/topics/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category, content })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/forum/${data.id}`); // Redirect to new topic (ID based)
            } else {
                const err = await res.json();
                alert('Erro: ' + err.error);
            }
        } catch (error) {
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head>
                <title>Criar Novo Tópico - Fórum Fiscal</title>
            </Head>

            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
                </Button>

                <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold mb-6">Criar Novo Tópico</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup>
                            <Label htmlFor="title">Título do Tópico</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Dúvida sobre Difal no estado de SP..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">Seja específico e claro.</p>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="category">Categoria</Label>
                            <select
                                id="category"
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma categoria...</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="content">Conteúdo</Label>
                            <div className="relative">
                                <textarea
                                    id="content"
                                    className="w-full min-h-[200px] p-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none font-sans"
                                    placeholder="Descreva sua dúvida ou contribuição técnica com detalhes..."
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                />
                            </div>
                        </FormGroup>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                                {loading ? 'Publicando...' : 'Publicar Tópico'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default NovoTopico;
