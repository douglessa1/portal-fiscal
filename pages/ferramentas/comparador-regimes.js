export const dynamic = 'force-dynamic';
import AuthGate from '../../components/Auth/AuthGate';
import ToolLayout from '../../components/Layout/ToolLayout';
import { FeatureLock, UpgradePrompt } from '../../components/Permissions/FeatureLock';
import { useState } from 'react';
import { Scale, Calculator, Copy, Download, Lock, Info, TrendingUp, BarChart3 } from 'lucide-react';

// Alíquotas simplificadas
const TABELAS = {
    simplesNacional: {
        anexo1: [
            { ate: 180000, aliq: 4 },
            { ate: 360000, aliq: 7.3 },
            { ate: 720000, aliq: 9.5 },
            { ate: 1800000, aliq: 10.7 },
            { ate: 3600000, aliq: 14.3 },
            { ate: 4800000, aliq: 19 }
        ],
        anexo3: [
            { ate: 180000, aliq: 6 },
            { ate: 360000, aliq: 11.2 },
            { ate: 720000, aliq: 13.5 },
            { ate: 1800000, aliq: 16 },
            { ate: 3600000, aliq: 21 },
            { ate: 4800000, aliq: 33 }
        ]
    },
    lucroPresumido: {
        comercio: { irpj: 1.2, csll: 1.08, pis: 0.65, cofins: 3 },
        servico: { irpj: 4.8, csll: 2.88, pis: 0.65, cofins: 3 }
    },
    lucroReal: {
        comercio: { irpj: 15, csll: 9, pis: 1.65, cofins: 7.6 },
        servico: { irpj: 15, csll: 9, pis: 1.65, cofins: 7.6 }
    }
};

function generateHash(inputs) {
    const str = JSON.stringify(inputs);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
    return `COMP-${hash.padStart(12, '0')}`;
}

function ComparadorRegimesPageContent() {
    const [formData, setFormData] = useState({
        faturamentoAnual: '',
        tipoAtividade: 'comercio',
        faturamento12m: '',
        folhaPagamento: ''
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const calcular = (e) => {
        e.preventDefault();
        const faturamento = parseFloat(formData.faturamentoAnual) || 0;
        const tipo = formData.tipoAtividade;
        const folha = parseFloat(formData.folhaPagamento) || 0;

        // Simples Nacional
        let aliqSimples = 0;
        const tabela = tipo === 'comercio' ? TABELAS.simplesNacional.anexo1 : TABELAS.simplesNacional.anexo3;
        for (const faixa of tabela) {
            if (faturamento <= faixa.ate) {
                aliqSimples = faixa.aliq;
                break;
            }
        }
        if (aliqSimples === 0) aliqSimples = tabela[tabela.length - 1].aliq;
        const simplesNacional = faturamento * (aliqSimples / 100);

        // Lucro Presumido
        const presumido = TABELAS.lucroPresumido[tipo];
        const lucroPresumido = faturamento * ((presumido.irpj + presumido.csll + presumido.pis + presumido.cofins) / 100);

        // Lucro Real (simplificado - assume 10% de lucro)
        const lucroEstimado = faturamento * 0.10;
        const real = TABELAS.lucroReal[tipo];
        const lucroReal = (lucroEstimado * (real.irpj + real.csll) / 100) + (faturamento * (real.pis + real.cofins) / 100);

        // Determinar melhor regime
        const regimes = [
            { nome: 'Simples Nacional', valor: simplesNacional, aliq: aliqSimples },
            { nome: 'Lucro Presumido', valor: lucroPresumido, aliq: ((presumido.irpj + presumido.csll + presumido.pis + presumido.cofins)) },
            { nome: 'Lucro Real', valor: lucroReal, aliq: null }
        ].filter(r => faturamento <= 4800000 || r.nome !== 'Simples Nacional');

        const melhor = regimes.reduce((min, r) => r.valor < min.valor ? r : min, regimes[0]);

        // Projeção 5 anos (crescimento 10% ao ano)
        const projecao5anos = [];
        for (let ano = 1; ano <= 5; ano++) {
            const fatAno = faturamento * Math.pow(1.10, ano - 1);
            const simplesAno = fatAno <= 4800000 ? fatAno * (aliqSimples / 100) : null;
            const presumidoAno = fatAno * ((presumido.irpj + presumido.csll + presumido.pis + presumido.cofins) / 100);
            const lucroAno = fatAno * 0.10;
            const realAno = (lucroAno * (real.irpj + real.csll) / 100) + (fatAno * (real.pis + real.cofins) / 100);
            projecao5anos.push({
                ano,
                faturamento: fatAno,
                simples: simplesAno,
                presumido: presumidoAno,
                real: realAno
            });
        }

        setResult({
            faturamento,
            tipo,
            regimes,
            melhor,
            projecao5anos,
            hash: generateHash(formData),
            timestamp: new Date().toISOString()
        });
    };

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
    const fmtK = (v) => `R$ ${(v / 1000).toFixed(0)}k`;

    return (
        <ToolLayout title="Comparador de Regimes" description="Compare regimes tributários">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                        <Scale className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Comparador de Regimes</h1>
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-500/10 text-indigo-600">Gestão</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Simules Nacional × Lucro Presumido × Lucro Real</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <form onSubmit={calcular} className="bg-card border border-border rounded-xl p-5 space-y-5">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados da Empresa</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Faturamento Anual (R$)</label>
                                        <input type="number" name="faturamentoAnual" value={formData.faturamentoAnual} onChange={handleChange}
                                            placeholder="500000.00" step="0.01" required
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Tipo de Atividade</label>
                                        <select name="tipoAtividade" value={formData.tipoAtividade} onChange={handleChange}
                                            className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                            <option value="comercio">Comércio</option>
                                            <option value="servico">Serviços</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <FeatureLock featureId="bi_fiscal" fallback={
                                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground flex items-center justify-between">
                                    <span>Análise avançada (folha, créditos)</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">PRO</span>
                                </div>
                            }>
                                <div>
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Análise Avançada</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-foreground mb-1">Folha de Pagamento Anual (R$)</label>
                                            <input type="number" name="folhaPagamento" value={formData.folhaPagamento} onChange={handleChange}
                                                placeholder="120000.00" step="0.01"
                                                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-foreground mb-1">Faturamento Últimos 12m (R$)</label>
                                            <input type="number" name="faturamento12m" value={formData.faturamento12m} onChange={handleChange}
                                                placeholder="500000.00" step="0.01"
                                                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                        </div>
                                    </div>
                                </div>
                            </FeatureLock>

                            <button type="submit"
                                className="w-full h-11 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" /> Comparar Regimes
                            </button>
                        </form>

                        {result && (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-semibold text-foreground">Comparativo de Regimes</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => navigator.clipboard.writeText(result.hash)} className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Hash
                                            </button>
                                            <FeatureLock featureId="bi_fiscal" showUpgrade={false} fallback={
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input opacity-50 cursor-not-allowed flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF <Lock className="w-3 h-3 text-purple-500" />
                                                </button>
                                            }>
                                                <button className="h-8 px-3 text-xs rounded-lg border border-input hover:bg-muted flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF
                                                </button>
                                            </FeatureLock>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        {result.regimes.map((regime, idx) => {
                                            const isMelhor = regime.nome === result.melhor.nome;
                                            return (
                                                <div key={idx} className={`rounded-lg p-4 ${isMelhor
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-muted/50'
                                                    }`}>
                                                    <div className={`text-xs mb-1 ${isMelhor ? 'text-white/80' : 'text-muted-foreground'}`}>
                                                        {regime.nome}
                                                        {isMelhor && ' ⭐ Recomendado'}
                                                    </div>
                                                    <div className={`text-xl font-bold ${isMelhor ? 'text-white' : 'text-foreground'}`}>
                                                        {fmt(regime.valor)}
                                                    </div>
                                                    {regime.aliq && (
                                                        <div className={`text-xs mt-1 ${isMelhor ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                            Alíquota: {regime.aliq}%
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-800 dark:text-green-200">
                                        <strong>Economia potencial:</strong> {fmt(Math.max(...result.regimes.map(r => r.valor)) - result.melhor.valor)} ao ano optando pelo {result.melhor.nome}.
                                    </div>

                                    <div className="mt-3 text-xs font-mono text-muted-foreground">{result.hash}</div>
                                </div>

                                {/* Visual Chart */}
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                                        <h2 className="text-sm font-semibold text-foreground">Comparativo Visual</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {result.regimes.map((regime, idx) => {
                                            const max = Math.max(...result.regimes.map(r => r.valor));
                                            const pct = (regime.valor / max) * 100;
                                            const isMelhor = regime.nome === result.melhor.nome;
                                            const colors = {
                                                'Simples Nacional': 'bg-blue-500',
                                                'Lucro Presumido': 'bg-amber-500',
                                                'Lucro Real': 'bg-purple-500'
                                            };
                                            return (
                                                <div key={idx}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-xs font-medium ${isMelhor ? 'text-green-600' : 'text-foreground'}`}>
                                                            {regime.nome} {isMelhor && '✓'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{fmt(regime.valor)}</span>
                                                    </div>
                                                    <div className="h-6 bg-muted rounded-lg overflow-hidden">
                                                        <div
                                                            className={`h-full ${colors[regime.nome]} ${isMelhor ? 'opacity-100' : 'opacity-60'} transition-all duration-500`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 5-Year Projection */}
                                <FeatureLock featureId="bi_fiscal" fallback={
                                    <div className="bg-card border border-border rounded-xl p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-semibold text-muted-foreground">Projeção 5 Anos</span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> PRO
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">Veja a projeção tributária pelos próximos 5 anos com crescimento estimado.</p>
                                    </div>
                                }>
                                    <div className="bg-card border border-border rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <h2 className="text-sm font-semibold text-foreground">Projeção 5 Anos (crescimento 10% a.a.)</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="text-left py-2 font-medium text-muted-foreground">Ano</th>
                                                        <th className="text-right py-2 font-medium text-muted-foreground">Faturamento</th>
                                                        <th className="text-right py-2 font-medium text-blue-600">Simples</th>
                                                        <th className="text-right py-2 font-medium text-amber-600">Presumido</th>
                                                        <th className="text-right py-2 font-medium text-purple-600">Real</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.projecao5anos.map((p, idx) => (
                                                        <tr key={idx} className="border-b border-border/50">
                                                            <td className="py-2 font-medium">Ano {p.ano}</td>
                                                            <td className="py-2 text-right text-muted-foreground">{fmtK(p.faturamento)}</td>
                                                            <td className="py-2 text-right text-blue-600">
                                                                {p.simples ? fmtK(p.simples) : <span className="text-red-500">Excede</span>}
                                                            </td>
                                                            <td className="py-2 text-right text-amber-600">{fmtK(p.presumido)}</td>
                                                            <td className="py-2 text-right text-purple-600">{fmtK(p.real)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-700 dark:text-amber-300">
                                            <strong>Atenção:</strong> Se ultrapassar R$ 4.8M, será necessário migrar do Simples Nacional.
                                        </div>
                                    </div>
                                </FeatureLock>

                                <FeatureLock featureId="bi_fiscal" fallback={<UpgradePrompt requiredPlan="pro" />}>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b border-border">
                                            <span className="text-xs font-semibold text-foreground uppercase">Análise Detalhada</span>
                                        </div>
                                        <div className="p-4 text-sm text-muted-foreground">
                                            <p>Considerando o faturamento de {fmt(result.faturamento)} e atividade de {result.tipo}:</p>
                                            <ul className="list-disc ml-5 mt-2 space-y-1">
                                                <li>Simples Nacional: regime simplificado, unificação de tributos</li>
                                                <li>Lucro Presumido: margens presumidas, sem créditos de PIS/COFINS</li>
                                                <li>Lucro Real: permite créditos, indicado para baixa margem</li>
                                            </ul>
                                        </div>
                                    </div>
                                </FeatureLock>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Limites de Faturamento</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between p-2 rounded bg-muted/50">
                                    <span>MEI</span>
                                    <span className="font-medium">R$ 81.000</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-muted/50">
                                    <span>Simples Nacional</span>
                                    <span className="font-medium">R$ 4.800.000</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-muted/50">
                                    <span>Lucro Presumido</span>
                                    <span className="font-medium">R$ 78.000.000</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-muted/50">
                                    <span>Lucro Real</span>
                                    <span className="font-medium">Sem limite</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-200">
                            <h4 className="font-semibold mb-2">📋 Comparador</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Simulação anual</li>
                                <li>• Comércio e serviços</li>
                                <li>• Recomendação automática</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function ComparadorRegimesPage() {
    return (
        <AuthGate>
            <ComparadorRegimesPageContent />
        </AuthGate>
    );
}
