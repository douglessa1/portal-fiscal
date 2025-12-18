import ToolLayout from '../../components/Layout/ToolLayout';
import { useState } from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';
import Link from 'next/link';

export default function ComparadorPage() {
    const [formData, setFormData] = useState({
        valorOperacao: '10000',
        setor: 'comercio'
    });

    const [resultado, setResultado] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCalcular = () => {
        const valor = parseFloat(formData.valorOperacao);

        // Sistema Atual (estimativas médias)
        const icms = (valor * 18) / 100;
        const pis = (valor * 1.65) / 100;
        const cofins = (valor * 7.6) / 100;
        const totalAtual = icms + pis + cofins;

        // Sistema Novo (estimativas)
        const ibs = (valor * 12.5) / 100;
        const cbs = (valor * 12.5) / 100;
        const totalNovo = ibs + cbs;

        const diferenca = totalNovo - totalAtual;
        const percentualDiferenca = ((diferenca / totalAtual) * 100);

        setResultado({
            atual: {
                icms,
                pis,
                cofins,
                total: totalAtual
            },
            novo: {
                ibs,
                cbs,
                total: totalNovo
            },
            diferenca,
            percentualDiferenca
        });
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <ToolLayout title="Comparador de Regimes" description="Compare sistema atual vs Reforma Tributária">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Comparador de Regimes Tributários</h1>
                <p className="text-muted-foreground mt-2">
                    Compare o sistema tributário atual com o novo sistema da Reforma Tributária (Estimativa Simplificada)
                </p>
                <div className="mt-2">
                    <Link href="/ferramentas/comparador-regimes" className="text-primary hover:underline font-medium text-sm">
                        → Procurando uma análise mais detalhada? Clique aqui para o Comparador Avançado
                    </Link>
                </div>
            </div>

            <Card>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                        label="Valor da Operação (R$) *"
                        type="number"
                        name="valorOperacao"
                        value={formData.valorOperacao}
                        onChange={handleChange}
                        placeholder="10000.00"
                        step="0.01"
                    />
                    <FormSelect
                        label="Setor"
                        name="setor"
                        value={formData.setor}
                        onChange={handleChange}
                    >
                        <option value="comercio">Comércio</option>
                        <option value="industria">Indústria</option>
                        <option value="servicos">Serviços</option>
                    </FormSelect>
                </div>

                <Button onClick={handleCalcular} className="w-full mt-4">
                    Comparar Regimes
                </Button>

                {resultado && (
                    <div className="space-y-6 pt-6 border-t border-border mt-6">
                        {/* Sistema Atual */}
                        <div>
                            <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-3">🔴 Sistema Atual</h3>
                            <div className="grid md:grid-cols-4 gap-3">
                                <Card className="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 p-3">
                                    <div className="text-xs text-red-700 dark:text-red-300">ICMS (18%)</div>
                                    <div className="text-lg font-bold text-red-900 dark:text-red-100">
                                        {formatCurrency(resultado.atual.icms)}
                                    </div>
                                </Card>
                                <Card className="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 p-3">
                                    <div className="text-xs text-red-700 dark:text-red-300">PIS (1,65%)</div>
                                    <div className="text-lg font-bold text-red-900 dark:text-red-100">
                                        {formatCurrency(resultado.atual.pis)}
                                    </div>
                                </Card>
                                <Card className="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 p-3">
                                    <div className="text-xs text-red-700 dark:text-red-300">COFINS (7,6%)</div>
                                    <div className="text-lg font-bold text-red-900 dark:text-red-100">
                                        {formatCurrency(resultado.atual.cofins)}
                                    </div>
                                </Card>
                                <Card className="bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 p-3">
                                    <div className="text-xs text-red-800 dark:text-red-200">Total</div>
                                    <div className="text-lg font-bold text-red-900 dark:text-red-100">
                                        {formatCurrency(resultado.atual.total)}
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Sistema Novo */}
                        <div>
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">🟢 Sistema Novo (Reforma)</h3>
                            <div className="grid md:grid-cols-3 gap-3">
                                <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50 p-3">
                                    <div className="text-xs text-green-700 dark:text-green-300">IBS (12,5%)</div>
                                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                                        {formatCurrency(resultado.novo.ibs)}
                                    </div>
                                </Card>
                                <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50 p-3">
                                    <div className="text-xs text-green-700 dark:text-green-300">CBS (12,5%)</div>
                                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                                        {formatCurrency(resultado.novo.cbs)}
                                    </div>
                                </Card>
                                <Card className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 p-3">
                                    <div className="text-xs text-green-800 dark:text-green-200">Total</div>
                                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                                        {formatCurrency(resultado.novo.total)}
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Comparação */}
                        <Card className={`p-4 ${resultado.diferenca < 0 ? 'bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-800'}`}>
                            <h3 className="text-lg font-bold mb-2 text-foreground">📊 Comparação</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-foreground opacity-80">Diferença Absoluta</div>
                                    <div className={`text-2xl font-bold ${resultado.diferenca < 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                        {resultado.diferenca < 0 ? '- ' : '+ '}{formatCurrency(Math.abs(resultado.diferenca))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-foreground opacity-80">Diferença Percentual</div>
                                    <div className={`text-2xl font-bold ${resultado.diferenca < 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                        {resultado.percentualDiferenca.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-sm font-medium">
                                {resultado.diferenca < 0 ? (
                                    <span className="text-green-700 dark:text-green-400">
                                        ✅ Economia com o novo sistema
                                    </span>
                                ) : (
                                    <span className="text-red-700 dark:text-red-400">
                                        ⚠️ Aumento com o novo sistema
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </Card>

            <InfoBox type="warning" title="⚠️ Observações" className="mt-8">
                <ul className="space-y-2 text-sm mt-2">
                    <li>• Valores são <strong>estimativas</strong> baseadas em alíquotas médias</li>
                    <li>• Alíquotas reais variam por estado, município e tipo de operação</li>
                    <li>• IBS/CBS terão alíquotas definidas por lei complementar</li>
                </ul>
            </InfoBox>
        </ToolLayout>
    );
}
