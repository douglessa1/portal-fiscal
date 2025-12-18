import { useState } from 'react';
import ToolLayout from '../../components/Layout/ToolLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';

export default function MVAAjustadaPage() {
    const [formData, setFormData] = useState({
        mvaOriginal: '',
        aliqInterestadual: '',
        aliqInterna: ''
    });

    const [resultado, setResultado] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calcularMVA = () => {
        const mvaOriginal = parseFloat(formData.mvaOriginal);
        const aliqInter = parseFloat(formData.aliqInterestadual);
        const aliqIntra = parseFloat(formData.aliqInterna);

        if (isNaN(mvaOriginal) || isNaN(aliqInter) || isNaN(aliqIntra)) {
            setResultado(null);
            return;
        }

        const fator1 = 1 + (mvaOriginal / 100);
        const fator2 = 1 - (aliqInter / 100);
        const fator3 = 1 - (aliqIntra / 100);

        if (fator3 === 0) {
            setResultado({ erro: "Alíquota Interna não pode ser 100%" });
            return;
        }

        const mvaAjustada = ((fator1 * fator2) / fator3) - 1;
        const mvaAjustadaPercentual = mvaAjustada * 100;

        setResultado({
            original: mvaOriginal,
            ajustada: mvaAjustadaPercentual
        });
    };

    return (
        <ToolLayout title="Ajuste de MVA" description="Calculadora de MVA Ajustada para ICMS-ST">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-foreground">Calculadora de MVA Ajustada</h1>
                <p className="text-muted-foreground">
                    Calcule a MVA Ajustada para operações interestaduais sujeitas à Substituição Tributária.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">Dados da Operação</h3>
                    <div className="space-y-4">
                        <FormGroup>
                            <Label htmlFor="mvaOriginal">MVA Original (%)</Label>
                            <Input
                                id="mvaOriginal"
                                type="number"
                                name="mvaOriginal"
                                value={formData.mvaOriginal}
                                onChange={handleChange}
                                placeholder="Ex: 40.00"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="aliqInterestadual">Alíquota Interestadual (%)</Label>
                            <select
                                id="aliqInterestadual"
                                name="aliqInterestadual"
                                value={formData.aliqInterestadual}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">Selecione...</option>
                                <option value="4">4% (Importados)</option>
                                <option value="7">7% (Sul/Sudeste p/ Norte/Nordeste/CO/ES)</option>
                                <option value="12">12% (Regra Geral)</option>
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="aliqInterna">Alíquota Interna Destino (%)</Label>
                            <Input
                                id="aliqInterna"
                                type="number"
                                name="aliqInterna"
                                value={formData.aliqInterna}
                                onChange={handleChange}
                                placeholder="Ex: 18.00"
                            />
                        </FormGroup>

                        <Button onClick={calcularMVA} variant="primary" className="w-full mt-4">
                            Calcular MVA Ajustada
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col justify-center items-center text-center">
                    {!resultado ? (
                        <div className="opacity-50 text-muted-foreground">
                            <span className="text-4xl block mb-2">🧮</span>
                            Preencha os dados ao lado para calcular
                        </div>
                    ) : resultado.erro ? (
                        <div className="text-red-500 font-bold">{resultado.erro}</div>
                    ) : (
                        <div className="animate-fade-in w-full">
                            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">MVA Ajustada</p>
                            <div className="text-5xl font-bold text-primary mb-6">
                                {resultado.ajustada.toFixed(2)}%
                            </div>

                            <div className="bg-muted p-4 rounded-lg text-left text-sm text-foreground border border-border">
                                <p className="mb-1"><strong>MVA Original:</strong> {resultado.original.toFixed(2)}%</p>
                                <p className="mb-0 text-muted-foreground">
                                    <strong>Fórmula:</strong> [(1 + {resultado.original}/100) * (1 - {formData.aliqInterestadual}/100) / (1 - {formData.aliqInterna}/100)] - 1
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <Alert variant="warning" className="mt-8">
                <AlertDescription>
                    <strong>Nota:</strong> A MVA Ajustada é utilizada quando a alíquota interna do estado de destino é superior à alíquota interestadual, equalizando a carga tributária.
                </AlertDescription>
            </Alert>
        </ToolLayout>
    );
}
