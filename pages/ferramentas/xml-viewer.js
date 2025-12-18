import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock } from '../../components/Permissions/FeatureLock';
import { useState } from 'react';
import { Code, Upload, Download, Lock, Copy, AlertTriangle, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { parseNFeXML, formatCNPJ, formatCPF, formatChaveAcesso, formatDate, formatDateTime } from '../../lib/nfeParser';

function XMLNode({ name, value, children, level = 0 }) {
    const [isOpen, setIsOpen] = useState(level < 3);
    const hasChildren = children && children.length > 0;
    const indent = level * 20;

    if (!hasChildren && value) {
        return (
            <div className="flex items-start gap-1" style={{ paddingLeft: indent }}>
                <span className="text-purple-600 dark:text-purple-400">&lt;{name}&gt;</span>
                <span className="text-foreground font-mono">{value}</span>
                <span className="text-purple-600 dark:text-purple-400">&lt;/{name}&gt;</span>
            </div>
        );
    }

    return (
        <div style={{ paddingLeft: indent }}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 hover:bg-muted/50 rounded px-1 -ml-1">
                {hasChildren && (isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />)}
                <span className="text-blue-600 dark:text-blue-400">&lt;{name}</span>
                {!hasChildren && <span className="text-blue-600 dark:text-blue-400">/&gt;</span>}
                {hasChildren && <span className="text-blue-600 dark:text-blue-400">&gt;</span>}
            </button>
            {isOpen && hasChildren && (
                <>
                    {children.map((child, idx) => (
                        <XMLNode key={idx} {...child} level={level + 1} />
                    ))}
                    <div style={{ paddingLeft: 0 }}>
                        <span className="text-blue-600 dark:text-blue-400">&lt;/{name}&gt;</span>
                    </div>
                </>
            )}
        </div>
    );
}

function parseXMLToTree(xmlString) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');

        function nodeToTree(node) {
            const children = Array.from(node.children).map(nodeToTree);
            return {
                name: node.nodeName,
                value: children.length === 0 ? node.textContent : null,
                children: children.length > 0 ? children : null
            };
        }

        return nodeToTree(doc.documentElement);
    } catch {
        return null;
    }
}

export default function XMLViewerPage() {
    const [xmlContent, setXmlContent] = useState('');
    const [xmlTree, setXmlTree] = useState(null);
    const [nfeData, setNfeData] = useState(null);
    const [viewMode, setViewMode] = useState('tree'); // tree, raw, parsed
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

        // Parse tree view
        const tree = parseXMLToTree(xml);
        if (tree) {
            setXmlTree(tree);
        }

        // Try to parse as NF-e
        const result = parseNFeXML(xml);
        if (result.isValid) {
            setNfeData(result);
        } else {
            setNfeData(null);
        }
    };

    const handlePaste = (e) => {
        const text = e.target.value;
        setXmlContent(text);
        if (text.trim()) {
            processXml(text);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(xmlContent);
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <ToolLayout title="Visualizador XML" description="Visualize e analise arquivos XML de NF-e">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl">
                        <Code className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Visualizador XML</h1>
                        <p className="text-sm text-muted-foreground">Analise XMLs de NF-e com visualização em árvore</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Upload/Paste */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <div className="flex gap-4 mb-4">
                                <label className="flex-1 flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed cursor-pointer transition-colors border-border hover:border-primary/50">
                                    <input type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
                                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Upload XML</span>
                                </label>
                                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">ou</div>
                                <div className="flex-1">
                                    <textarea
                                        placeholder="Cole o XML aqui..."
                                        value={xmlContent}
                                        onChange={handlePaste}
                                        className="w-full h-24 px-3 py-2 text-xs font-mono rounded-lg border border-input bg-background resize-none"
                                    />
                                </div>
                            </div>

                            {fileName && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    {fileName}
                                </div>
                            )}
                        </div>

                        {/* View Modes */}
                        {xmlContent && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
                                    <div className="flex gap-2">
                                        {['tree', 'raw', 'parsed'].map(mode => (
                                            <button key={mode} onClick={() => setViewMode(mode)}
                                                className={`px-3 py-1 text-xs font-medium rounded ${viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                                                {mode === 'tree' ? 'Árvore' : mode === 'raw' ? 'Raw' : 'Dados'}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={copyToClipboard} className="h-7 px-2 text-xs rounded border border-input hover:bg-muted flex items-center gap-1">
                                        <Copy className="w-3 h-3" /> Copiar
                                    </button>
                                </div>

                                <div className="p-4 max-h-[600px] overflow-auto">
                                    {viewMode === 'tree' && xmlTree && (
                                        <div className="font-mono text-xs">
                                            <XMLNode {...xmlTree} />
                                        </div>
                                    )}

                                    {viewMode === 'raw' && (
                                        <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground">{xmlContent}</pre>
                                    )}

                                    {viewMode === 'parsed' && nfeData && (
                                        <div className="space-y-4 text-sm">
                                            {/* Identificação */}
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-2">Identificação</h3>
                                                <div className="grid grid-cols-4 gap-2 text-xs">
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">Número</div>
                                                        <div className="font-bold">{nfeData.identificacao.nNF}</div>
                                                    </div>
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">Série</div>
                                                        <div className="font-bold">{nfeData.identificacao.serie}</div>
                                                    </div>
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">Data Emissão</div>
                                                        <div className="font-bold">{formatDate(nfeData.identificacao.dhEmi)}</div>
                                                    </div>
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">Natureza</div>
                                                        <div className="font-bold truncate" title={nfeData.identificacao.natOp}>{nfeData.identificacao.natOp}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Emitente */}
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-2">Emitente</h3>
                                                <div className="bg-muted/50 rounded p-3">
                                                    <div className="font-bold">{nfeData.emitente.xNome}</div>
                                                    <div className="text-xs text-muted-foreground">CNPJ: {formatCNPJ(nfeData.emitente.CNPJ)}</div>
                                                    <div className="text-xs text-muted-foreground">{nfeData.emitente.enderEmit.xMun}/{nfeData.emitente.enderEmit.UF}</div>
                                                </div>
                                            </div>

                                            {/* Destinatário */}
                                            {nfeData.destinatario && (
                                                <div>
                                                    <h3 className="font-semibold text-foreground mb-2">Destinatário</h3>
                                                    <div className="bg-muted/50 rounded p-3">
                                                        <div className="font-bold">{nfeData.destinatario.xNome}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {nfeData.destinatario.CNPJ ? `CNPJ: ${formatCNPJ(nfeData.destinatario.CNPJ)}` : `CPF: ${formatCPF(nfeData.destinatario.CPF)}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Totais */}
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-2">Totais</h3>
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">Produtos</div>
                                                        <div className="font-bold">{fmt(nfeData.totais.vProd)}</div>
                                                    </div>
                                                    <div className="bg-muted/50 rounded p-2">
                                                        <div className="text-muted-foreground">ICMS</div>
                                                        <div className="font-bold">{fmt(nfeData.totais.vICMS)}</div>
                                                    </div>
                                                    <div className="bg-green-100 dark:bg-green-900/30 rounded p-2">
                                                        <div className="text-green-700 dark:text-green-300">Total NF</div>
                                                        <div className="font-bold text-green-700 dark:text-green-300">{fmt(nfeData.totais.vNF)}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Produtos */}
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-2">Produtos ({nfeData.produtos.length})</h3>
                                                <div className="space-y-1">
                                                    {nfeData.produtos.slice(0, 10).map((prod, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
                                                            <div className="flex-1 truncate">{prod.xProd}</div>
                                                            <div className="font-mono ml-2">{fmt(prod.vProd)}</div>
                                                        </div>
                                                    ))}
                                                    {nfeData.produtos.length > 10 && (
                                                        <div className="text-xs text-muted-foreground text-center py-1">
                                                            + {nfeData.produtos.length - 10} produtos
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {viewMode === 'parsed' && !nfeData && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Este XML não é uma NF-e válida</p>
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
                                <h3 className="text-sm font-semibold text-foreground mb-3">Chave de Acesso</h3>
                                <div className="font-mono text-xs break-all bg-muted/50 rounded p-2">{formatChaveAcesso(nfeData.chaveAcesso)}</div>
                                <button onClick={() => navigator.clipboard.writeText(nfeData.chaveAcesso)}
                                    className="mt-2 w-full h-8 text-xs rounded-lg border border-input hover:bg-muted flex items-center justify-center gap-1">
                                    <Copy className="w-3 h-3" /> Copiar Chave
                                </button>
                            </div>
                        )}

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4 text-sm text-cyan-800 dark:text-cyan-200">
                            <h4 className="font-semibold mb-2">📋 Visualizador</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Visualização em árvore</li>
                                <li>• Parsing de NF-e</li>
                                <li>• Extração de dados</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
