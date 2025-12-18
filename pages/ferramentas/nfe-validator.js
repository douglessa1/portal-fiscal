export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock } from '../../components/Permissions/FeatureLock';
import { useState } from 'react';
import { ShieldCheck, Upload, Download, Lock, AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { parseNFeXML, formatCNPJ, formatChaveAcesso, formatDate } from '../../lib/nfeParser';

// Validações
function validateNFe(nfeData) {
    const validations = [];

    // Chave de acesso
    if (!nfeData.chaveAcesso || nfeData.chaveAcesso.length !== 44) {
        validations.push({ field: 'Chave de Acesso', status: 'error', message: 'Chave de acesso inválida (deve ter 44 dígitos)' });
    } else {
        validations.push({ field: 'Chave de Acesso', status: 'success', message: 'Chave de acesso válida' });
    }

    // Protocolo de autorização
    if (nfeData.protocolo?.nProt) {
        if (nfeData.protocolo.cStat === '100') {
            validations.push({ field: 'Autorização SEFAZ', status: 'success', message: `Autorizada - Protocolo ${nfeData.protocolo.nProt}` });
        } else {
            validations.push({ field: 'Autorização SEFAZ', status: 'warning', message: `Status ${nfeData.protocolo.cStat}: ${nfeData.protocolo.xMotivo}` });
        }
    } else {
        validations.push({ field: 'Autorização SEFAZ', status: 'warning', message: 'Protocolo não encontrado - XML pode não estar autorizado' });
    }

    // Emitente
    if (!nfeData.emitente.CNPJ && !nfeData.emitente.CPF) {
        validations.push({ field: 'Emitente', status: 'error', message: 'CNPJ/CPF do emitente não informado' });
    } else {
        const doc = nfeData.emitente.CNPJ || nfeData.emitente.CPF;
        const isValidCNPJ = doc.length === 14;
        const isValidCPF = doc.length === 11;
        if (isValidCNPJ || isValidCPF) {
            validations.push({ field: 'Emitente', status: 'success', message: `${isValidCNPJ ? 'CNPJ' : 'CPF'} do emitente válido` });
        } else {
            validations.push({ field: 'Emitente', status: 'error', message: 'CNPJ/CPF do emitente com formato inválido' });
        }
    }

    // IE Emitente
    if (!nfeData.emitente.IE) {
        validations.push({ field: 'IE Emitente', status: 'warning', message: 'Inscrição Estadual não informada' });
    } else {
        validations.push({ field: 'IE Emitente', status: 'success', message: 'Inscrição Estadual informada' });
    }

    // Destinatário
    if (nfeData.destinatario) {
        if (!nfeData.destinatario.CNPJ && !nfeData.destinatario.CPF) {
            validations.push({ field: 'Destinatário', status: 'warning', message: 'CNPJ/CPF do destinatário não informado' });
        } else {
            validations.push({ field: 'Destinatário', status: 'success', message: 'Destinatário identificado corretamente' });
        }
    }

    // Produtos
    if (!nfeData.produtos || nfeData.produtos.length === 0) {
        validations.push({ field: 'Produtos', status: 'error', message: 'Nenhum produto informado' });
    } else {
        // Verificar NCM
        const prodsSemNCM = nfeData.produtos.filter(p => !p.NCM || p.NCM.length !== 8);
        if (prodsSemNCM.length > 0) {
            validations.push({ field: 'NCM', status: 'warning', message: `${prodsSemNCM.length} produto(s) com NCM inválido ou não informado` });
        } else {
            validations.push({ field: 'NCM', status: 'success', message: 'Todos os produtos com NCM válido' });
        }

        // Verificar CFOP
        const prodsSemCFOP = nfeData.produtos.filter(p => !p.CFOP || p.CFOP.length !== 4);
        if (prodsSemCFOP.length > 0) {
            validations.push({ field: 'CFOP', status: 'warning', message: `${prodsSemCFOP.length} produto(s) com CFOP inválido` });
        } else {
            validations.push({ field: 'CFOP', status: 'success', message: 'Todos os produtos com CFOP válido' });
        }

        // Verificar valores
        const prodsSemValor = nfeData.produtos.filter(p => !p.vProd || p.vProd <= 0);
        if (prodsSemValor.length > 0) {
            validations.push({ field: 'Valores', status: 'warning', message: `${prodsSemValor.length} produto(s) sem valor` });
        } else {
            validations.push({ field: 'Valores', status: 'success', message: 'Todos os produtos com valores informados' });
        }
    }

    // Totais
    const somaProds = nfeData.produtos.reduce((s, p) => s + p.vProd, 0);
    const diffTotal = Math.abs(somaProds - nfeData.totais.vProd);
    if (diffTotal > 0.01) {
        validations.push({ field: 'Soma Produtos', status: 'error', message: `Diferença de R$ ${diffTotal.toFixed(2)} entre soma e total` });
    } else {
        validations.push({ field: 'Soma Produtos', status: 'success', message: 'Soma dos produtos confere com total' });
    }

    // Valor NF
    const calculatedTotal = nfeData.totais.vProd + nfeData.totais.vFrete + nfeData.totais.vSeg + nfeData.totais.vOutro + nfeData.totais.vIPI + nfeData.totais.vST - nfeData.totais.vDesc;
    const diffNF = Math.abs(calculatedTotal - nfeData.totais.vNF);
    if (diffNF > 0.02) {
        validations.push({ field: 'Valor Total NF', status: 'warning', message: `Diferença de R$ ${diffNF.toFixed(2)} no cálculo do total` });
    } else {
        validations.push({ field: 'Valor Total NF', status: 'success', message: 'Valor total da NF confere' });
    }

    return validations;
}

function NFeValidatorPageContent() {
    const [xmlContent, setXmlContent] = useState('');
    const [nfeData, setNfeData] = useState(null);
    const [validations, setValidations] = useState([]);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');

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
            setValidations(validateNFe(result));
        } else {
            setError(result.error || 'Erro ao processar XML');
            setNfeData(null);
            setValidations([]);
        }
    };

    const stats = {
        success: validations.filter(v => v.status === 'success').length,
        warning: validations.filter(v => v.status === 'warning').length,
        error: validations.filter(v => v.status === 'error').length
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const StatusIcon = ({ status }) => {
        if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />;
        if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-600" />;
        return <XCircle className="w-4 h-4 text-red-600" />;
    };

    return (
        <ToolLayout title="Validador NF-e" description="Valide XMLs de NF-e">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Validador NF-e</h1>
                        <p className="text-sm text-muted-foreground">Valide estrutura, campos obrigatórios e cálculos</p>
                    </div>
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
                                        <p className="text-xs text-green-600">NF-e {nfeData.identificacao.nNF} validada</p>
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

                        {/* Validation Results */}
                        {validations.length > 0 && (
                            <div className="space-y-4">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.success}</div>
                                        <div className="text-xs text-green-600">Validações OK</div>
                                    </div>
                                    <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.warning}</div>
                                        <div className="text-xs text-amber-600">Alertas</div>
                                    </div>
                                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.error}</div>
                                        <div className="text-xs text-red-600">Erros</div>
                                    </div>
                                </div>

                                {/* Validation List */}
                                <div className="bg-card border border-border rounded-xl overflow-hidden">
                                    <div className="bg-muted px-4 py-2 border-b border-border flex justify-between items-center">
                                        <span className="text-sm font-semibold text-foreground">Resultado da Validação</span>
                                        <FeatureLock featureId="pdf_export" showUpgrade={false} fallback={
                                            <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                                <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                            </button>
                                        }>
                                            <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Download className="w-3.5 h-3.5" /> PDF
                                            </button>
                                        </FeatureLock>
                                    </div>
                                    <div className="divide-y divide-border/50">
                                        {validations.map((v, idx) => (
                                            <div key={idx} className={`flex items-start gap-3 p-3 ${v.status === 'error' ? 'bg-red-50/50 dark:bg-red-900/10'
                                                : v.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/10'
                                                    : ''
                                                }`}>
                                                <StatusIcon status={v.status} />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-foreground">{v.field}</div>
                                                    <div className="text-xs text-muted-foreground">{v.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                        <span className="text-muted-foreground">Emissão</span>
                                        <span className="font-medium">{formatDate(nfeData.identificacao.dhEmi)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Emitente</span>
                                        <span className="font-medium text-xs truncate max-w-[120px]" title={nfeData.emitente.xNome}>{nfeData.emitente.xNome}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold text-green-600">{fmt(nfeData.totais.vNF)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-sm text-emerald-800 dark:text-emerald-200">
                            <h4 className="font-semibold mb-2">📋 Validações</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Chave de acesso</li>
                                <li>• Protocolo SEFAZ</li>
                                <li>• Emitente/Destinatário</li>
                                <li>• NCM e CFOP</li>
                                <li>• Cálculo de totais</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function NFeValidatorPage() {
    return (
        <AuthGate>
            <NFeValidatorPageContent />
        </AuthGate>
    );
}
