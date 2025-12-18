export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import { useState } from 'react';
import { FormInput, FormSelect } from '../../components/ui/Form';
import ToolLayout from '../../components/Layout/ToolLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription, InfoBox } from '../../components/ui/Alert';

function PartilhaPageContent() {
    const [formData, setFormData] = useState({
        valorOperacao: '',
        aliqOrigem: '',
        aliqDestino: '',
        ano: '2024'
    });

    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErro(null);
    };

    const handleCalcular = () => {
        if (!formData.valorOperacao || !formData.aliqOrigem || !formData.aliqDestino) {
            setErro('Preencha todos os campos obrigatórios');
            return;
        }

        const valor = parseFloat(formData.valorOperacao);
        const aliqOrig = parseFloat(formData.aliqOrigem);
        const aliqDest = parseFloat(formData.aliqDestino);
        const ano = parseInt(formData.ano);

        const percentuais = {
            2016: { origem: 60, destino: 40 },
            2017: { origem: 40, destino: 60 },
            2018: { origem: 20, destino: 80 },
            2019: { origem: 0, destino: 100 }
        };

        const partilha = percentuais[ano] || percentuais[2019];

        const icmsOrigem = (valor * aliqOrig) / 100;
        const icmsDestino = (valor * aliqDest) / 100;
        const diferenca = icmsDestino - icmsOrigem;

        const valorOrigem = (diferenca * partilha.origem) / 100;
        const valorDestino = (diferenca * partilha.destino) / 100;

        setResultado({
            icmsOrigem,
            icmsDestino,
            diferenca,
            valorOrigem,
            valorDestino,
            percOrigem: partilha.origem,
            percDestino: partilha.destino
        });
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <ToolLayout title="Partilha ICMS" description="Calculadora de Partilha de ICMS entre Estados">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Partilha de ICMS</h1>
                <p className="text-muted-foreground mt-2">
                    Calcule a partilha de ICMS entre estados conforme EC 87/2015
                </p>
            </div>

            <Card>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                        label="Valor da Operação (R$) *"
                        type="number"
                        name="valorOperacao"
                        value={formData.valorOperacao}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                    />
                    <FormSelect
                        label="Ano da Operação *"
                        name="ano"
                        value={formData.ano}
                        onChange={handleChange}
                    >
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019+</option>
                        <option value="2024">2024 (atual)</option>
                    </FormSelect>
                    <FormInput
                        label="Alíquota Origem (%) *"
                        type="number"
                        name="aliqOrigem"
                        value={formData.aliqOrigem}
                        onChange={handleChange}
                        placeholder="12.00"
                        step="0.01"
                    />
                    <FormInput
                        label="Alíquota Destino (%) *"
                        type="number"
                        name="aliqDestino"
                        value={formData.aliqDestino}
                        onChange={handleChange}
                        placeholder="18.00"
                        step="0.01"
                    />
                </div>

                <Button onClick={handleCalcular} className="w-full mt-4">
                    Calcular Partilha
                </Button>

                {erro && (
                    <InfoBox type="error" title="Erro" className="mt-4">
                        {erro}
                    </InfoBox>
                )}

                {resultado && (
                    <div className="space-y-4 pt-6 border-t border-border mt-6">
                        <h3 className="text-lg font-bold text-foreground">Resultado</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 p-4">
                                <div className="text-sm text-blue-700 dark:text-blue-300">ICMS Origem</div>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {formatCurrency(resultado.icmsOrigem)}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    Partilha: {resultado.percOrigem}%
                                </div>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50 p-4">
                                <div className="text-sm text-green-700 dark:text-green-300">ICMS Destino</div>
                                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {formatCurrency(resultado.icmsDestino)}
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Partilha: {resultado.percDestino}%
                                </div>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50 p-4">
                                <div className="text-sm text-purple-700 dark:text-purple-300">Valor para Origem</div>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {formatCurrency(resultado.valorOrigem)}
                                </div>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50 p-4">
                                <div className="text-sm text-purple-700 dark:text-purple-300">Valor para Destino</div>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {formatCurrency(resultado.valorDestino)}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </Card>

            <InfoBox type="info" title="ℹ️ Sobre a Partilha" className="mt-8">
                <ul className="space-y-2 text-sm mt-2">
                    <li><strong>EC 87/2015:</strong> Emenda Constitucional que regulamenta a partilha</li>
                    <li><strong>2016:</strong> 60% origem / 40% destino</li>
                    <li><strong>2017:</strong> 40% origem / 60% destino</li>
                    <li><strong>2018:</strong> 20% origem / 80% destino</li>
                    <li><strong>2019+:</strong> 0% origem / 100% destino</li>
                </ul>
            </InfoBox>
        </ToolLayout>
    );
}

export default function PartilhaPage() {
    return (
        <AuthGate>
            <PartilhaPageContent />
        </AuthGate>
    );
}
