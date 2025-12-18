import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Layout/Sidebar';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../../components/ui/Form';
import Alert, { AlertDescription } from '../../../components/ui/Alert';
import RichTextEditor from '../../../components/Editor/RichTextEditor';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import AdminGuard from '../../../components/Auth/AdminGuard'; // Assuming we have this

export default function CriarNoticia() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        resumo: '',
        imagem_url: '',
        categoria: 'Geral',
        conteudo: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === 'titulo') {
                updates.slug = generateSlug(value);
            }
            return updates;
        });
    };

    const handleEditorChange = (html) => {
        setFormData(prev => ({ ...prev, conteudo: html }));
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.conteudo) {
            setStatus({ type: 'error', message: 'Título e Conteúdo são obrigatórios.' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: 'Notícia publicada com sucesso!' });
                setTimeout(() => router.push('/noticias'), 1500);
            } else {
                setStatus({ type: 'error', message: data.error || 'Erro ao salvar.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Erro de conexão.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Header />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 md:ml-64 p-6 lg:p-12 pt-[100px] w-full max-w-5xl mx-auto">

                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Nova Notícia</h1>
                        </div>

                        {status && (
                            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {status.message}
                            </div>
                        )}

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card title="Conteúdo">
                                    <div className="space-y-4">
                                        <FormInput
                                            label="Título da Matéria"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleChange}
                                            placeholder="Ex: Receita Federal anuncia novas regras..."
                                        />

                                        <RichTextEditor
                                            value={formData.conteudo}
                                            onChange={handleEditorChange}
                                            placeholder="Escreva sua notícia aqui..."
                                        />
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card title="Metadados">
                                    <div className="space-y-4">
                                        <FormInput
                                            label="Slug (URL)"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            helperText="Gerado automaticamente do título"
                                        />

                                        <FormSelect
                                            label="Categoria"
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                        >
                                            <option value="Geral">Geral</option>
                                            <option value="Destaque">Destaque</option>
                                            <option value="Simples Nacional">Simples Nacional</option>
                                            <option value="Reforma Tributária">Reforma Tributária</option>
                                            <option value="Legislação">Legislação</option>
                                        </FormSelect>

                                        <FormInput
                                            label="URL da Imagem de Capa"
                                            name="imagem_url"
                                            value={formData.imagem_url}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />

                                        <div className="bg-muted p-2 rounded-lg text-xs text-muted-foreground">
                                            Recomendado: 1200x630px
                                        </div>

                                        <div className="pt-4">
                                            <label className="text-sm font-bold block mb-2">Resumo (SEO)</label>
                                            <textarea
                                                className="w-full flex h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                name="resumo"
                                                value={formData.resumo}
                                                onChange={handleChange}
                                                maxLength={160}
                                                placeholder="Breve descrição para o Google..."
                                            />
                                        </div>

                                        <FormButton onClick={handleSubmit} disabled={loading} className="w-full h-12 text-lg flex items-center justify-center gap-2">
                                            {loading ? 'Publicando...' : <><Save className="w-5 h-5" /> Publicar Notícia</>}
                                        </FormButton>
                                    </div>
                                </Card>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
