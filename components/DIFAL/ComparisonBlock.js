/**
 * ComparisonBlock - Side-by-side Base Única vs Base Dupla
 */
export default function ComparisonBlock({ comparison }) {
    if (!comparison) return null;

    const { baseUnica, baseDupla, diferenca, diferencaPercentual } = comparison;

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Comparativo de Metodologias</h3>
                <span className="text-xs text-muted-foreground">Diferença: {fmt(diferenca)} ({diferencaPercentual}%)</span>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Base Única */}
                <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Base Única</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">ES</span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Base de Cálculo</span>
                            <span className="font-medium">{fmt(baseUnica.resultado.baseCalculo)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">DIFAL</span>
                            <span className="font-medium">{fmt(baseUnica.resultado.difal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">FCP</span>
                            <span className="font-medium">{fmt(baseUnica.resultado.fcp)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{fmt(baseUnica.resultado.totalDifal)}</span>
                        </div>
                    </div>
                </div>

                {/* Base Dupla */}
                <div className="border-2 border-primary rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Base Dupla</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">Padrão</span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Majorada</span>
                            <span className="font-medium">{fmt(baseDupla.resultado.baseMajorada)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">DIFAL</span>
                            <span className="font-medium">{fmt(baseDupla.resultado.difal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">FCP</span>
                            <span className="font-medium">{fmt(baseDupla.resultado.fcp)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-primary">{fmt(baseDupla.resultado.totalDifal)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Difference Alert */}
            {diferenca !== 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <span className="font-semibold">⚠️ Atenção:</span>
                        <span>A Base Dupla resulta em {fmt(Math.abs(diferenca))} {diferenca > 0 ? 'a mais' : 'a menos'} que a Base Única.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
