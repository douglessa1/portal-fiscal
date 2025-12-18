export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { useState } from 'react';
import { Package, Search, Copy, Check, Filter, Tag } from 'lucide-react';
import { CEST_DATABASE, CEST_SEGMENTOS, getSegmento } from '../../lib/data/cestDatabase';

export default function CESTConsultaPage() {
    const [query, setQuery] = useState('');
    const [segmentoFilter, setSegmentoFilter] = useState('');
    const [selectedCEST, setSelectedCEST] = useState(null);
    const [copied, setCopied] = useState(false);

    const filteredCESTs = CEST_DATABASE.filter(cest => {
        const matchQuery = !query ||
            cest.cest.includes(query) ||
            cest.ncm.includes(query) ||
            cest.descricao.toLowerCase().includes(query.toLowerCase());
        const matchSegmento = !segmentoFilter || cest.segmento === segmentoFilter;
        return matchQuery && matchSegmento;
    });

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolLayout title="Consulta CEST" description="Código Especificador da Substituição Tributária">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl">
                            <Tag className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Consulta CEST</h1>
                            <p className="text-sm text-muted-foreground">
                                {CEST_DATABASE.length} códigos • {CEST_SEGMENTOS.length} segmentos • MVA padrão
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Search & Filters */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="CEST, NCM ou descrição..."
                                            className="w-full h-10 pl-10 pr-3 text-sm rounded-lg border border-input bg-background"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <select
                                        value={segmentoFilter}
                                        onChange={(e) => setSegmentoFilter(e.target.value)}
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                                    >
                                        <option value="">Todos os segmentos</option>
                                        {CEST_SEGMENTOS.map(s => (
                                            <option key={s.id} value={s.id}>{s.id} - {s.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Segment Quick Filters */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {CEST_SEGMENTOS.slice(0, 6).map(seg => (
                                    <button
                                        key={seg.id}
                                        onClick={() => setSegmentoFilter(segmentoFilter === seg.id ? '' : seg.id)}
                                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${segmentoFilter === seg.id
                                                ? 'text-white shadow-sm'
                                                : 'bg-muted hover:bg-muted/80 text-foreground'
                                            }`}
                                        style={segmentoFilter === seg.id ? { backgroundColor: seg.cor } : {}}
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.cor }}></span>
                                        {seg.nome}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="bg-muted px-4 py-2.5 border-b border-border flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    {filteredCESTs.length} resultados
                                </span>
                            </div>
                            <div className="max-h-[500px] overflow-auto divide-y divide-border/50">
                                {filteredCESTs.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>Nenhum CEST encontrado</p>
                                    </div>
                                ) : (
                                    filteredCESTs.map((cest, idx) => {
                                        const seg = getSegmento(cest.segmento);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedCEST(cest)}
                                                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selectedCEST?.cest === cest.cest ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <span className="font-mono text-sm font-bold text-primary">{cest.cest}</span>
                                                        <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                                                            NCM: {cest.ncm}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm text-foreground line-clamp-2">{cest.descricao}</div>
                                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                            <span
                                                                className="text-[10px] px-1.5 py-0.5 rounded text-white"
                                                                style={{ backgroundColor: seg?.cor || '#6b7280' }}
                                                            >
                                                                {seg?.nome || 'Outros'}
                                                            </span>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                                                MVA {cest.mva}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Details */}
                    <div className="space-y-4">
                        {selectedCEST ? (
                            <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
                                {/* CEST Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-xl font-bold text-primary">{selectedCEST.cest}</span>
                                    <button
                                        onClick={() => handleCopy(selectedCEST.cest)}
                                        className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1.5"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-foreground mb-4 leading-relaxed">{selectedCEST.descricao}</p>

                                {/* Segmento Badge */}
                                {(() => {
                                    const seg = getSegmento(selectedCEST.segmento);
                                    return seg && (
                                        <div
                                            className="p-3 rounded-lg mb-4 text-white"
                                            style={{ backgroundColor: seg.cor }}
                                        >
                                            <div className="text-xs opacity-80">Segmento {seg.id}</div>
                                            <div className="font-bold">{seg.nome}</div>
                                        </div>
                                    );
                                })()}

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2.5 bg-muted/50 rounded-lg">
                                        <span className="text-[10px] text-muted-foreground block">NCM</span>
                                        <span className="text-sm font-mono font-semibold">{selectedCEST.ncm}</span>
                                    </div>
                                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <span className="text-[10px] text-muted-foreground block">MVA Original</span>
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{selectedCEST.mva}%</span>
                                    </div>
                                </div>

                                {/* Copy NCM */}
                                <button
                                    onClick={() => handleCopy(selectedCEST.ncm)}
                                    className="w-full h-9 text-xs rounded-lg border border-input hover:bg-muted flex items-center justify-center gap-1.5"
                                >
                                    <Copy className="w-3 h-3" /> Copiar NCM
                                </button>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-xl p-6 text-center">
                                <Tag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-sm text-muted-foreground">Selecione um CEST</p>
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Sobre CEST
                            </h4>
                            <ul className="space-y-1.5 text-xs">
                                <li>• <strong>CEST</strong>: 7 dígitos (XX.XXX.XX)</li>
                                <li>• <strong>Obrigatório</strong> em operações com ST</li>
                                <li>• <strong>Segmento</strong>: 2 primeiros dígitos</li>
                                <li>• <strong>MVA</strong>: Margem Valor Agregado</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
