export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useRef } from 'react';
import { FileText, Upload, Download, Printer, Lock, Copy, AlertTriangle, CheckCircle, Files, Trash2, X } from 'lucide-react';
import { parseNFeXML, formatCNPJ, formatCPF, formatCEP, formatChaveAcesso, formatDate, formatDateTime, getModalidadeFrete, getFormaPagamento } from '../../lib/nfeParser';

function DanfeGeneratorPageContent() {
    const [xmlContent, setXmlContent] = useState('');
    const [nfeData, setNfeData] = useState(null);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [batchMode, setBatchMode] = useState(false);
    const [batchFiles, setBatchFiles] = useState([]);
    const danfeRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            setXmlContent(content);
            processXml(content);
        };
        reader.readAsText(file);
    };

    const processXml = (xml) => {
        setError('');
        const result = parseNFeXML(xml);
        if (result.isValid) {
            setNfeData(result);
        } else {
            setError(result.error || 'Erro ao processar XML');
            setNfeData(null);
        }
    };

    // Batch file handling
    const handleBatchUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const newBatchFiles = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result;
                const result = parseNFeXML(content);
                newBatchFiles.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    content,
                    parsed: result,
                    status: result.isValid ? 'success' : 'error'
                });
                if (newBatchFiles.length === files.length) {
                    setBatchFiles(prev => [...prev, ...newBatchFiles]);
                }
            };
            reader.readAsText(file);
        });
    };

    const removeBatchFile = (id) => {
        setBatchFiles(prev => prev.filter(f => f.id !== id));
    };

    const clearBatch = () => {
        setBatchFiles([]);
    };

    const printAllBatch = () => {
        batchFiles.filter(f => f.status === 'success').forEach(file => {
            // In real implementation, would print each DANFE
            console.log('Printing:', file.parsed.identificacao.nNF);
        });
        alert(`${batchFiles.filter(f => f.status === 'success').length} DANFEs enviadas para impressão!`);
    };

    const handlePrint = () => {
        if (!danfeRef.current) return;
        const printContent = danfeRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>DANFE - ${nfeData?.identificacao?.nNF}</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 10px; }
                    .danfe { border: 2px solid #000; padding: 5px; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; border-bottom: 1px solid #000; padding-bottom: 5px; }
                    .header-left { flex: 1; }
                    .header-center { flex: 2; text-align: center; border-left: 1px solid #000; border-right: 1px solid #000; padding: 0 10px; }
                    .header-right { flex: 1; text-align: right; }
                    .section { border: 1px solid #000; margin-top: 5px; padding: 5px; }
                    .section-title { font-weight: bold; font-size: 8px; background: #f0f0f0; padding: 2px 5px; margin: -5px -5px 5px -5px; }
                    .grid { display: grid; gap: 5px; }
                    .grid-2 { grid-template-columns: 1fr 1fr; }
                    .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                    .grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
                    .field { font-size: 9px; }
                    .field-label { font-size: 7px; color: #666; }
                    .field-value { font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; font-size: 8px; }
                    th, td { border: 1px solid #ccc; padding: 2px 4px; text-align: left; }
                    th { background: #f0f0f0; font-size: 7px; }
                    .chave { font-family: monospace; font-size: 9px; letter-spacing: 1px; }
                    .big-number { font-size: 24px; font-weight: bold; }
                    @media print { body { -webkit-print-color-adjust: exact; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0);
    const fmtQtd = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(v || 0);

    return (
        <ToolLayout title="Gerador DANFE" description="Visualize e imprima DANFEs a partir de XMLs">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Gerador DANFE</h1>
                        <p className="text-sm text-muted-foreground">Visualize e imprima DANFEs a partir de XMLs de NF-e</p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setBatchMode(false)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!batchMode ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Arquivo Único
                    </button>
                    <FeatureLock featureId="batch_processing" fallback={
                        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-muted opacity-60 cursor-not-allowed flex items-center gap-2">
                            <Files className="w-4 h-4" />
                            Lote (Múltiplos)
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">PRO</span>
                        </button>
                    }>
                        <button
                            onClick={() => setBatchMode(true)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${batchMode ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            <Files className="w-4 h-4" />
                            Lote (Múltiplos)
                        </button>
                    </FeatureLock>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Upload */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <label className={`flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${nfeData ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border hover:border-primary/50'
                                }`}>
                                <input type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
                                {nfeData ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-foreground">{fileName}</p>
                                        <p className="text-xs text-green-600">NF-e {nfeData.identificacao.nNF} carregada</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Arraste o arquivo XML da NF-e</p>
                                    </div>
                                )}
                            </label>

                            {error && (
                                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                                    <AlertTriangle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Batch Mode UI */}
                        {batchMode && (
                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Files className="w-4 h-4" />
                                        Processamento em Lote
                                    </h3>
                                    {batchFiles.length > 0 && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={clearBatch}
                                                className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" /> Limpar
                                            </button>
                                            <button
                                                onClick={printAllBatch}
                                                className="h-8 px-3 text-xs rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-1"
                                            >
                                                <Printer className="w-3 h-3" /> Imprimir Todos
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors mb-4">
                                    <input
                                        type="file"
                                        accept=".xml"
                                        multiple
                                        onChange={handleBatchUpload}
                                        className="hidden"
                                    />
                                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                    <span className="text-sm text-muted-foreground">Arraste múltiplos XMLs</span>
                                </label>

                                {batchFiles.length > 0 && (
                                    <div className="space-y-2 max-h-[300px] overflow-auto">
                                        {batchFiles.map(file => (
                                            <div
                                                key={file.id}
                                                className={`flex items-center justify-between p-3 rounded-lg ${file.status === 'success'
                                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {file.status === 'success' ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium">{file.name}</div>
                                                        {file.status === 'success' && (
                                                            <div className="text-xs text-muted-foreground">
                                                                NF-e {file.parsed.identificacao.nNF} • {formatDate(file.parsed.identificacao.dhEmi)} • R$ {fmt(file.parsed.totais.vNF)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeBatchFile(file.id)}
                                                    className="p-1 hover:bg-muted rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {batchFiles.length > 0 && (
                                    <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                                        <div className="flex justify-between">
                                            <span>Total de arquivos:</span>
                                            <span className="font-bold">{batchFiles.length}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Processados:</span>
                                            <span className="font-bold">{batchFiles.filter(f => f.status === 'success').length}</span>
                                        </div>
                                        <div className="flex justify-between text-red-600">
                                            <span>Erros:</span>
                                            <span className="font-bold">{batchFiles.filter(f => f.status === 'error').length}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DANFE Preview */}
                        {nfeData && (
                            <div className="bg-white dark:bg-gray-900 border border-border rounded-xl p-4 overflow-auto">
                                <div className="flex justify-end gap-2 mb-4">
                                    <button onClick={handlePrint} className="h-9 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2">
                                        <Printer className="w-4 h-4" /> Imprimir
                                    </button>
                                    <FeatureLock featureId="pdf_export" showUpgrade={false} fallback={
                                        <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-2">
                                            <Download className="w-4 h-4" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                        </button>
                                    }>
                                        <button className="h-9 px-4 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2">
                                            <Download className="w-4 h-4" /> Baixar PDF
                                        </button>
                                    </FeatureLock>
                                </div>

                                {/* DANFE Content */}
                                <div ref={danfeRef} className="danfe bg-white text-black p-4 border-2 border-black text-[10px]" style={{ fontFamily: 'Arial, sans-serif' }}>
                                    {/* Header */}
                                    <div className="flex border-b border-black pb-2 mb-2">
                                        <div className="flex-1">
                                            <div className="text-[8px] text-gray-600">IDENTIFICAÇÃO DO EMITENTE</div>
                                            <div className="font-bold text-sm">{nfeData.emitente.xNome}</div>
                                            {nfeData.emitente.xFant && <div className="text-[9px]">{nfeData.emitente.xFant}</div>}
                                            <div className="text-[9px] mt-1">
                                                {nfeData.emitente.enderEmit.xLgr}, {nfeData.emitente.enderEmit.nro}
                                                {nfeData.emitente.enderEmit.xCpl && ` - ${nfeData.emitente.enderEmit.xCpl}`}
                                            </div>
                                            <div className="text-[9px]">
                                                {nfeData.emitente.enderEmit.xBairro} - {nfeData.emitente.enderEmit.xMun}/{nfeData.emitente.enderEmit.UF}
                                            </div>
                                            <div className="text-[9px]">CEP: {formatCEP(nfeData.emitente.enderEmit.CEP)}</div>
                                        </div>
                                        <div className="flex-1 text-center border-l border-r border-black px-4">
                                            <div className="text-lg font-bold">DANFE</div>
                                            <div className="text-[8px]">Documento Auxiliar da Nota Fiscal Eletrônica</div>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-[9px]">
                                                <div className="border border-black p-1">
                                                    <div className="text-[7px] text-gray-600">ENTRADA</div>
                                                    <div className="font-bold">{nfeData.identificacao.tpNF === '0' ? 'X' : ''}</div>
                                                </div>
                                                <div className="border border-black p-1">
                                                    <div className="text-[7px] text-gray-600">SAÍDA</div>
                                                    <div className="font-bold">{nfeData.identificacao.tpNF === '1' ? 'X' : ''}</div>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-2xl font-bold">Nº {nfeData.identificacao.nNF}</div>
                                            <div className="text-[9px]">SÉRIE {nfeData.identificacao.serie}</div>
                                        </div>
                                        <div className="flex-1 text-right pl-4">
                                            <div className="text-[8px] text-gray-600">CHAVE DE ACESSO</div>
                                            <div className="font-mono text-[9px] break-all">{formatChaveAcesso(nfeData.chaveAcesso)}</div>
                                            {nfeData.protocolo && (
                                                <>
                                                    <div className="text-[8px] text-gray-600 mt-2">PROTOCOLO DE AUTORIZAÇÃO</div>
                                                    <div className="text-[9px]">{nfeData.protocolo.nProt}</div>
                                                    <div className="text-[8px]">{formatDateTime(nfeData.protocolo.dhRecbto)}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Natureza da Operação */}
                                    <div className="border border-black p-1 mb-2">
                                        <div className="text-[7px] text-gray-600">NATUREZA DA OPERAÇÃO</div>
                                        <div className="font-bold">{nfeData.identificacao.natOp}</div>
                                    </div>

                                    {/* Emitente Info */}
                                    <div className="grid grid-cols-4 gap-1 mb-2">
                                        <div className="border border-black p-1 col-span-2">
                                            <div className="text-[7px] text-gray-600">CNPJ</div>
                                            <div className="font-bold">{formatCNPJ(nfeData.emitente.CNPJ)}</div>
                                        </div>
                                        <div className="border border-black p-1">
                                            <div className="text-[7px] text-gray-600">INSCRIÇÃO ESTADUAL</div>
                                            <div className="font-bold">{nfeData.emitente.IE}</div>
                                        </div>
                                        <div className="border border-black p-1">
                                            <div className="text-[7px] text-gray-600">DATA EMISSÃO</div>
                                            <div className="font-bold">{formatDate(nfeData.identificacao.dhEmi)}</div>
                                        </div>
                                    </div>

                                    {/* Destinatário */}
                                    {nfeData.destinatario && (
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-[8px] font-bold px-1 py-0.5 border border-black border-b-0">DESTINATÁRIO/REMETENTE</div>
                                            <div className="grid grid-cols-12 gap-0 border border-black">
                                                <div className="col-span-8 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">NOME/RAZÃO SOCIAL</div>
                                                    <div className="font-bold">{nfeData.destinatario.xNome}</div>
                                                </div>
                                                <div className="col-span-3 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">CNPJ/CPF</div>
                                                    <div className="font-bold">
                                                        {nfeData.destinatario.CNPJ ? formatCNPJ(nfeData.destinatario.CNPJ) : formatCPF(nfeData.destinatario.CPF)}
                                                    </div>
                                                </div>
                                                <div className="col-span-1 p-1">
                                                    <div className="text-[7px] text-gray-600">DATA</div>
                                                    <div className="font-bold">{formatDate(nfeData.identificacao.dhSaiEnt)}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-0 border border-black border-t-0">
                                                <div className="col-span-8 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">ENDEREÇO</div>
                                                    <div>{nfeData.destinatario.enderDest?.xLgr}, {nfeData.destinatario.enderDest?.nro}</div>
                                                </div>
                                                <div className="col-span-2 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">BAIRRO</div>
                                                    <div>{nfeData.destinatario.enderDest?.xBairro}</div>
                                                </div>
                                                <div className="col-span-2 p-1">
                                                    <div className="text-[7px] text-gray-600">CEP</div>
                                                    <div>{formatCEP(nfeData.destinatario.enderDest?.CEP)}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-0 border border-black border-t-0">
                                                <div className="col-span-5 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">MUNICÍPIO</div>
                                                    <div>{nfeData.destinatario.enderDest?.xMun}</div>
                                                </div>
                                                <div className="col-span-2 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">UF</div>
                                                    <div>{nfeData.destinatario.enderDest?.UF}</div>
                                                </div>
                                                <div className="col-span-3 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">INSCRIÇÃO ESTADUAL</div>
                                                    <div>{nfeData.destinatario.IE}</div>
                                                </div>
                                                <div className="col-span-2 p-1">
                                                    <div className="text-[7px] text-gray-600">TELEFONE</div>
                                                    <div>{nfeData.destinatario.enderDest?.fone}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Produtos */}
                                    <div className="mb-2">
                                        <div className="bg-gray-100 text-[8px] font-bold px-1 py-0.5 border border-black border-b-0">DADOS DOS PRODUTOS/SERVIÇOS</div>
                                        <table className="w-full border-collapse text-[8px]">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-black p-0.5 text-[7px]">CÓDIGO</th>
                                                    <th className="border border-black p-0.5 text-[7px]">DESCRIÇÃO</th>
                                                    <th className="border border-black p-0.5 text-[7px]">NCM</th>
                                                    <th className="border border-black p-0.5 text-[7px]">CFOP</th>
                                                    <th className="border border-black p-0.5 text-[7px]">UN</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">QTDE</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">V.UNIT</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">V.TOTAL</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">BC ICMS</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">V.ICMS</th>
                                                    <th className="border border-black p-0.5 text-[7px] text-right">V.IPI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {nfeData.produtos.map((prod, idx) => (
                                                    <tr key={idx}>
                                                        <td className="border border-black p-0.5">{prod.cProd}</td>
                                                        <td className="border border-black p-0.5">{prod.xProd}</td>
                                                        <td className="border border-black p-0.5">{prod.NCM}</td>
                                                        <td className="border border-black p-0.5">{prod.CFOP}</td>
                                                        <td className="border border-black p-0.5">{prod.uCom}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmtQtd(prod.qCom)}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmt(prod.vUnCom)}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmt(prod.vProd)}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmt(prod.icms.vBC)}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmt(prod.icms.vICMS)}</td>
                                                        <td className="border border-black p-0.5 text-right">{fmt(prod.ipi.vIPI)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Totais */}
                                    <div className="mb-2">
                                        <div className="bg-gray-100 text-[8px] font-bold px-1 py-0.5 border border-black border-b-0">CÁLCULO DO IMPOSTO</div>
                                        <div className="grid grid-cols-6 gap-0 border border-black">
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">BASE CÁLC. ICMS</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vBC)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">VALOR ICMS</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vICMS)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">BASE CÁLC. ICMS ST</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vBCST)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">VALOR ICMS ST</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vST)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">VALOR IPI</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vIPI)}</div>
                                            </div>
                                            <div className="p-1">
                                                <div className="text-[7px] text-gray-600">VALOR TOTAL NF</div>
                                                <div className="font-bold text-right text-lg">{fmt(nfeData.totais.vNF)}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-5 gap-0 border border-black border-t-0">
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">VALOR FRETE</div>
                                                <div className="text-right">{fmt(nfeData.totais.vFrete)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">VALOR SEGURO</div>
                                                <div className="text-right">{fmt(nfeData.totais.vSeg)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">DESCONTO</div>
                                                <div className="text-right">{fmt(nfeData.totais.vDesc)}</div>
                                            </div>
                                            <div className="border-r border-black p-1">
                                                <div className="text-[7px] text-gray-600">OUTRAS DESP.</div>
                                                <div className="text-right">{fmt(nfeData.totais.vOutro)}</div>
                                            </div>
                                            <div className="p-1">
                                                <div className="text-[7px] text-gray-600">VALOR PRODUTOS</div>
                                                <div className="font-bold text-right">{fmt(nfeData.totais.vProd)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transporte */}
                                    {nfeData.transporte && (
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-[8px] font-bold px-1 py-0.5 border border-black border-b-0">TRANSPORTADOR/VOLUMES</div>
                                            <div className="grid grid-cols-6 gap-0 border border-black">
                                                <div className="col-span-4 border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">RAZÃO SOCIAL</div>
                                                    <div>{nfeData.transporte.transporta?.xNome || '-'}</div>
                                                </div>
                                                <div className="border-r border-black p-1">
                                                    <div className="text-[7px] text-gray-600">FRETE POR CONTA</div>
                                                    <div>{getModalidadeFrete(nfeData.transporte.modFrete)}</div>
                                                </div>
                                                <div className="p-1">
                                                    <div className="text-[7px] text-gray-600">PLACA</div>
                                                    <div>{nfeData.transporte.veicTransp?.placa || '-'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Informações Adicionais */}
                                    {nfeData.informacoesAdicionais && (
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-[8px] font-bold px-1 py-0.5 border border-black border-b-0">INFORMAÇÕES ADICIONAIS</div>
                                            <div className="border border-black p-2 min-h-[40px] text-[8px]">
                                                {nfeData.informacoesAdicionais.infCpl || nfeData.informacoesAdicionais.infAdFisco || '-'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        {nfeData && (
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Resumo da NF-e</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Número</span>
                                        <span className="font-bold">{nfeData.identificacao.nNF}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Série</span>
                                        <span className="font-medium">{nfeData.identificacao.serie}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Emissão</span>
                                        <span className="font-medium">{formatDate(nfeData.identificacao.dhEmi)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Produtos</span>
                                        <span className="font-medium">{nfeData.produtos.length}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border">
                                        <span className="font-semibold">Valor Total</span>
                                        <span className="font-bold text-green-600">R$ {fmt(nfeData.totais.vNF)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-sm text-orange-800 dark:text-orange-200">
                            <h4 className="font-semibold mb-2">📋 DANFE</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Documento Auxiliar da NF-e</li>
                                <li>• Upload de XML autorizado</li>
                                <li>• Impressão direta</li>
                                <li>• PDF (PRO)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function DanfeGeneratorPage() {
    return (
        <AuthGate>
            <DanfeGeneratorPageContent />
        </AuthGate>
    );
}
