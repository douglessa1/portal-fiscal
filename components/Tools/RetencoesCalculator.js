import { useState } from 'react';
import { formatarMoeda } from '../../lib/fiscal';

/**
 * RetencoesCalculator - Calculadora de Retenções na Fonte
 * IRRF, PIS, COFINS, CSLL, INSS
 */
export default function RetencoesCalculator() {
    const [formData, setFormData] = useState({
        valorServico: '',
        tipoServico: '17.01',
        cpfCnpjPrestador: ''
    });

    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // Tipos de serviço da LC 116/2003 (principais)
    const tiposServico = [
        { codigo: '17.01', descricao: 'Assessoria ou consultoria' },
        { codigo: '17.02', descricao: 'Análises, programação, consultoria em TI' },
        { codigo: '17.05', descricao: 'Desenvolvimento de programas de computador' },
        { codigo: '14.01', descricao: 'Treinamento e ensino' },
        { codigo: '10.04', descricao: 'Agenciamento de serviços' },
        { codigo: '16.01', descricao: 'Serviços de transporte' },
        { codigo: '07.02', descricao: 'Execução de obras de construção civil' },
        { codigo: '01.01', descricao: 'Análise e desenvolvimento de sistemas' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErro(null);
    };

    const handleCalcular = async () => {
        // Validações
        if (!formData.valorServico || parseFloat(formData.valorServico) <= 0) {
            setErro('Informe um valor válido para o serviço');
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            const response = await fetch('/api/calc/retencoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao calcular retenções');
            }

            setResultado(data);
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLimpar = () => {
        setFormData({
            valorServico: '',
            tipoServico: '17.01',
            cpfCnpjPrestador: ''
        });
        setResultado(null);
        setErro(null);
    };

    return (
        <div className="space-y-6">
            {/* Formulário */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Valor do Serviço (R$) *
                    </label>
                    <input
                        type="number"
                        name="valorServico"
                        value={formData.valorServico}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Serviço (LC 116/2003)
                    </label>
                    <select
                        name="tipoServico"
                        value={formData.tipoServico}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {tiposServico.map(tipo => (
                            <option key={tipo.codigo} value={tipo.codigo}>
                                {tipo.codigo} - {tipo.descricao}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CPF/CNPJ do Prestador (opcional)
                    </label>
                    <input
                        type="text"
                        name="cpfCnpjPrestador"
                        value={formData.cpfCnpjPrestador}
                        onChange={handleChange}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCalcular}
                        disabled={loading}
                        className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Calculando...' : 'Calcular Retenções'}
                    </button>
                    <button
                        onClick={handleLimpar}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                        Limpar
                    </button>
                </div>
            </div>

            {/* Erro */}
            {erro && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-800">
                    <strong>Erro:</strong> {erro}
                </div>
            )}

            {/* Resultados */}
            {resultado && (
                <div className="space-y-4">
                    {/* Resumo */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Resumo das Retenções</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm opacity-90">Valor Bruto</div>
                                <div className="text-2xl font-bold">
                                    {formatarMoeda(resultado.valorServico)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm opacity-90">Total Retido</div>
                                <div className="text-2xl font-bold">
                                    {formatarMoeda(resultado.totalRetido)}
                                </div>
                            </div>
                            <div className="col-span-2 pt-4 border-t border-white/30">
                                <div className="text-sm opacity-90">Valor Líquido a Pagar</div>
                                <div className="text-3xl font-bold">
                                    {formatarMoeda(resultado.valorLiquido)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalhamento */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhamento das Retenções</h3>
                        <div className="space-y-3">
                            {/* PIS */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <div className="font-semibold text-gray-900">PIS</div>
                                    <div className="text-xs text-gray-600">{resultado.pis.baseLegal}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                        {formatarMoeda(resultado.pis.valor)}
                                    </div>
                                    <div className="text-xs text-gray-600">{resultado.pis.aliquota}%</div>
                                </div>
                            </div>

                            {/* COFINS */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <div className="font-semibold text-gray-900">COFINS</div>
                                    <div className="text-xs text-gray-600">{resultado.cofins.baseLegal}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                        {formatarMoeda(resultado.cofins.valor)}
                                    </div>
                                    <div className="text-xs text-gray-600">{resultado.cofins.aliquota}%</div>
                                </div>
                            </div>

                            {/* CSLL */}
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <div className="font-semibold text-gray-900">CSLL</div>
                                    <div className="text-xs text-gray-600">{resultado.csll.baseLegal}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                        {formatarMoeda(resultado.csll.valor)}
                                    </div>
                                    <div className="text-xs text-gray-600">{resultado.csll.aliquota}%</div>
                                </div>
                            </div>

                            {/* IRRF */}
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded border-2 border-purple-200">
                                <div>
                                    <div className="font-semibold text-purple-900">IRRF</div>
                                    <div className="text-xs text-purple-700">{resultado.irrf.baseLegal}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-purple-900">
                                        {formatarMoeda(resultado.irrf.valor)}
                                    </div>
                                    <div className="text-xs text-purple-700">{resultado.irrf.aliquota}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Informações</h4>
                        <ul className="text-sm text-blue-900 space-y-1">
                            <li>• Tipo de serviço: <strong>{formData.tipoServico}</strong></li>
                            <li>• Percentual total retido: <strong>{((resultado.totalRetido / resultado.valorServico) * 100).toFixed(2)}%</strong></li>
                            <li>• As retenções devem ser recolhidas pelo tomador do serviço</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
