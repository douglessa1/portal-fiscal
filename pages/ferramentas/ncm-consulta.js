export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { useState } from 'react';
import { Package, Search, Copy, Check, Filter, Download, AlertTriangle, Scale } from 'lucide-react';
import { NCM_DATABASE, NCM_CATEGORIAS, CST_PIS_COFINS } from '../../lib/data/ncmDatabase';

export default function NCMConsultaPage() {
    const [query, setQuery] = useState('');
    const [capituloFilter, setCapituloFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [stFilter, setStFilter] = useState('');
    const [selectedNCM, setSelectedNCM] = useState(null);
    const [copied, setCopied] = useState(false);

    const capitulos = [...new Set(NCM_DATABASE.map(n => n.capitulo))].sort();

    const filteredNCMs = NCM_DATABASE.filter(ncm => {
        const matchQuery = !query ||
            ncm.ncm.includes(query) ||
            ncm.descricao.toLowerCase().includes(query.toLowerCase()) ||
            (ncm.cest && ncm.cest.includes(query));
        const matchCapitulo = !capituloFilter || ncm.capitulo === capituloFilter;
        const matchCategoria = !categoriaFilter || ncm.categoria === categoriaFilter;
        const matchST = !stFilter || (stFilter === 'sim' ? ncm.st : !ncm.st);
        return matchQuery && matchCapitulo && matchCategoria && matchST;
    });

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatNCM = (ncm) => ncm.replace(/(.{4})(.{2})(.{2})/, '$1.$2.$3');

    return (
        <ToolLayout title="Consulta NCM/CEST" description="Consulte códigos NCM com alíquotas e CEST">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-500/10 rounded-xl">
                            <Package className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Consulta NCM/CEST</h1>
                            <p className="text-sm text-muted-foreground">
                                {NCM_DATABASE.length} códigos • TIPI • ST • PIS/COFINS
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Search & Filters */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="lg:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="NCM, CEST ou descrição..."
                                            className="w-full h-10 pl-10 pr-3 text-sm rounded-lg border border-input bg-background"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <select
                                        value={categoriaFilter}
                                        onChange={(e) => setCategoriaFilter(e.target.value)}
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                                    >
                                        <option value="">Todas categorias</option>
                                        {NCM_CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={stFilter}
                                        onChange={(e) => setStFilter(e.target.value)}
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                                    >
                                        <option value="">ST: Todos</option>
                                        <option value="sim">Com ST</option>
                                        <option value="nao">Sem ST</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quick filters */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs text-muted-foreground">Capítulos:</span>
                                {['02', '22', '27', '30', '33', '84', '85', '87'].map(cap => (
                                    <button
                                        key={cap}
                                        onClick={() => setCapituloFilter(capituloFilter === cap ? '' : cap)}
                                        className={`px-2 py-1 text-xs rounded transition-colors ${capituloFilter === cap
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        Cap. {cap}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="bg-muted px-4 py-2.5 border-b border-border flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    {filteredNCMs.length} resultados
                                </span>
                                {query && (
                                    <button
                                        onClick={() => { setQuery(''); setCategoriaFilter(''); setCapituloFilter(''); setStFilter(''); }}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[500px] overflow-auto divide-y divide-border/50">
                                {filteredNCMs.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>Nenhum NCM encontrado</p>
                                        <p className="text-xs mt-1">Tente outro termo de busca</p>
                                    </div>
                                ) : (
                                    filteredNCMs.map((ncm, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedNCM(ncm)}
                                            className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selectedNCM?.ncm === ncm.ncm ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <span className="font-mono text-sm font-bold text-primary">
                                                        {formatNCM(ncm.ncm)}
                                                    </span>
                                                    {ncm.cest && (
                                                        <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                                                            CEST: {ncm.cest}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-foreground line-clamp-2">{ncm.descricao}</div>
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                            {ncm.categoria}
                                                        </span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${ncm.ipi > 0
                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                            }`}>
                                                            IPI {ncm.ipi}%
                                                        </span>
                                                        {ncm.st && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                                ST
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Details */}
                    <div className="space-y-4">
                        {selectedNCM ? (
                            <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
                                {/* NCM Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-xl font-bold text-primary">
                                        {formatNCM(selectedNCM.ncm)}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(selectedNCM.ncm)}
                                        className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1.5"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-foreground mb-4 leading-relaxed">{selectedNCM.descricao}</p>

                                {/* CEST */}
                                {selectedNCM.cest && (
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">CEST</span>
                                            <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-300">
                                                {selectedNCM.cest}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Main Info Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2.5 bg-muted/50 rounded-lg">
                                        <span className="text-[10px] text-muted-foreground block">Capítulo</span>
                                        <span className="text-sm font-semibold">{selectedNCM.capitulo}</span>
                                    </div>
                                    <div className="p-2.5 bg-muted/50 rounded-lg">
                                        <span className="text-[10px] text-muted-foreground block">Categoria</span>
                                        <span className="text-sm font-semibold">{selectedNCM.categoria}</span>
                                    </div>
                                    <div className={`p-2.5 rounded-lg ${selectedNCM.ipi > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                                        <span className="text-[10px] text-muted-foreground block">IPI</span>
                                        <span className={`text-sm font-bold ${selectedNCM.ipi > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-green-700 dark:text-green-300'}`}>
                                            {selectedNCM.ipi}%
                                        </span>
                                    </div>
                                    <div className={`p-2.5 rounded-lg ${selectedNCM.st ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-muted/50'}`}>
                                        <span className="text-[10px] text-muted-foreground block">Subst. Tributária</span>
                                        <span className={`text-sm font-bold ${selectedNCM.st ? 'text-purple-700 dark:text-purple-300' : ''}`}>
                                            {selectedNCM.st ? 'Sim' : 'Não'}
                                        </span>
                                    </div>
                                </div>

                                {/* PIS/COFINS */}
                                <div className="border-t border-border pt-4">
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                                        <Scale className="w-3.5 h-3.5" />
                                        PIS/COFINS (CST Sugerido)
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                            <span className="text-blue-700 dark:text-blue-300 font-medium">CST {selectedNCM.pis}</span>
                                            <span className="text-blue-600 dark:text-blue-400 text-[10px]">
                                                {CST_PIS_COFINS[selectedNCM.pis] || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                                    <div className="flex gap-2 text-xs text-amber-700 dark:text-amber-300">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>As alíquotas podem variar por UF e benefícios fiscais. Consulte a legislação local.</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-xl p-6 text-center">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-sm text-muted-foreground">Selecione um NCM para ver os detalhes</p>
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-sm text-teal-800 dark:text-teal-200">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Sobre NCM/CEST
                            </h4>
                            <ul className="space-y-1.5 text-xs">
                                <li>• <strong>NCM</strong>: 8 dígitos, define o produto</li>
                                <li>• <strong>CEST</strong>: 7 dígitos, para ST</li>
                                <li>• <strong>IPI</strong>: Imposto sobre produtos industrializados</li>
                                <li>• <strong>ST</strong>: Substituição Tributária</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
