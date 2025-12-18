/**
 * ICMS-ST Comparison Block - MVA Original vs MVA Ajustada
 */
export default function ICMSSTComparison({ comparison }) {
    if (!comparison) return null;

    const { mvaOriginal, mvaAjustada, diferenca, diferencaPercentual } = comparison;

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Comparativo MVA Original × MVA Ajustada</h3>
                <span className="text-xs text-muted-foreground">Diferença: {fmt(diferenca)} ({diferencaPercentual}%)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* MVA Original */}
                <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">MVA Original</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                            {mvaOriginal.mvaUsada.toFixed(2)}%
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Base ST</span>
                            <span className="font-medium">{fmt(mvaOriginal.resultado.baseCalculoST)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ICMS Próprio</span>
                            <span className="font-medium">{fmt(mvaOriginal.resultado.icmsProprio)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-semibold">ICMS-ST</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{fmt(mvaOriginal.resultado.icmsST)}</span>
                        </div>
                    </div>
                </div>

                {/* MVA Ajustada */}
                <div className="border-2 border-primary rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">MVA Ajustada</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            {mvaAjustada.mvaUsada.toFixed(2)}%
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Base ST</span>
                            <span className="font-medium">{fmt(mvaAjustada.resultado.baseCalculoST)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ICMS Próprio</span>
                            <span className="font-medium">{fmt(mvaAjustada.resultado.icmsProprio)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-semibold">ICMS-ST</span>
                            <span className="font-bold text-primary">{fmt(mvaAjustada.resultado.icmsST)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {diferenca !== 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <span className="font-semibold">⚠️ Operação interestadual:</span>
                        <span>A MVA Ajustada resulta em {fmt(Math.abs(diferenca))} {diferenca > 0 ? 'a mais' : 'a menos'} de ICMS-ST.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
