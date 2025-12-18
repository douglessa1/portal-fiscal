/**
 * MemoryOfCalculation - Technical calculation memory display
 * Displays step-by-step calculation with formulas
 */
export default function MemoryOfCalculation({ steps, hash, timestamp }) {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Memória de Cálculo
                </span>
                <span className="text-xs font-mono text-muted-foreground">{hash}</span>
            </div>

            {/* Steps Table */}
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-12">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Descrição</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Fórmula</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {steps.map((step, idx) => (
                        <tr key={idx} className="border-t border-border/50 hover:bg-muted/30">
                            <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{step.step}</td>
                            <td className="px-4 py-2 text-foreground">{step.description}</td>
                            <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{step.formula}</td>
                            <td className="px-4 py-2 text-right font-semibold text-foreground">{step.result}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between border-t border-border">
                <span>Cálculo auditável • LC 190/2022</span>
                <span className="font-mono">{timestamp ? new Date(timestamp).toLocaleString('pt-BR') : '-'}</span>
            </div>
        </div>
    );
}
