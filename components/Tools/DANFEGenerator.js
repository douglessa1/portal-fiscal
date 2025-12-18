import { useState } from 'react';
import { FormButton, Card, InfoBox } from '../ui/FormComponents';

export default function DANFEGenerator() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [processando, setProcessando] = useState(false);
    const [progresso, setProgresso] = useState({ atual: 0, total: 0 });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validar arquivos
        const xmlFiles = selectedFiles.filter(f => f.name.endsWith('.xml'));

        if (xmlFiles.length === 0) {
            setErro('Selecione apenas arquivos XML');
            return;
        }

        if (xmlFiles.length > 50) {
            setErro('Máximo de 50 arquivos por vez');
            return;
        }

        setFiles(xmlFiles);
        setErro(null);
    };

    const handleGerarUnico = async (index) => {
        const file = files[index];
        setLoading(true);
        setErro(null);

        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const xmlContent = e.target.result;

                const response = await fetch('/api/tools/danfe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ xml: xmlContent })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Erro ao gerar DANFE');
                }

                // Receber PDF como blob
                const blob = await response.blob();

                // Download automático
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `DANFE_${file.name.replace('.xml', '.pdf')}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

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

    const handleGerarLote = async () => {
        setProcessando(true);
        setErro(null);
        setProgresso({ atual: 0, total: files.length });

        const erros = [];

        for (let i = 0; i < files.length; i++) {
            try {
                setProgresso({ atual: i + 1, total: files.length });

                const file = files[i];
                const reader = new FileReader();

                await new Promise((resolve, reject) => {
                    reader.onload = async (e) => {
                        try {
                            const xmlContent = e.target.result;

                            const response = await fetch('/api/tools/danfe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ xml: xmlContent })
                            });

                            if (!response.ok) {
                                throw new Error(`Erro no arquivo ${file.name}`);
                            }

                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `DANFE_${file.name.replace('.xml', '.pdf')}`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);

                            // Pequeno delay entre downloads
                            await new Promise(r => setTimeout(r, 500));

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    };

                    reader.onerror = reject;
                    reader.readAsText(file);
                });
            } catch (error) {
                erros.push(`${files[i].name}: ${error.message}`);
            }
        }

        setProcessando(false);

        if (erros.length > 0) {
            setErro(`Erros em ${erros.length} arquivo(s):\n${erros.join('\n')}`);
        }
    };

    const handleLimpar = () => {
        setFiles([]);
        setErro(null);
        setProgresso({ atual: 0, total: 0 });
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors bg-muted/20">
                <input
                    type="file"
                    accept=".xml"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="danfe-upload"
                />
                <label htmlFor="danfe-upload" className="cursor-pointer block">
                    <div className="text-5xl mb-4">📄</div>
                    <div className="text-lg font-semibold text-foreground mb-2">
                        {files.length > 0
                            ? <span className="text-primary">{files.length} arquivo(s) selecionado(s)</span>
                            : 'Clique para selecionar XML(s) de NFe'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Até 50 arquivos XML por vez
                    </div>
                </label>
            </div>

            {/* Error */}
            {erro && (
                <InfoBox type="error" title="Erro">
                    <div className="whitespace-pre-line">{erro}</div>
                </InfoBox>
            )}

            {/* Files List */}
            {files.length > 0 && !processando && (
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-foreground">
                            Arquivos Carregados ({files.length})
                        </h3>
                        <FormButton
                            onClick={handleLimpar}
                            variant="destructive"
                            className="h-8 px-3 text-sm py-0"
                        >
                            Limpar Todos
                        </FormButton>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded border border-border">
                                <div className="flex-1 mr-4">
                                    <div className="font-medium text-sm text-foreground truncate">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </div>
                                </div>
                                <FormButton
                                    onClick={() => handleGerarUnico(idx)}
                                    disabled={loading}
                                    className="h-8 px-3 text-xs"
                                >
                                    {loading ? 'Gerando...' : 'Gerar PDF'}
                                </FormButton>
                            </div>
                        ))}
                    </div>

                    {/* Batch Actions */}
                    {files.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <FormButton
                                onClick={handleGerarLote}
                                disabled={loading || processando}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                                Gerar Todos os DANFEs ({files.length})
                            </FormButton>
                        </div>
                    )}
                </Card>
            )}

            {/* Progress */}
            {processando && (
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                        Processando em Lote...
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progresso</span>
                            <span>{progresso.atual} de {progresso.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(progresso.atual / progresso.total) * 100}%` }}
                            />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            {Math.round((progresso.atual / progresso.total) * 100)}% concluído
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
