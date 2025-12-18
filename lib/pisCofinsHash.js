/**
 * PIS/COFINS Engine with Hash and Memory of Calculation
 * Cálculo cumulativo e não-cumulativo com memória auditável
 */

export function generatePISCOFINSHash(inputs) {
    const { valor, regime, tipoReceita, aliqPIS, aliqCOFINS, creditoPIS, creditoCOFINS } = inputs;

    const inputString = [
        parseFloat(valor || 0).toFixed(2),
        regime || 'cumulativo',
        tipoReceita || 'venda',
        parseFloat(aliqPIS || 0).toFixed(4),
        parseFloat(aliqCOFINS || 0).toFixed(4),
        parseFloat(creditoPIS || 0).toFixed(2),
        parseFloat(creditoCOFINS || 0).toFixed(2)
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
    return `PISCOF-${hash.padStart(12, '0')}`;
}

// Alíquotas padrão
export const ALIQUOTAS = {
    cumulativo: { pis: 0.65, cofins: 3.00 },
    naoCumulativo: { pis: 1.65, cofins: 7.60 }
};

export function calculatePISCOFINSWithMemory(inputs) {
    const valor = parseFloat(inputs.valor) || 0;
    const regime = inputs.regime || 'cumulativo';
    const aliqPIS = parseFloat(inputs.aliqPIS) || ALIQUOTAS[regime]?.pis || 0.65;
    const aliqCOFINS = parseFloat(inputs.aliqCOFINS) || ALIQUOTAS[regime]?.cofins || 3.00;
    const creditoPIS = parseFloat(inputs.creditoPIS) || 0;
    const creditoCOFINS = parseFloat(inputs.creditoCOFINS) || 0;

    const steps = [];

    // Step 1: Base de Cálculo
    steps.push({
        step: 1,
        description: 'Base de Cálculo',
        formula: `Receita Bruta`,
        result: `R$ ${valor.toFixed(2)}`
    });

    // Step 2: PIS Bruto
    const pisBruto = valor * (aliqPIS / 100);
    steps.push({
        step: 2,
        description: `PIS ${regime === 'naoCumulativo' ? 'Não-Cumulativo' : 'Cumulativo'}`,
        formula: `R$ ${valor.toFixed(2)} × ${aliqPIS}%`,
        result: `R$ ${pisBruto.toFixed(2)}`
    });

    // Step 3: COFINS Bruto
    const cofinsBruto = valor * (aliqCOFINS / 100);
    steps.push({
        step: 3,
        description: `COFINS ${regime === 'naoCumulativo' ? 'Não-Cumulativo' : 'Cumulativo'}`,
        formula: `R$ ${valor.toFixed(2)} × ${aliqCOFINS}%`,
        result: `R$ ${cofinsBruto.toFixed(2)}`
    });

    let pisLiquido = pisBruto;
    let cofinsLiquido = cofinsBruto;

    // Step 4-5: Créditos (se não-cumulativo)
    if (regime === 'naoCumulativo') {
        pisLiquido = Math.max(0, pisBruto - creditoPIS);
        cofinsLiquido = Math.max(0, cofinsBruto - creditoCOFINS);

        steps.push({
            step: 4,
            description: 'PIS a Recolher (após créditos)',
            formula: `R$ ${pisBruto.toFixed(2)} - R$ ${creditoPIS.toFixed(2)}`,
            result: `R$ ${pisLiquido.toFixed(2)}`
        });

        steps.push({
            step: 5,
            description: 'COFINS a Recolher (após créditos)',
            formula: `R$ ${cofinsBruto.toFixed(2)} - R$ ${creditoCOFINS.toFixed(2)}`,
            result: `R$ ${cofinsLiquido.toFixed(2)}`
        });
    }

    const total = pisLiquido + cofinsLiquido;
    steps.push({
        step: regime === 'naoCumulativo' ? 6 : 4,
        description: 'Total PIS + COFINS',
        formula: `R$ ${pisLiquido.toFixed(2)} + R$ ${cofinsLiquido.toFixed(2)}`,
        result: `R$ ${total.toFixed(2)}`
    });

    return {
        inputs: { ...inputs, aliqPIS, aliqCOFINS },
        resultado: { pisBruto, cofinsBruto, pisLiquido, cofinsLiquido, creditoPIS, creditoCOFINS, total },
        memory: steps,
        hash: generatePISCOFINSHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'Lei 10.637/2002 (PIS) • Lei 10.833/2003 (COFINS)'
    };
}

export function comparePISCOFINSRegimes(inputs) {
    const cumulativo = calculatePISCOFINSWithMemory({ ...inputs, regime: 'cumulativo' });
    const naoCumulativo = calculatePISCOFINSWithMemory({ ...inputs, regime: 'naoCumulativo' });

    return {
        cumulativo,
        naoCumulativo,
        diferenca: naoCumulativo.resultado.total - cumulativo.resultado.total,
        economiaPercentual: cumulativo.resultado.total > 0
            ? (((cumulativo.resultado.total - naoCumulativo.resultado.total) / cumulativo.resultado.total) * 100).toFixed(2)
            : '0.00'
    };
}
