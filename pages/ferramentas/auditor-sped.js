export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock } from '../../components/Permissions/FeatureLock';
import { useState } from 'react';
import { ShieldCheck, Upload, Download, FileText, AlertTriangle, CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import { parseSpedFile, generateValidationReport, formatCNPJ, formatSpedDate } from '../../lib/spedParser';

export default function AuditorSpedPage() {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setError('');

        try {
            const content = await file.text();
            setFileContent(content);

            // Parse file
            const parseResult = parseSpedFile(content);
            const validationReport = generateValidationReport(parseResult);
            setReport(validationReport);
        } catch (err) {
            setError('Erro ao processar arquivo: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const StatusIcon = ({ status }) => {
        if (status === 'VÁLIDO') return <CheckCircle className="w-5 h-5 text-green-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

    return (
        <ToolLayout title="Auditor SPED" description="Audite arquivos SPED EFD ICMS/IPI">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Auditor SPED Fiscal</h1>
                        <p className="text-sm text-muted-foreground">Valide e audite arquivos SPED EFD ICMS/IPI</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Upload */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <label className={`flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${report ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border hover:border-primary/50'
                                }`}>
                                <input type="file" accept=".txt,.sped" onChange={handleFileUpload} className="hidden" />
                                {loading ? (
                                    <div className="text-center">
                                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Processando arquivo...</p>
                                    </div>
                                ) : report ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-foreground">{fileName}</p>
                                        <p className="text-xs text-green-600">Arquivo processado com sucesso</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Arraste o arquivo SPED (.txt)</p>
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

                        {/* Report */}
                        {report && (
                            <div className="space-y-4">
                                {/* Status */}
                                <div className={`p-4 rounded-xl border ${report.resumo.status === 'VÁLIDO'
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <StatusIcon status={report.resumo.status} />
                                        <div>
                                            <h3 className="font-semibold text-foreground">
                                                Arquivo {report.resumo.status}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {report.totalErros} erros, {report.totalAvisos} avisos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <h3 className="font-semibold text-foreground mb-4">Resumo do Arquivo</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Empresa</div>
                                            <div className="font-medium text-foreground truncate">{report.resumo.empresa}</div>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">CNPJ</div>
                                            <div className="font-medium text-foreground">{formatCNPJ(report.resumo.cnpj)}</div>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Período</div>
                                            <div className="font-medium text-foreground">{report.resumo.periodo}</div>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Total de Linhas</div>
                                            <div className="font-medium text-foreground">{report.resumo.totalLinhas.toLocaleString('pt-BR')}</div>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Documentos (C100)</div>
                                            <div className="font-medium text-foreground">{report.resumo.totalDocumentos}</div>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Itens (C170)</div>
                                            <div className="font-medium text-foreground">{report.resumo.totalItens}</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div className="text-xs text-blue-600">Valor Total Docs</div>
                                            <div className="font-bold text-blue-700 dark:text-blue-300">{fmt(report.resumo.valorTotal)}</div>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="text-xs text-green-600">ICMS Total</div>
                                            <div className="font-bold text-green-700 dark:text-green-300">{fmt(report.resumo.icmsTotal)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Apuração */}
                                {report.apuracao && (
                                    <FeatureLock featureId="calculation_memory" showUpgrade={true}>
                                        <div className="bg-card border border-border rounded-xl p-5">
                                            <h3 className="font-semibold text-foreground mb-4">Apuração ICMS (E110)</h3>
                                            <div className="grid grid-cols-3 gap-3 text-sm">
                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <div className="text-xs text-red-600">Total Débitos</div>
                                                    <div className="font-bold text-red-700 dark:text-red-300">{fmt(report.apuracao.totalDebitos)}</div>
                                                </div>
                                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="text-xs text-green-600">Total Créditos</div>
                                                    <div className="font-bold text-green-700 dark:text-green-300">{fmt(report.apuracao.totalCreditos)}</div>
                                                </div>
                                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                    <div className="text-xs text-amber-600">ICMS a Recolher</div>
                                                    <div className="font-bold text-amber-700 dark:text-amber-300">{fmt(report.apuracao.icmsRecolher)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </FeatureLock>
                                )}

                                {/* Errors and Warnings */}
                                {(report.erros.length > 0 || report.avisos.length > 0) && (
                                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border flex justify-between items-center">
                                            <span className="text-sm font-semibold text-foreground">Erros e Avisos</span>
                                        </div>
                                        <div className="max-h-60 overflow-auto divide-y divide-border/50">
                                            {report.erros.map((err, idx) => (
                                                <div key={`err-${idx}`} className="flex items-start gap-3 p-3 bg-red-50/50 dark:bg-red-900/10">
                                                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {err.registro ? `Registro ${err.registro}` : 'Erro'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{err.mensagem}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {report.avisos.map((aviso, idx) => (
                                                <div key={`aviso-${idx}`} className="flex items-start gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/10">
                                                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {aviso.bloco ? `Bloco ${aviso.bloco}` : 'Aviso'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{aviso.mensagem}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Registers */}
                                <FeatureLock featureId="calculation_memory" showUpgrade={true}>
                                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border">
                                            <span className="text-sm font-semibold text-foreground">Registros Encontrados</span>
                                        </div>
                                        <div className="max-h-80 overflow-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 sticky top-0">
                                                    <tr>
                                                        <th className="text-left px-4 py-2 font-medium text-foreground">Registro</th>
                                                        <th className="text-left px-4 py-2 font-medium text-foreground">Descrição</th>
                                                        <th className="text-right px-4 py-2 font-medium text-foreground">Qtde</th>
                                                        <th className="text-center px-4 py-2 font-medium text-foreground">Obrigatório</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/50">
                                                    {report.registros.map((reg, idx) => (
                                                        <tr key={idx} className="hover:bg-muted/30">
                                                            <td className="px-4 py-2 font-mono font-bold text-primary">{reg.registro}</td>
                                                            <td className="px-4 py-2 text-foreground">{reg.nome}</td>
                                                            <td className="px-4 py-2 text-right text-foreground">{reg.quantidade}</td>
                                                            <td className="px-4 py-2 text-center">
                                                                {reg.obrigatorio ? (
                                                                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                                                ) : (
                                                                    <span className="text-muted-foreground">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </FeatureLock>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {report && (
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Ações</h3>
                                <div className="space-y-2">
                                    <FeatureLock featureId="pdf_export" showUpgrade={false} fallback={
                                        <button className="w-full h-9 px-3 text-sm rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" /> Relatório PDF <Lock className="w-3 h-3 text-purple-500 ml-auto" />
                                        </button>
                                    }>
                                        <button className="w-full h-9 px-3 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" /> Relatório PDF
                                        </button>
                                    </FeatureLock>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
                            <h4 className="font-semibold mb-2">📋 SPED EFD</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Validação de estrutura</li>
                                <li>• Registros obrigatórios</li>
                                <li>• Blocos 0, C, D, E, G, H, K</li>
                                <li>• Apuração ICMS (E110)</li>
                                <li>• Relatório detalhado (PRO)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
