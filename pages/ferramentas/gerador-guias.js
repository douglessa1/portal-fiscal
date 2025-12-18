import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ToolLayout from '../../components/Layout/ToolLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';

export default function GeradorGuiasPage() {
    const router = useRouter();
    const { valor, vencimento, uf, codigo } = router.query;

    const [tipoGuia, setTipoGuia] = useState('DARF'); // DARF, GNRE, DAS
    const [formData, setFormData] = useState({
        razaoSocial: '',
        cnpj: '',
        codigoReceita: '',
        periodoApuracao: '',
        dataVencimento: '',
        valorPrincipal: '',
        multa: '',
        juros: '',
        ufFavorecida: ''
    });

    const [guiaGerada, setGuiaGerada] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            setFormData(prev => ({
                ...prev,
                valorPrincipal: valor || '',
                dataVencimento: vencimento || '',
                ufFavorecida: uf || '',
                codigoReceita: codigo || ''
            }));

            if (uf) setTipoGuia('GNRE');
        }
    }, [router.isReady, valor, vencimento, uf, codigo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calcularTotal = () => {
        const principal = parseFloat(formData.valorPrincipal) || 0;
        const multa = parseFloat(formData.multa) || 0;
        const juros = parseFloat(formData.juros) || 0;
        return principal + multa + juros;
    };

    const gerarGuia = () => {
        if (!formData.razaoSocial || !formData.cnpj || !formData.valorPrincipal) {
            alert('Preencha os campos obrigatórios (Razão Social, CNPJ, Valor)');
            return;
        }

        const total = calcularTotal();
        const codigoBarras = gerarCodigoBarrasFicticio(total);

        setGuiaGerada({
            ...formData,
            valorTotal: total,
            codigoBarras,
            dataGeracao: new Date().toLocaleDateString('pt-BR')
        });
    };

    const gerarCodigoBarrasFicticio = (valor) => {
        const bloco1 = Math.floor(Math.random() * 89999 + 10000);
        const bloco2 = Math.floor(Math.random() * 89999 + 10000);
        const bloco3 = Math.floor(Math.random() * 89999 + 10000);
        const bloco4 = Math.floor(Math.random() * 89999 + 10000);
        return `858${Math.floor(Math.random() * 9)}00000${Math.floor(valor * 100)} ${bloco1} ${bloco2} ${bloco3} ${bloco4}`;
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    return (
        <ToolLayout title="Gerador de Guias" description="Emissão de espelhos de DARF, GNRE e DAS">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Guias (Simulador)</h1>
                <p className="text-muted-foreground">
                    Gere espelhos de pagamento para DARF, GNRE e DAS. Ideal para enviar ao financeiro.
                </p>
                {valor && (
                    <div className="mt-2 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 p-2 rounded inline-block text-sm">
                        💡 Dados importados automaticamente da ferramenta anterior
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Formulário */}
                <Card className="lg:col-span-2 p-6">
                    {/* Tabs Tipo de Guia */}
                    <div className="flex gap-2 mb-6 border-b border-border pb-2">
                        {['DARF', 'GNRE', 'DAS'].map(tipo => (
                            <button
                                key={tipo}
                                onClick={() => { setTipoGuia(tipo); setGuiaGerada(null); }}
                                className={`px-4 py-2 rounded-t-lg font-bold transition-colors border-b-2 ${tipoGuia === tipo
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                {tipo}
                            </button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <FormGroup>
                                <Label htmlFor="razaoSocial">Razão Social / Nome *</Label>
                                <Input
                                    id="razaoSocial"
                                    name="razaoSocial"
                                    value={formData.razaoSocial}
                                    onChange={handleChange}
                                    placeholder="Empresa Modelo LTDA"
                                />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <Label htmlFor="cnpj">CNPJ / CPF *</Label>
                            <Input
                                id="cnpj"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                placeholder="00.000.000/0000-00"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="codigoReceita">Código da Receita</Label>
                            <Input
                                id="codigoReceita"
                                name="codigoReceita"
                                value={formData.codigoReceita}
                                onChange={handleChange}
                                placeholder={tipoGuia === 'DARF' ? 'Ex: 5952' : 'Ex: 10009-9'}
                            />
                        </FormGroup>

                        {tipoGuia === 'GNRE' && (
                            <FormGroup>
                                <Label htmlFor="ufFavorecida">UF Favorecida</Label>
                                <select
                                    id="ufFavorecida"
                                    name="ufFavorecida"
                                    value={formData.ufFavorecida}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(sigla => (
                                        <option key={sigla} value={sigla}>{sigla}</option>
                                    ))}
                                </select>
                            </FormGroup>
                        )}

                        <FormGroup>
                            <Label htmlFor="periodoApuracao">Período Apuração</Label>
                            <Input
                                id="periodoApuracao"
                                type="date"
                                name="periodoApuracao"
                                value={formData.periodoApuracao}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="dataVencimento">Data Vencimento</Label>
                            <Input
                                id="dataVencimento"
                                type="date"
                                name="dataVencimento"
                                value={formData.dataVencimento}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="valorPrincipal">Valor Principal (R$) *</Label>
                            <Input
                                id="valorPrincipal"
                                type="number"
                                name="valorPrincipal"
                                value={formData.valorPrincipal}
                                onChange={handleChange}
                                className="font-bold"
                            />
                        </FormGroup>

                        <div className="grid grid-cols-2 gap-2 md:col-span-2">
                            <FormGroup>
                                <Label htmlFor="multa">Multa</Label>
                                <Input
                                    id="multa"
                                    type="number"
                                    name="multa"
                                    value={formData.multa}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="juros">Juros</Label>
                                <Input
                                    id="juros"
                                    type="number"
                                    name="juros"
                                    value={formData.juros}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                    </div>

                    <Button
                        onClick={gerarGuia}
                        variant="primary"
                        className="w-full mt-6 flex justify-center items-center gap-2"
                    >
                        <span>📄</span> Gerar Guia {tipoGuia}
                    </Button>
                    <p className="text-xs text-center mt-2 opacity-60">
                        * Gera um modelo de guia para conferência e pagamento
                    </p>
                </Card>

                {/* Visualização da Guia */}
                <div className="lg:col-span-1">
                    {guiaGerada ? (
                        <div className="bg-white text-black p-4 border shadow-lg relative print:shadow-none" style={{ minHeight: '500px', fontFamily: 'Courier New, monospace' }}>
                            {/* Cabeçalho Guia - Forçado Branco/Preto para parecer papel */}
                            <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4 text-center">
                                <h2 className="text-xl font-bold uppercase">{tipoGuia}</h2>
                                <p className="text-sm">Documento de Arrecadação</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold">CONTRIBUINTE</p>
                                    <p>{guiaGerada.razaoSocial}</p>
                                    <p>{guiaGerada.cnpj}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs font-bold">CÓDIGO</p>
                                        <p>{guiaGerada.codigoReceita || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">VENCIMENTO</p>
                                        <p>{guiaGerada.dataVencimento ? new Date(guiaGerada.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '---'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-300 pt-2">
                                    <div className="flex justify-between">
                                        <span>Principal</span>
                                        <span>{formatCurrency(guiaGerada.valorPrincipal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Multa</span>
                                        <span>{formatCurrency(guiaGerada.multa)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Juros</span>
                                        <span>{formatCurrency(guiaGerada.juros)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-black">
                                        <span>TOTAL</span>
                                        <span>{formatCurrency(guiaGerada.valorTotal)}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-xs font-bold mb-1">CÓDIGO DE BARRAS (SIMULAÇÃO)</p>
                                    <div className="bg-gray-100 p-2 text-xs break-all tracking-widest font-bold text-center border">
                                        {guiaGerada.codigoBarras}
                                    </div>
                                </div>

                                <div className="mt-8 text-center print:hidden">
                                    <button
                                        className="bg-gray-800 text-white px-4 py-2 rounded text-xs hover:bg-black w-full"
                                        onClick={() => window.print()}
                                    >
                                        🖨️ IMPRIMIR / SALVAR PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed border-border rounded-lg">
                            <span className="text-4xl opacity-30 mb-2">📄</span>
                            <p className="text-center text-muted-foreground">
                                Preencha o formulário para visualizar o espelho da guia
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
