import { useState } from 'react';
import { extrairDadosDIFAL } from '../../lib/difalIntegrado';
import { FormInput } from '../ui/Form';
import { FormSelect } from '../ui/Form';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { InfoBox } from '../ui/Alert';

/**
 * Componente: Formulário da Calculadora DIFAL (REFATORADO)
 * Totalmente temático com dark mode
 */
export default function DIFALForm({ onCalculate, onSaveHistory }) {
    const [formData, setFormData] = useState({
        valor: '',
        ufOrigem: '',
        ufDestino: '',
        aliqInter: '',
        aliqInterna: '',
        aliqFCP: '0',
        metodologia: 'auto'
    });

    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [importandoXML, setImportandoXML] = useState(false);
    const [itensXML, setItensXML] = useState([]);
    const [itensSelecionados, setItensSelecionados] = useState([]);

    const aliquotasInterestaduais = {
        'norte': 7,
        'nordeste': 7,
        'centro-oeste': 7,
        'sul': 12,
        'sudeste': 12
    };

    const ufs = [
        { sigla: 'AC', nome: 'Acre', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'AL', nome: 'Alagoas', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'AP', nome: 'Amapá', regiao: 'norte', aliqInterna: 18 },
        { sigla: 'AM', nome: 'Amazonas', regiao: 'norte', aliqInterna: 18 },
        { sigla: 'BA', nome: 'Bahia', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'CE', nome: 'Ceará', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'DF', nome: 'Distrito Federal', regiao: 'centro-oeste', aliqInterna: 18 },
        { sigla: 'ES', nome: 'Espírito Santo', regiao: 'sudeste', aliqInterna: 17 },
        { sigla: 'GO', nome: 'Goiás', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'MA', nome: 'Maranhão', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'MT', nome: 'Mato Grosso', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'centro-oeste', aliqInterna: 17 },
        { sigla: 'MG', nome: 'Minas Gerais', regiao: 'sudeste', aliqInterna: 18 },
        { sigla: 'PA', nome: 'Pará', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'PB', nome: 'Paraíba', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'PR', nome: 'Paraná', regiao: 'sul', aliqInterna: 18 },
        { sigla: 'PE', nome: 'Pernambuco', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'PI', nome: 'Piauí', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'sudeste', aliqInterna: 20 },
        { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'sul', aliqInterna: 18 },
        { sigla: 'RO', nome: 'Rondônia', regiao: 'norte', aliqInterna: 17.5 },
        { sigla: 'RR', nome: 'Roraima', regiao: 'norte', aliqInterna: 17 },
        { sigla: 'SC', nome: 'Santa Catarina', regiao: 'sul', aliqInterna: 17 },
        { sigla: 'SP', nome: 'São Paulo', regiao: 'sudeste', aliqInterna: 18 },
        { sigla: 'SE', nome: 'Sergipe', regiao: 'nordeste', aliqInterna: 18 },
        { sigla: 'TO', nome: 'Tocantins', regiao: 'norte', aliqInterna: 18 }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'ufDestino' && value) {
            const uf = ufs.find(u => u.sigla === value);
            if (uf) {
                setFormData(prev => ({
                    ...prev,
                    aliqInterna: uf.aliqInterna.toString(),
                    metodologia: prev.metodologia === 'auto' ? (value === 'ES' ? 'base_unica' : 'base_dupla') : prev.metodologia
                }));
            }
        }

        if ((name === 'ufOrigem' || name === 'ufDestino') && formData.ufOrigem && value) {
            const destino = name === 'ufDestino' ? value : formData.ufDestino;
            const ufDest = ufs.find(u => u.sigla === destino);
            if (ufDest) {
                const aliqInter = aliquotasInterestaduais[ufDest.regiao] || 12;
                setFormData(prev => ({ ...prev, aliqInter: aliqInter.toString() }));
            }
        }
    };

    const handleImportarXML = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportandoXML(true);
        setError('');

        try {
            const text = await file.text();
            const dadosExtraidos = await extrairDadosDIFAL(text);

            if (dadosExtraidos.sucesso) {
                setFormData(prev => ({
                    ...prev,
                    ufOrigem: dadosExtraidos.ufOrigem || prev.ufOrigem,
                    ufDestino: dadosExtraidos.ufDestino || prev.ufDestino
                }));

                if (dadosExtraidos.itens && dadosExtraidos.itens.length > 0) {
                    setItensXML(dadosExtraidos.itens);
                    const itensPadrao = dadosExtraidos.itens
                        .filter(item => item.finalidade !== 'revenda')
                        .map(item => item.numero);
                    setItensSelecionados(itensPadrao);
                } else {
                    setFormData(prev => ({
                        ...prev,
                        valor: dadosExtraidos.valorOperacao?.toString() || prev.valor
                    }));
                }

                if (dadosExtraidos.ufDestino) {
                    const uf = ufs.find(u => u.sigla === dadosExtraidos.ufDestino);
                    if (uf) {
                        setFormData(prev => ({
                            ...prev,
                            aliqInterna: uf.aliqInterna.toString()
                        }));
                    }
                }

                if (dadosExtraidos.ufOrigem && dadosExtraidos.ufDestino) {
                    const ufDest = ufs.find(u => u.sigla === dadosExtraidos.ufDestino);
                    if (ufDest) {
                        const aliqInter = aliquotasInterestaduais[ufDest.regiao] || 12;
                        setFormData(prev => ({ ...prev, aliqInter: aliqInter.toString() }));
                    }
                }

                setError('');
            } else {
                setError(dadosExtraidos.erro || 'Erro ao processar XML');
            }
        } catch (err) {
            setError('Erro ao ler arquivo XML: ' + err.message);
        } finally {
            setImportandoXML(false);
        }
    };

    const toggleItemSelecionado = (numeroItem) => {
        setItensSelecionados(prev => {
            if (prev.includes(numeroItem)) {
                return prev.filter(n => n !== numeroItem);
            } else {
                return [...prev, numeroItem];
            }
        });
    };

    const calcularValorItensSelecionados = () => {
        if (itensXML.length === 0 || itensSelecionados.length === 0) {
            return 0;
        }
        return itensXML
            .filter(item => itensSelecionados.includes(item.numero))
            .reduce((sum, item) => sum + item.valorTotal, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/calc/difal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error('Erro ao calcular DIFAL');
            }

            const data = await res.json();
            setResultado(data);

            const historico = JSON.parse(localStorage.getItem('difal_history') || '[]');
            historico.unshift({
                ...formData,
                resultado: data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('difal_history', JSON.stringify(historico.slice(0, 10)));

            if (onCalculate) {
                onCalculate(data);
            }
        } catch (err) {
            setError(err.message || 'Erro ao calcular');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value && value !== 0) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* Importar XML */}
            <InfoBox type="info" title="📁 Importar dados de XML NFe">
                <label className="cursor-pointer inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    {importandoXML ? 'Processando...' : 'Selecionar XML'}
                    <input
                        type="file"
                        accept=".xml"
                        onChange={handleImportarXML}
                        disabled={importandoXML}
                        className="hidden"
                    />
                </label>
                <p className="text-xs opacity-80 mt-2">
                    Importe o XML da NFe para preencher automaticamente os dados
                </p>
            </InfoBox>

            {/* Seleção de Itens do XML */}
            {itensXML.length > 0 && (
                <InfoBox type="success" title="📦 Selecione os itens para calcular DIFAL">
                    <p className="text-sm mb-3">
                        Itens de <strong>uso/consumo</strong> e <strong>ativo imobilizado</strong> foram pré-selecionados.
                    </p>
                    <div className="bg-background rounded-lg overflow-hidden border border-border overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="p-2 text-left text-foreground">Sel.</th>
                                    <th className="p-2 text-left text-foreground">Item</th>
                                    <th className="p-2 text-left text-foreground">Descrição</th>
                                    <th className="p-2 text-left text-foreground">NCM</th>
                                    <th className="p-2 text-left text-foreground">CFOP</th>
                                    <th className="p-2 text-center text-foreground">ICMS</th>
                                    <th className="p-2 text-left text-foreground">Finalidade</th>
                                    <th className="p-2 text-right text-foreground">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensXML.map(item => (
                                    <tr key={item.numero} className="border-t border-border hover:bg-muted/50">
                                        <td className="p-2">
                                            <input
                                                type="checkbox"
                                                checked={itensSelecionados.includes(item.numero)}
                                                onChange={() => toggleItemSelecionado(item.numero)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                        </td>
                                        <td className="p-2 text-foreground">{item.numero}</td>
                                        <td className="p-2 text-foreground">{item.descricao}</td>
                                        <td className="p-2 font-mono text-xs text-muted-foreground">{item.ncm}</td>
                                        <td className="p-2 font-mono text-xs text-muted-foreground">{item.cfop}</td>
                                        <td className="p-2 text-center text-foreground">
                                            {item.aliqICMS ? `${item.aliqICMS}%` : '-'}
                                        </td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${item.finalidade === 'uso_consumo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    item.finalidade === 'ativo_imobilizado' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        'bg-muted text-muted-foreground'
                                                }`}>
                                                {item.finalidade === 'uso_consumo' ? 'Uso/Consumo' :
                                                    item.finalidade === 'ativo_imobilizado' ? 'Ativo Imob.' :
                                                        'Revenda'}
                                            </span>
                                        </td>
                                        <td className="p-2 text-right font-semibold text-foreground">
                                            R$ {item.valorTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-muted font-bold">
                                <tr>
                                    <td colSpan="7" className="p-2 text-right text-foreground">Total Selecionado:</td>
                                    <td className="p-2 text-right text-green-600 dark:text-green-400">
                                        R$ {calcularValorItensSelecionados().toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <Button
                        variant="primary"
                        className="mt-3"
                        onClick={() => {
                            const valorTotal = calcularValorItensSelecionados();
                            setFormData(prev => ({ ...prev, valor: valorTotal.toString() }));
                        }}
                    >
                        Usar valor dos itens selecionados (R$ {calcularValorItensSelecionados().toFixed(2)})
                    </Button>
                </InfoBox>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                        type="number"
                        name="valor"
                        label="Valor da Operação (R$)"
                        value={formData.valor}
                        onChange={handleChange}
                        step="0.01"
                        required
                        placeholder="10000.00"
                    />

                    <FormSelect
                        name="ufOrigem"
                        label="UF Origem"
                        value={formData.ufOrigem}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {ufs.map(uf => (
                            <option key={uf.sigla} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>
                        ))}
                    </FormSelect>

                    <FormSelect
                        name="ufDestino"
                        label="UF Destino"
                        value={formData.ufDestino}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {ufs.map(uf => (
                            <option key={uf.sigla} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>
                        ))}
                    </FormSelect>

                    <FormInput
                        type="number"
                        name="aliqInter"
                        label="Alíquota Interestadual (%)"
                        value={formData.aliqInter}
                        onChange={handleChange}
                        step="0.01"
                        required
                        placeholder="12"
                    />

                    <FormInput
                        type="number"
                        name="aliqInterna"
                        label="Alíquota Interna Destino (%)"
                        value={formData.aliqInterna}
                        onChange={handleChange}
                        step="0.01"
                        required
                        placeholder="18"
                    />

                    <FormInput
                        type="number"
                        name="aliqFCP"
                        label="Alíquota FCP (%)"
                        value={formData.aliqFCP}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="0"
                    />
                </div>

                <InfoBox type="info" title="📐 Metodologia de Cálculo">
                    <FormSelect
                        name="metodologia"
                        value={formData.metodologia}
                        onChange={handleChange}
                        className="mb-2"
                    >
                        <option value="auto">Automático (Base Única para ES, Base Dupla para demais)</option>
                        <option value="base_dupla">Base Dupla (Padrão - LC 190/2022)</option>
                        <option value="base_unica">Base Única (Espírito Santo)</option>
                    </FormSelect>
                    <div className="text-xs opacity-80">
                        {formData.metodologia === 'auto' && formData.ufDestino === 'ES' && (
                            <span>✓ Base Única será aplicada (ES selecionado)</span>
                        )}
                        {formData.metodologia === 'auto' && formData.ufDestino && formData.ufDestino !== 'ES' && (
                            <span>✓ Base Dupla será aplicada</span>
                        )}
                        {formData.metodologia === 'base_dupla' && (
                            <span>✓ Base Dupla: Base majorada = Valor líquido / (1 - Aliq Interna)</span>
                        )}
                        {formData.metodologia === 'base_unica' && (
                            <span>✓ Base Única: DIFAL = Valor × (Aliq Interna - Aliq Inter)</span>
                        )}
                    </div>
                </InfoBox>

                {error && (
                    <InfoBox type="error">
                        {error}
                    </InfoBox>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Calculando...' : 'Calcular DIFAL'}
                </Button>
            </form>

            {/* Resultado */}
            {resultado && (
                <Card title={`Resultado do Cálculo - ${resultado.metodologia === 'base_dupla' ? 'Base Dupla' : 'Base Única'}`}>
                    <div className="grid md:grid-cols-2 gap-4">
                        {resultado.baseMajorada && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">Base Majorada</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(resultado.baseMajorada)}</p>
                            </div>
                        )}
                        {resultado.baseCalculo && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">Base de Cálculo</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(resultado.baseCalculo)}</p>
                            </div>
                        )}
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">ICMS Destino</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(resultado.icmsDestino)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">FCP</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(resultado.fcp)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">ICMS Origem</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(resultado.icmsOrigem)}</p>
                        </div>
                    </div>
                    <div className="mt-4 bg-primary text-primary-foreground rounded-lg p-4 text-center">
                        <p className="text-sm opacity-90">DIFAL Total</p>
                        <p className="text-3xl font-bold">{formatCurrency(resultado.totalDifal)}</p>
                        <p className="text-xs opacity-75 mt-1">
                            (DIFAL: {formatCurrency(resultado.difal)} + FCP: {formatCurrency(resultado.fcp)})
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
