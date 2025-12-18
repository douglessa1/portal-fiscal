import { useState } from 'react';
import { FormButton, Card, InfoBox } from '../ui/FormComponents';

/**
 * Componente: Upload e visualização de XML
 * Processa arquivos XML de NFe e exibe dados extraídos
 */
export default function XmlUploader() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        // Validar tamanho (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('Arquivo muito grande. Máximo: 10MB');
            return;
        }

        // Validar tipo
        if (!selectedFile.name.endsWith('.xml')) {
            setError('Apenas arquivos XML são aceitos');
            return;
        }

        setFile(selectedFile);
        setError('');
        setResult(null); // Reset result on new file selection
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Selecione um arquivo XML');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('xml', file);

            const res = await fetch('/api/tools/xml', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error('Erro ao processar XML');
            }

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'Erro ao processar arquivo');
        } finally {
            setLoading(false);
        }
    };

    const downloadJson = () => {
        if (!result) return;

        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.xml', '')}_parsed.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors bg-muted/20">
                <input
                    type="file"
                    accept=".xml,text/xml,application/xml"
                    onChange={handleFileChange}
                    className="hidden"
                    id="xml-upload"
                />
                <label htmlFor="xml-upload" className="cursor-pointer block">
                    <div className="text-muted-foreground">
                        <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="mt-2 text-sm">
                            {file ? (
                                <span className="text-primary font-semibold text-lg block">{file.name}</span>
                            ) : (
                                <>
                                    <span className="font-medium text-foreground">Clique para selecionar</span> ou arraste um arquivo XML
                                </>
                            )}
                            <span className="block text-xs text-muted-foreground mt-1">
                                Tamanho máximo: 10MB
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            {error && (
                <InfoBox type="error" title="Erro">
                    {error}
                </InfoBox>
            )}

            {file && !result && (
                <FormButton
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Processando...' : 'Processar XML'}
                </FormButton>
            )}

            {/* Result Section */}
            {result && (
                <Card className="overflow-hidden p-0">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                        <h3 className="text-xl font-bold">✓ XML Processado com Sucesso</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Chave de Acesso */}
                        <div className="bg-muted/50 rounded p-4 border border-border">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Chave de Acesso</h4>
                            <p className="font-mono text-sm break-all text-foreground">{result.chave || 'Não encontrada'}</p>
                        </div>

                        {/* Grid de Informações */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="border border-border rounded p-4">
                                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Emitente</h4>
                                <p className="text-lg font-bold text-primary">
                                    {result.emitCNPJ || 'Não informado'}
                                </p>
                                {result.emit && (
                                    <div className="mt-2 text-sm text-foreground">
                                        <p>{result.emit.xNome}</p>
                                        {result.emit.enderEmit && (
                                            <p className="text-muted-foreground">
                                                {result.emit.enderEmit.xMun} - {result.emit.enderEmit.UF}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border border-border rounded p-4">
                                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Destinatário</h4>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {result.destCNPJ || 'Não informado'}
                                </p>
                                {result.dest && (
                                    <div className="mt-2 text-sm text-foreground">
                                        <p>{result.dest.xNome}</p>
                                        {result.dest.enderDest && (
                                            <p className="text-muted-foreground">
                                                {result.dest.enderDest.xMun} - {result.dest.enderDest.UF}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border border-green-200 dark:border-green-800 rounded p-4 bg-green-50 dark:bg-green-900/20">
                                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Valor Total</h4>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    {result.valorTotal
                                        ? new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(result.valorTotal)
                                        : 'R$ 0,00'}
                                </p>
                            </div>

                            <div className="border border-purple-200 dark:border-purple-800 rounded p-4 bg-purple-50 dark:bg-purple-900/20">
                                <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">Quantidade de Itens</h4>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                    {result.itensCount || 0}
                                </p>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                            <FormButton
                                onClick={downloadJson}
                                className="flex-1"
                            >
                                ⬇ Baixar JSON
                            </FormButton>
                            <FormButton
                                onClick={() => {
                                    setResult(null);
                                    setFile(null);
                                }}
                                variant="secondary"
                                className="flex-1"
                            >
                                Processar Outro XML
                            </FormButton>
                        </div>

                        {/* JSON Completo (Colapsável) */}
                        <details className="border border-border rounded overflow-hidden">
                            <summary className="p-3 bg-muted cursor-pointer hover:bg-muted/80 transition font-semibold text-foreground">
                                Ver JSON Completo
                            </summary>
                            <div className="p-4 bg-muted/30 max-h-96 overflow-auto">
                                <pre className="text-xs font-mono text-foreground">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                </Card>
            )}
        </div>
    );
}
