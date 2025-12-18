/**
 * IBS/CBS (Reforma Tributária) Engine with Hash and Memory
 * Cálculo dos novos tributos da reforma
 */

export function generateIBSCBSHash(inputs) {
    const { valor, tipoOperacao, aliqIBS, aliqCBS } = inputs;

    const inputString = [
        parseFloat(valor || 0).toFixed(2),
        tipoOperacao || 'venda',
        parseFloat(aliqIBS || 0).toFixed(2),
        parseFloat(aliqCBS || 0).toFixed(2)
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
    return `IBSCBS-${hash.padStart(12, '0')}`;
}

// Alíquotas estimadas da reforma (sujeitas a alteração)
export const ALIQUOTAS_REFORMA = {
    CBS: 8.8, // Federal
    IBS: 17.7, // Estadual + Municipal
    total: 26.5
};

// Cronograma de transição
export const TRANSICAO = [
    { ano: 2026, icms: 100, iss: 100, ibs: 0, cbs: 0, pis: 100, cofins: 100 },
    { ano: 2027, icms: 100, iss: 100, ibs: 0.1, cbs: 0.9, pis: 100, cofins: 100 },
    { ano: 2028, icms: 100, iss: 100, ibs: 0.1, cbs: 0.9, pis: 100, cofins: 100 },
    { ano: 2029, icms: 90, iss: 90, ibs: 10, cbs: 100, pis: 0, cofins: 0 },
    { ano: 2030, icms: 80, iss: 80, ibs: 20, cbs: 100, pis: 0, cofins: 0 },
    { ano: 2031, icms: 70, iss: 70, ibs: 30, cbs: 100, pis: 0, cofins: 0 },
    { ano: 2032, icms: 60, iss: 60, ibs: 40, cbs: 100, pis: 0, cofins: 0 },
    { ano: 2033, icms: 0, iss: 0, ibs: 100, cbs: 100, pis: 0, cofins: 0 }
];

export function calculateIBSCBSWithMemory(inputs) {
    const valor = parseFloat(inputs.valor) || 0;
    const tipoOperacao = inputs.tipoOperacao || 'venda';
    const aliqIBS = parseFloat(inputs.aliqIBS) || ALIQUOTAS_REFORMA.IBS;
    const aliqCBS = parseFloat(inputs.aliqCBS) || ALIQUOTAS_REFORMA.CBS;
    const creditoIBS = parseFloat(inputs.creditoIBS) || 0;
    const creditoCBS = parseFloat(inputs.creditoCBS) || 0;

    const steps = [];

    // Step 1: Base de cálculo
    steps.push({
        step: 1,
        description: 'Base de Cálculo',
        formula: `Valor da operação`,
        result: `R$ ${valor.toFixed(2)}`
    });

    // Step 2: CBS (Federal)
    const cbsBruto = valor * (aliqCBS / 100);
    steps.push({
        step: 2,
        description: 'CBS - Contribuição sobre Bens e Serviços',
        formula: `R$ ${valor.toFixed(2)} × ${aliqCBS}%`,
        result: `R$ ${cbsBruto.toFixed(2)}`
    });

    // Step 3: IBS (Estadual + Municipal)
    const ibsBruto = valor * (aliqIBS / 100);
    steps.push({
        step: 3,
        description: 'IBS - Imposto sobre Bens e Serviços',
        formula: `R$ ${valor.toFixed(2)} × ${aliqIBS}%`,
        result: `R$ ${ibsBruto.toFixed(2)}`
    });

    // Step 4: Créditos
    const cbsLiquido = Math.max(0, cbsBruto - creditoCBS);
    const ibsLiquido = Math.max(0, ibsBruto - creditoIBS);

    if (creditoCBS > 0 || creditoIBS > 0) {
        steps.push({
            step: 4,
            description: 'Após Créditos',
            formula: `CBS: R$ ${cbsBruto.toFixed(2)} - R$ ${creditoCBS.toFixed(2)} | IBS: R$ ${ibsBruto.toFixed(2)} - R$ ${creditoIBS.toFixed(2)}`,
            result: `CBS: R$ ${cbsLiquido.toFixed(2)} | IBS: R$ ${ibsLiquido.toFixed(2)}`
        });
    }

    const total = cbsLiquido + ibsLiquido;
    steps.push({
        step: creditoCBS > 0 || creditoIBS > 0 ? 5 : 4,
        description: 'Total IBS + CBS (IVA Dual)',
        formula: `R$ ${cbsLiquido.toFixed(2)} + R$ ${ibsLiquido.toFixed(2)}`,
        result: `R$ ${total.toFixed(2)}`
    });

    return {
        inputs: { ...inputs, aliqIBS, aliqCBS },
        resultado: {
            cbsBruto, ibsBruto, cbsLiquido, ibsLiquido,
            total, aliqEfetiva: ((total / valor) * 100).toFixed(2)
        },
        memory: steps,
        hash: generateIBSCBSHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'EC 132/2023 • LC (pendente)'
    };
}

export function compareAtualVsReforma(inputs) {
    const valor = parseFloat(inputs.valor) || 0;

    // Sistema atual (ICMS + PIS + COFINS médio)
    const icmsAtual = valor * 0.18;
    const pisCofinsAtual = valor * 0.0925;
    const totalAtual = icmsAtual + pisCofinsAtual;

    // Reforma (IBS + CBS)
    const reforma = calculateIBSCBSWithMemory(inputs);

    return {
        atual: { icms: icmsAtual, pisCofins: pisCofinsAtual, total: totalAtual },
        reforma: reforma.resultado,
        diferenca: reforma.resultado.total - totalAtual,
        percentual: ((reforma.resultado.total - totalAtual) / totalAtual * 100).toFixed(2)
    };
}
