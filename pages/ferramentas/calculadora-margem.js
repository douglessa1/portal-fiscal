export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import { useState, useEffect } from 'react';
import { FormInput } from '../../components/ui/Form';
import ToolLayout from '../../components/Layout/ToolLayout';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';

function CalculadoraMargemPageContent() {
    const [modo, setModo] = useState('formacao'); // 'formacao' (custo -> preço) ou 'reverso' (preço -> margem)

    const [valores, setValores] = useState({
        custoProduto: '',
        frete: '',
        impostos: '', // %
        comissao: '', // %
        despesasFixas: '', // %
        margemDesejada: '', // %
        precoVenda: '' // Usado no modo reverso
    });

    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        calcular();
    }, [valores, modo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValores(prev => ({ ...prev, [name]: value }));
    };

    const calcular = () => {
        const custo = parseFloat(valores.custoProduto) || 0;
        const frete = parseFloat(valores.frete) || 0;
        const custoTotal = custo + frete;

        const percImpostos = parseFloat(valores.impostos) || 0;
        const percComissao = parseFloat(valores.comissao) || 0;
        const percDespesas = parseFloat(valores.despesasFixas) || 0;
        const percMargem = parseFloat(valores.margemDesejada) || 0;

        const somaPercentuais = percImpostos + percComissao + percDespesas + percMargem;

        if (modo === 'formacao') {
            if (somaPercentuais >= 100) {
                setResultado({ erro: "A soma das porcentagens não pode ser 100% ou mais." });
                return;
            }

            const divisor = 1 - (somaPercentuais / 100);
            const precoSugerido = custoTotal / divisor;
            const markup = precoSugerido / custoTotal;

            setResultado({
                custoTotal,
                precoVenda: precoSugerido,
                markup: markup,
                lucroLiquido: precoSugerido * (percMargem / 100),
                valorImpostos: precoSugerido * (percImpostos / 100),
                valorComissao: precoSugerido * (percComissao / 100),
                valorDespesas: precoSugerido * (percDespesas / 100)
            });

        } else {
            const precoVenda = parseFloat(valores.precoVenda) || 0;
            if (precoVenda <= 0) return;

            const valorImpostos = precoVenda * (percImpostos / 100);
            const valorComissao = precoVenda * (percComissao / 100);
            const valorDespesas = precoVenda * (percDespesas / 100);

            const sobras = precoVenda - custoTotal - valorImpostos - valorComissao - valorDespesas;
            const margemReal = (sobras / precoVenda) * 100;
            const markup = precoVenda / custoTotal;

            setResultado({
                custoTotal,
                precoVenda,
                markup,
                lucroLiquido: sobras,
                margemReal: margemReal,
                valorImpostos,
                valorComissao,
                valorDespesas
            });
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
    const formatPercent = (val) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0) + '%';

    return (
        <ToolLayout title="Calculadora de Margem" description="Calcule preço de venda, markup e margem líquida">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Margem & Markup</h1>
                <p className="text-muted-foreground">
                    Defina o preço de venda ideal para seus produtos ou descubra sua margem real.
                </p>
            </div>

            <div className="flex gap-4 mb-6">
                <Button
                    onClick={() => setModo('formacao')}
                    variant={modo === 'formacao' ? 'primary' : 'secondary'}
                    className="flex-1 md:flex-none"
                >
                    Formação de Preço
                </Button>
                <Button
                    onClick={() => setModo('reverso')}
                    variant={modo === 'reverso' ? 'primary' : 'secondary'}
                    className="flex-1 md:flex-none"
                >
                    Cálculo Reverso (Descobrir Margem)
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card title="Dados do Produto">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Custo do Produto (R$)"
                                type="number"
                                name="custoProduto"
                                value={valores.custoProduto}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                            <FormInput
                                label="Frete/Extras (R$)"
                                type="number"
                                name="frete"
                                value={valores.frete}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>

                        {modo === 'reverso' && (
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                <FormInput
                                    label="Preço de Venda Praticado (R$)"
                                    type="number"
                                    name="precoVenda"
                                    value={valores.precoVenda}
                                    onChange={handleChange}
                                    className="border-primary font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                        )}

                        <div className="border-t border-border my-4 pt-2">
                            <h4 className="font-semibold text-sm mb-4 opacity-80">Percentuais Sobre a Venda</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Impostos (%)"
                                    type="number"
                                    name="impostos"
                                    value={valores.impostos}
                                    onChange={handleChange}
                                    placeholder="Ex: 18"
                                />
                                <FormInput
                                    label="Comissão (%)"
                                    type="number"
                                    name="comissao"
                                    value={valores.comissao}
                                    onChange={handleChange}
                                    placeholder="Ex: 3"
                                />
                                <FormInput
                                    label="Desp. Fixas (%)"
                                    type="number"
                                    name="despesasFixas"
                                    value={valores.despesasFixas}
                                    onChange={handleChange}
                                    placeholder="Ex: 10"
                                />

                                {modo === 'formacao' && (
                                    <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded border border-green-200 dark:border-green-800 -m-2">
                                        <FormInput
                                            label="Margem Desejada (%)"
                                            type="number"
                                            name="margemDesejada"
                                            value={valores.margemDesejada}
                                            onChange={handleChange}
                                            className="border-green-500"
                                            placeholder="Ex: 20"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="flex flex-col justify-center">
                    {!resultado ? (
                        <div className="text-center opacity-50 py-12">
                            Preencha os dados para ver o resultado
                        </div>
                    ) : resultado.erro ? (
                        <InfoBox type="error" title="Erro">
                            {resultado.erro}
                        </InfoBox>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm uppercase tracking-widest opacity-70 mb-2 font-semibold">
                                    {modo === 'formacao' ? 'Preço de Venda Sugerido' : 'Margem de Lucro Real'}
                                </p>
                                <div className="text-5xl font-bold text-primary">
                                    {modo === 'formacao'
                                        ? formatCurrency(resultado.precoVenda)
                                        : formatPercent(resultado.margemReal)
                                    }
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 rounded-lg bg-muted border border-border">
                                    <p className="text-xs opacity-70 uppercase font-semibold">Markup</p>
                                    <p className="font-bold text-xl">{resultado.markup.toFixed(2)}x</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                                    <p className="text-xs opacity-70 text-green-700 dark:text-green-300 font-bold uppercase">Lucro Líquido</p>
                                    <p className="font-bold text-xl text-green-700 dark:text-green-400">
                                        {formatCurrency(resultado.lucroLiquido)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm pt-6 border-t border-border">
                                <div className="flex justify-between">
                                    <span>Custo Total do Produto</span>
                                    <span className="font-bold text-red-500 dark:text-red-400">-{formatCurrency(resultado.custoTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impostos</span>
                                    <span className="font-bold text-orange-500 dark:text-orange-400">-{formatCurrency(resultado.valorImpostos)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Comissões</span>
                                    <span className="font-bold text-orange-500 dark:text-orange-400">-{formatCurrency(resultado.valorComissao)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Despesas Fixas</span>
                                    <span className="font-bold text-orange-500 dark:text-orange-400">-{formatCurrency(resultado.valorDespesas)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border font-bold text-lg mt-3">
                                    <span>Preço Final</span>
                                    <span className="text-primary">{formatCurrency(resultado.precoVenda)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </ToolLayout>
    );
}

export default function CalculadoraMargemPage() {
    return (
        <AuthGate>
            <CalculadoraMargemPageContent />
        </AuthGate>
    );
}
