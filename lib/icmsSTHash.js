/**
 * ICMS-ST Engine with Hash and Memory of Calculation
 * Cálculo de Substituição Tributária com memória auditável
 */

/**
 * Generate deterministic hash for ICMS-ST calculation
 */
export function generateICMSSTHash(inputs) {
    const {
        valorProduto, ipi, frete, seguro, outrasDespesas, desconto,
        mva, mvaOriginal, aliqInterna, aliqInterestadual, ufOrigem, ufDestino
    } = inputs;

    const inputString = [
        parseFloat(valorProduto || 0).toFixed(2),
        parseFloat(ipi || 0).toFixed(2),
        parseFloat(frete || 0).toFixed(2),
        parseFloat(seguro || 0).toFixed(2),
        parseFloat(outrasDespesas || 0).toFixed(2),
        parseFloat(desconto || 0).toFixed(2),
        parseFloat(mva || 0).toFixed(2),
        parseFloat(mvaOriginal || mva || 0).toFixed(2),
        parseFloat(aliqInterna || 0).toFixed(2),
        parseFloat(aliqInterestadual || 0).toFixed(2),
        (ufOrigem || '').toUpperCase(),
        (ufDestino || '').toUpperCase()
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
    return `ICMSST-${hash.padStart(12, '0')}`;
}

/**
 * Calculate MVA Ajustada
 * Fórmula: MVA Ajustada = [(1 + MVA Original) × (1 – Alíq. Interestadual) / (1 – Alíq. Interna)] – 1
 */
export function calcularMVAAjustada(mvaOriginal, aliqInterestadual, aliqInterna) {
    const mvaOrig = parseFloat(mvaOriginal) / 100;
    const aliqInter = parseFloat(aliqInterestadual) / 100;
    const aliqInt = parseFloat(aliqInterna) / 100;

    const mvaAjustada = ((1 + mvaOrig) * (1 - aliqInter) / (1 - aliqInt)) - 1;
    return mvaAjustada * 100;
}

/**
 * Calculate ICMS-ST with memory of calculation
 */
export function calculateICMSSTWithMemory(inputs) {
    const valorProduto = parseFloat(inputs.valorProduto) || 0;
    const ipi = parseFloat(inputs.ipi) || 0;
    const frete = parseFloat(inputs.frete) || 0;
    const seguro = parseFloat(inputs.seguro) || 0;
    const outrasDespesas = parseFloat(inputs.outrasDespesas) || 0;
    const desconto = parseFloat(inputs.desconto) || 0;
    const mva = parseFloat(inputs.mva) || 0;
    const aliqInterna = parseFloat(inputs.aliqInterna) || 0;
    const aliqInterestadual = parseFloat(inputs.aliqInterestadual) || 0;

    const steps = [];

    // Step 1: Base de Cálculo do ICMS Próprio
    const baseICMSProprio = valorProduto + frete + seguro + outrasDespesas - desconto;
    steps.push({
        step: 1,
        description: 'Base de Cálculo ICMS Próprio',
        formula: `R$ ${valorProduto.toFixed(2)} + R$ ${frete.toFixed(2)} + R$ ${seguro.toFixed(2)} + R$ ${outrasDespesas.toFixed(2)} - R$ ${desconto.toFixed(2)}`,
        result: `R$ ${baseICMSProprio.toFixed(2)}`
    });

    // Step 2: ICMS Próprio
    const icmsProprio = baseICMSProprio * (aliqInterestadual / 100);
    steps.push({
        step: 2,
        description: 'ICMS Próprio (Operação)',
        formula: `R$ ${baseICMSProprio.toFixed(2)} × ${aliqInterestadual}%`,
        result: `R$ ${icmsProprio.toFixed(2)}`
    });

    // Step 3: Valor do IPI
    const valorIPI = baseICMSProprio * (ipi / 100);
    steps.push({
        step: 3,
        description: 'IPI',
        formula: `R$ ${baseICMSProprio.toFixed(2)} × ${ipi}%`,
        result: `R$ ${valorIPI.toFixed(2)}`
    });

    // Step 4: Base de Cálculo ST
    const baseCalculoST = (baseICMSProprio + valorIPI) * (1 + mva / 100);
    steps.push({
        step: 4,
        description: 'Base de Cálculo ST',
        formula: `(R$ ${baseICMSProprio.toFixed(2)} + R$ ${valorIPI.toFixed(2)}) × (1 + ${mva}%)`,
        result: `R$ ${baseCalculoST.toFixed(2)}`
    });

    // Step 5: ICMS ST
    const icmsST = (baseCalculoST * (aliqInterna / 100)) - icmsProprio;
    steps.push({
        step: 5,
        description: 'ICMS-ST a Recolher',
        formula: `(R$ ${baseCalculoST.toFixed(2)} × ${aliqInterna}%) - R$ ${icmsProprio.toFixed(2)}`,
        result: `R$ ${icmsST.toFixed(2)}`
    });

    const hash = generateICMSSTHash(inputs);

    return {
        inputs,
        resultado: {
            baseICMSProprio,
            icmsProprio,
            valorIPI,
            baseCalculoST,
            icmsST: Math.max(0, icmsST), // Não pode ser negativo
            totalOperacao: baseICMSProprio + valorIPI + Math.max(0, icmsST)
        },
        memory: steps,
        hash,
        timestamp: new Date().toISOString(),
        baseLegal: 'LC 87/1996 - Lei Kandir'
    };
}

/**
 * Compare MVA Original vs MVA Ajustada
 */
export function compareICMSSTMethods(inputs) {
    // Cálculo com MVA Original
    const comMVAOriginal = calculateICMSSTWithMemory({
        ...inputs,
        mva: inputs.mvaOriginal || inputs.mva
    });

    // Cálculo com MVA Ajustada
    const mvaAjustada = calcularMVAAjustada(
        inputs.mvaOriginal || inputs.mva,
        inputs.aliqInterestadual,
        inputs.aliqInterna
    );

    const comMVAAjustada = calculateICMSSTWithMemory({
        ...inputs,
        mva: mvaAjustada
    });

    const diferenca = comMVAAjustada.resultado.icmsST - comMVAOriginal.resultado.icmsST;

    return {
        mvaOriginal: {
            ...comMVAOriginal,
            mvaUsada: parseFloat(inputs.mvaOriginal || inputs.mva)
        },
        mvaAjustada: {
            ...comMVAAjustada,
            mvaUsada: mvaAjustada
        },
        diferenca,
        diferencaPercentual: comMVAOriginal.resultado.icmsST > 0
            ? ((diferenca / comMVAOriginal.resultado.icmsST) * 100).toFixed(2)
            : '0.00'
    };
}
