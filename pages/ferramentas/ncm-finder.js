export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState, useEffect } from 'react';
import { Search, Package, Download, Copy, Lock, History, ExternalLink } from 'lucide-react';

const MOCK_RESULTS = [
    { ncm: '8471.30.19', descricao: 'Máquinas automáticas para processamento de dados, portáteis', ipi: 0, icmsSP: 18, tipi: 'II' },
    { ncm: '8471.30.11', descricao: 'Computadores de mesa (desktops)', ipi: 15, icmsSP: 18, tipi: 'II' },
    { ncm: '8471.30.12', descricao: 'Notebooks', ipi: 0, icmsSP: 12, tipi: 'II' },
    { ncm: '8471.30.90', descricao: 'Outras máquinas automáticas para processamento de dados', ipi: 15, icmsSP: 18, tipi: 'II' },
];

function generateNCMHash(query) {
    const inputString = `${query}|${Date.now()}`;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < inputString.length; i++) {
        const ch = inputString.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
    return `NCM-${hash.padStart(12, '0')}`;
}

export default function NCMFinderPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [searchCount, setSearchCount] = useState(0);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('ncm_history') || '[]');
        setHistory(saved);
        setSearchCount(parseInt(localStorage.getItem('ncm_count') || '0'));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setTimeout(() => {
            setResults(MOCK_RESULTS);
            setSelected(null);

            const newCount = searchCount + 1;
            setSearchCount(newCount);
            localStorage.setItem('ncm_count', newCount.toString());

            const searchRecord = { query, hash: generateNCMHash(query), timestamp: new Date().toISOString(), resultsCount: MOCK_RESULTS.length };
            const newHistory = [searchRecord, ...history.slice(0, 49)];
            setHistory(newHistory);
            localStorage.setItem('ncm_history', JSON.stringify(newHistory));

            setLoading(false);
        }, 800);
    };

    return (
        <ToolLayout title="NCM Finder" description="Buscador de códigos NCM">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-teal-500/10 rounded-xl">
                        <Package className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">NCM Finder</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-teal-500/10 text-teal-600">Inteligência</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Busque códigos NCM por descrição ou código</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="bg-card border border-border rounded-xl p-5">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Digite o produto ou código NCM..."
                                        className="w-full h-11 px-4 text-sm rounded-lg border border-input bg-background" />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="h-11 px-6 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    {loading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>

                            {/* Free limit warning */}
                            <FeatureLock featureId="ncm_finder_unlimited" showUpgrade={false} fallback={
                                searchCount >= 3 && (
                                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                                        Você atingiu o limite de {searchCount} buscas gratuitas. Faça upgrade para PRO para buscas ilimitadas.
                                    </div>
                                )
                            }>
                                <span></span>
                            </FeatureLock>
                        </form>

                        {/* Results */}
                        {results.length > 0 && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
                                    <span className="text-sm font-semibold text-foreground">{results.length} resultados</span>
                                    <FeatureLock featureId="ncm_finder_report" showUpgrade={false} fallback={
                                        <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                            <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-amber-500" />
                                        </button>
                                    }>
                                        <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                            <Download className="w-3.5 h-3.5" /> PDF
                                        </button>
                                    </FeatureLock>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {results.map((r, i) => (
                                        <button key={i} onClick={() => setSelected(r)}
                                            className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selected?.ncm === r.ncm ? 'bg-primary/5 border-l-2 border-primary' : ''
                                                }`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-mono text-sm font-semibold text-foreground">{r.ncm}</div>
                                                    <div className="text-sm text-muted-foreground">{r.descricao}</div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-0.5 rounded bg-muted">IPI {r.ipi}%</span>
                                                    <span className="px-2 py-0.5 rounded bg-muted">ICMS {r.icmsSP}%</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detail - PRO */}
                        {selected && (
                            <FeatureLock featureId="ncm_finder_unlimited" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-foreground">Detalhes do NCM</h3>
                                        <button onClick={() => navigator.clipboard.writeText(selected.ncm)} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                            <Copy className="w-3.5 h-3.5" /> Copiar
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-muted-foreground">NCM</div>
                                            <div className="text-lg font-mono font-bold text-foreground">{selected.ncm}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">TIPI</div>
                                            <div className="text-lg font-bold text-foreground">{selected.tipi}</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs text-muted-foreground mb-1">Descrição</div>
                                        <div className="text-sm text-foreground">{selected.descricao}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">IPI</div>
                                            <div className="text-lg font-bold text-foreground">{selected.ipi}%</div>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground">ICMS SP</div>
                                            <div className="text-lg font-bold text-foreground">{selected.icmsSP}%</div>
                                        </div>
                                    </div>
                                </div>
                            </FeatureLock>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
                                </div>
                                <span className="text-xs text-muted-foreground">{history.length}</span>
                            </div>
                            {history.length === 0
                                ? <p className="text-xs text-muted-foreground text-center py-4">Nenhuma busca</p>
                                : <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                    {history.slice(0, 10).map((h, i) => (
                                        <button key={i} onClick={() => setQuery(h.query)}
                                            className="w-full text-left p-2 rounded-lg border border-border hover:bg-muted/50 text-xs">
                                            <div className="font-medium text-foreground truncate">{h.query}</div>
                                            <div className="text-muted-foreground">{h.resultsCount} resultados</div>
                                        </button>
                                    ))}
                                </div>
                            }
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-sm text-teal-800 dark:text-teal-200">
                            <h4 className="font-semibold mb-2">📋 NCM Finder</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• TIPI atualizada</li>
                                <li>• Alíquotas por estado</li>
                                <li>• Benefícios fiscais</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
