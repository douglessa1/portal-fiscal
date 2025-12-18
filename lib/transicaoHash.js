/**
 * Transição Tributária Engine with Hash and Memory
 * Simulador do período de transição 2026-2033
 */

export function generateTransicaoHash(inputs) {
    const { valorOperacao, ano } = inputs;

    const inputString = [
        parseFloat(valorOperacao || 0).toFixed(2),
        parseInt(ano || 2026)
    ].join('|');

    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < inputString.length; i++) {
        const ch = inputString.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
    return `TRANS-${hash.padStart(12, '0')}`;
}

// Cronograma de transição detalhado
export const CRONOGRAMA = [
    { ano: 2026, icms: 100, iss: 100, ibs: 0, cbs: 0, pis: 100, cofins: 100, fase: 'Teste CBS' },
    { ano: 2027, icms: 100, iss: 100, ibs: 0.1, cbs: 0.9, pis: 100, cofins: 100, fase: 'Teste IBS/CBS' },
    { ano: 2028, icms: 100, iss: 100, ibs: 0.1, cbs: 0.9, pis: 100, cofins: 100, fase: 'Teste IBS/CBS' },
    { ano: 2029, icms: 90, iss: 90, ibs: 10, cbs: 100, pis: 0, cofins: 0, fase: 'Início Transição' },
    { ano: 2030, icms: 80, iss: 80, ibs: 20, cbs: 100, pis: 0, cofins: 0, fase: 'Transição 20%' },
    { ano: 2031, icms: 70, iss: 70, ibs: 30, cbs: 100, pis: 0, cofins: 0, fase: 'Transição 30%' },
    { ano: 2032, icms: 60, iss: 60, ibs: 40, cbs: 100, pis: 0, cofins: 0, fase: 'Transição 40%' },
    { ano: 2033, icms: 0, iss: 0, ibs: 100, cbs: 100, pis: 0, cofins: 0, fase: 'Transição Completa' }
];

// Alíquotas base
const ALIQ = {
    ICMS: 18, ISS: 5, PIS: 1.65, COFINS: 7.6,
    CBS: 8.8, IBS: 17.7
};

export function calculateTransicaoWithMemory(inputs) {
    const valorOperacao = parseFloat(inputs.valorOperacao) || 0;
    const ano = parseInt(inputs.ano) || 2026;
    const tipoOperacao = inputs.tipoOperacao || 'mercadoria'; // mercadoria ou servico

    const cronograma = CRONOGRAMA.find(c => c.ano === ano) || CRONOGRAMA[0];
    const steps = [];

    // Step 1: Identificação
    steps.push({
        step: 1,
        description: `Ano ${ano} - ${cronograma.fase}`,
        formula: `Cronograma EC 132/2023`,
        result: `${tipoOperacao === 'mercadoria' ? 'ICMS' : 'ISS'} ${cronograma.icms}% → IBS ${cronograma.ibs}%`
    });

    // Tributos antigos (pro-rata)
    let icmsOuIss = 0;
    let pisCofins = 0;

    if (tipoOperacao === 'mercadoria') {
        icmsOuIss = valorOperacao * (ALIQ.ICMS / 100) * (cronograma.icms / 100);
        steps.push({
            step: 2,
            description: `ICMS (${cronograma.icms}% do integral)`,
            formula: `R$ ${valorOperacao.toFixed(2)} × ${ALIQ.ICMS}% × ${cronograma.icms}%`,
            result: `R$ ${icmsOuIss.toFixed(2)}`
        });
    } else {
        icmsOuIss = valorOperacao * (ALIQ.ISS / 100) * (cronograma.iss / 100);
        steps.push({
            step: 2,
            description: `ISS (${cronograma.iss}% do integral)`,
            formula: `R$ ${valorOperacao.toFixed(2)} × ${ALIQ.ISS}% × ${cronograma.iss}%`,
            result: `R$ ${icmsOuIss.toFixed(2)}`
        });
    }

    if (cronograma.pis > 0) {
        pisCofins = valorOperacao * ((ALIQ.PIS + ALIQ.COFINS) / 100) * (cronograma.pis / 100);
        steps.push({
            step: 3,
            description: `PIS/COFINS (${cronograma.pis}% do integral)`,
            formula: `R$ ${valorOperacao.toFixed(2)} × ${(ALIQ.PIS + ALIQ.COFINS).toFixed(2)}% × ${cronograma.pis}%`,
            result: `R$ ${pisCofins.toFixed(2)}`
        });
    }

    // Novos tributos (pro-rata)
    let cbs = 0;
    let ibs = 0;

    if (cronograma.cbs > 0) {
        cbs = valorOperacao * (ALIQ.CBS / 100) * (cronograma.cbs / 100);
        steps.push({
            step: steps.length + 1,
            description: `CBS (${cronograma.cbs}% do integral)`,
            formula: `R$ ${valorOperacao.toFixed(2)} × ${ALIQ.CBS}% × ${cronograma.cbs}%`,
            result: `R$ ${cbs.toFixed(2)}`
        });
    }

    if (cronograma.ibs > 0) {
        ibs = valorOperacao * (ALIQ.IBS / 100) * (cronograma.ibs / 100);
        steps.push({
            step: steps.length + 1,
            description: `IBS (${cronograma.ibs}% do integral)`,
            formula: `R$ ${valorOperacao.toFixed(2)} × ${ALIQ.IBS}% × ${cronograma.ibs}%`,
            result: `R$ ${ibs.toFixed(2)}`
        });
    }

    const total = icmsOuIss + pisCofins + cbs + ibs;
    steps.push({
        step: steps.length + 1,
        description: 'Carga Tributária Total',
        formula: 'Soma de todos os tributos',
        result: `R$ ${total.toFixed(2)} (${((total / valorOperacao) * 100).toFixed(2)}%)`
    });

    return {
        inputs: { ...inputs, ano, tipoOperacao },
        resultado: {
            ano, fase: cronograma.fase,
            icmsOuIss, pisCofins, cbs, ibs, total,
            percentual: ((total / valorOperacao) * 100).toFixed(2),
            cronograma
        },
        memory: steps,
        hash: generateTransicaoHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'EC 132/2023'
    };
}

export function compareAnos(inputs) {
    const resultados = {};
    CRONOGRAMA.forEach(c => {
        resultados[c.ano] = calculateTransicaoWithMemory({ ...inputs, ano: c.ano });
    });
    return resultados;
}
