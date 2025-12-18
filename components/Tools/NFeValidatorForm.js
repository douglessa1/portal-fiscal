import { useState } from 'react';
import { FormButton, Card, InfoBox } from '../ui/FormComponents';

/**
 * NFeValidatorForm - Formulário de validação de NFe (REFATORADO)
 * Com suporte completo a dark mode
 */
export default function NFeValidatorForm() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.name.endsWith('.xml')) {
            setErro('Apenas arquivos XML são aceitos');
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setErro('Arquivo muito grande. Máximo: 10MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setErro(null);
        setResultado(null);
    };

    const handleValidate = async () => {
        if (!file) {
            setErro('Selecione um arquivo XML');
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const xmlContent = e.target.result;

                const response = await fetch('/api/tools/nfe-validator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ xml: xmlContent })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro ao validar XML');
                }

                setResultado(data);
                setLoading(false);
            };

            reader.onerror = () => {
                setErro('Erro ao ler arquivo');
                setLoading(false);
            };

            reader.readAsText(file);
        } catch (error) {
            setErro(error.message);
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 90) return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
        if (score >= 70) return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors bg-muted/20">
                <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileChange}
                    className="hidden"
                    id="xml-upload"
                />
                <label htmlFor="xml-upload" className="cursor-pointer block">
                    <div className="text-5xl mb-4">📄</div>
                    <div className="text-lg font-semibold text-foreground mb-2">
                        {file ? <span className="text-primary">{file.name}</span> : 'Clique para selecionar XML de NFe'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Arquivos XML até 10MB
                    </div>
                </label>
            </div>

            {/* Error Display */}
            {erro && (
                <InfoBox type="error" title="Erro">
                    {erro}
                </InfoBox>
            )}

            {/* Validate Button */}
            {file && !loading && !resultado && (
                <FormButton
                    onClick={handleValidate}
                    className="w-full"
                    variant="primary"
                >
                    Validar XML
                </FormButton>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-muted-foreground">Validando XML...</p>
                </div>
            )}

            {/* Results */}
            {resultado && (
                <div className="space-y-6">
                    {/* Score Card */}
                    <Card className={`text-center ${getScoreBg(resultado.score)} border-2`}>
                        <div className={`text-6xl font-bold ${getScoreColor(resultado.score)}`}>
                            {resultado.score}
                        </div>
                        <div className="text-lg font-semibold text-foreground mt-2">
                            Score de Conformidade
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {resultado.valido ? '✅ NFe Válida' : '❌ NFe com Problemas'}
                        </div>
                    </Card>

                    {/* Errors */}
                    {resultado.erros && resultado.erros.length > 0 && (
                        <InfoBox type="error" title={`❌ Erros Críticos (${resultado.erros.length})`}>
                            <div className="space-y-3 mt-2">
                                {resultado.erros.map((erro, idx) => (
                                    <div key={idx} className="bg-background rounded p-3 border border-red-200 dark:border-red-900/50">
                                        <div className="font-semibold text-red-700 dark:text-red-400">{erro.tipo}</div>
                                        <div className="text-sm text-foreground mt-1">{erro.mensagem}</div>
                                        {erro.solucao && (
                                            <div className="text-sm text-muted-foreground mt-2 italic">
                                                💡 {erro.solucao}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </InfoBox>
                    )}

                    {/* Warnings */}
                    {resultado.avisos && resultado.avisos.length > 0 && (
                        <InfoBox type="warning" title={`⚠️ Avisos (${resultado.avisos.length})`}>
                            <div className="space-y-2 mt-2">
                                {resultado.avisos.map((aviso, idx) => (
                                    <div key={idx} className="bg-background rounded p-3 border border-yellow-200 dark:border-yellow-900/50">
                                        <div className="font-semibold text-yellow-700 dark:text-yellow-400">{aviso.tipo}</div>
                                        <div className="text-sm text-foreground mt-1">{aviso.mensagem}</div>
                                        {aviso.solucao && (
                                            <div className="text-sm text-muted-foreground mt-2 italic">
                                                💡 {aviso.solucao}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </InfoBox>
                    )}

                    {/* Info */}
                    {resultado.informacoes && resultado.informacoes.length > 0 && (
                        <InfoBox type="info" title={`ℹ️ Informações (${resultado.informacoes.length})`}>
                            <div className="space-y-2 mt-2">
                                {resultado.informacoes.map((info, idx) => (
                                    <div key={idx} className="text-sm opacity-90">
                                        • {info.mensagem || info}
                                    </div>
                                ))}
                            </div>
                        </InfoBox>
                    )}

                    {/* Success Message */}
                    {resultado.valido && resultado.erros.length === 0 && (
                        <InfoBox type="success">
                            <div className="text-center">
                                <div className="text-4xl mb-2">✅</div>
                                <div className="text-lg font-bold">
                                    XML de NFe está em conformidade!
                                </div>
                                <div className="text-sm opacity-90 mt-1">
                                    Nenhum erro crítico encontrado
                                </div>
                            </div>
                        </InfoBox>
                    )}

                    {/* New Validation Button */}
                    <FormButton
                        onClick={() => {
                            setFile(null);
                            setResultado(null);
                            setErro(null);
                        }}
                        className="w-full"
                        variant="secondary"
                    >
                        Validar Outro XML
                    </FormButton>
                </div>
            )}
        </div>
    );
}
